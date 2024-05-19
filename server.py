from flask import Flask, jsonify, render_template, request
from flask_cors import CORS

import pyodbc 


app = Flask(__name__)
CORS(app)  # 这会为所有域启用CORS

def get_db_connection():
    conn_str = (
    "Driver={ODBC Driver 18 for SQL Server};"
    "Server=localhost,1433;"
    "Database=TestDB;"
    "UID=sa;"
    "PWD=Byron123000;"
    "TrustServerCertificate=yes;"
    )

    conn = pyodbc.connect(conn_str)
    return conn

def get_shop_data():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT t.BrandName, a.City, a.District, a.DetailedAddress, t.QueueTime, t.ShopID
        FROM TeaShops t
        JOIN Addresses a ON t.AddressID = a.AddressID
    ''')
    data = cursor.fetchall()
    shop_data = [{'brand': row[0], 'city': row[1], 'district': row[2], 'detailed': row[3], 'queueTime': row[4], 'shopId': row[5]} for row in data]
    cursor.close()
    conn.close()
    return shop_data

def insert_address(city, district, detailed_address):
    conn = get_db_connection()
    cursor = conn.cursor()
    # 使用 OUTPUT 子句直接返回新插入的 ID
    sql = '''
        INSERT INTO Addresses (City, District, DetailedAddress)
        OUTPUT INSERTED.AddressID
        VALUES (?, ?, ?);
    '''
    cursor.execute(sql, (city, district, detailed_address))
    address_id = cursor.fetchone()[0]  # 获取插入的ID
    conn.commit()
    cursor.close()
    return address_id



def insert_tea_shop(brand_name, address_id, queue_time):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('INSERT INTO TeaShops (BrandName, AddressID, QueueTime) VALUES (?, ?, ?)', (brand_name, address_id, queue_time))
        conn.commit()  # 不要忘记提交事务
    except Exception as e:
        print("Error inserting into database: ", e)
        return False
    finally:
        cursor.close()
        conn.close()
    return True

def get_inventory_by_shop(shop_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    # SQL 查询将 TeaInventory 和 TeaDrinks 表进行联接
    sql_query = """
    SELECT d.TeaName, d.Ingredients, i.Stock
    FROM TeaInventory i
    JOIN TeaDrinks d ON i.TeaID = d.TeaID
    WHERE i.ShopID = ?
    """

    # 执行参数化查询
    cursor.execute(sql_query, (shop_id,))
    results = cursor.fetchall()

    # 格式化查询结果为字典列表
    inventory_list = [{
        "teaName": row[0],
        "ingredients": row[1],
        "stock": row[2]
    } for row in results]

    cursor.close()
    conn.close()
    return inventory_list

def get_all_teas():
    """从数据库中获取所有奶茶选项"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT TeaID, TeaName, Ingredients FROM TeaDrinks')
    teas = [{'TeaID': row[0], 'TeaName': row[1], 'Ingredients': row[2]} for row in cursor.fetchall()]
    cursor.close()
    conn.close()
    return teas

def add_tea_to_shop_inventory(shop_id, tea_id, stock):
    """将奶茶及其库存数量添加到指定店铺的库存中"""
    conn = get_db_connection()
    cursor = conn.cursor()
    # 检查该奶茶是否已存在于库存中
    cursor.execute('SELECT Stock FROM TeaInventory WHERE ShopID = ? AND TeaID = ?', (shop_id, tea_id))
    existing = cursor.fetchone()
    if existing:
        # 更新现有库存
        stock = int(stock)
        new_stock = existing[0] + stock
        cursor.execute('UPDATE TeaInventory SET Stock = ? WHERE ShopID = ? AND TeaID = ?', (new_stock, shop_id, tea_id))
    else:
        # 添加新库存记录
        stock = int(stock)
        cursor.execute('INSERT INTO TeaInventory (ShopID, TeaID, Stock) VALUES (?, ?, ?)', (shop_id, tea_id, stock))
    conn.commit()
    cursor.close()
    conn.close()
    return True

def remove_tea_from_inventory(shop_id, tea_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM TeaInventory WHERE ShopID = ? AND TeaID = ?', (shop_id, tea_id))
        rows_affected = cursor.rowcount  # 获取受影响的行数
        conn.commit()
        cursor.close()
        conn.close()
        if rows_affected > 0:
            return True  # 成功删除
        else:
            return False  # 未找到对应记录
    except Exception as e:
        print(f"Error: {e}")  # 打印错误信息（在生产环境中考虑使用日志记录）
        return False  # 处理异常情况


"""
############################################app routes#################################################
"""

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/teashops')
def tea_shops():
    shop_list = get_shop_data()
    return jsonify(shop_list)

@app.route('/addTeaShop', methods=['POST'])
def add_tea_shop():
    data = request.get_json()
    address_id = insert_address(data['city'], data['district'], data['detailedAddress'])
    success = insert_tea_shop(data['brandName'], address_id, data['queueTime'])
    if success:
        return jsonify({"message": "店铺添加成功"})
    else:
        return jsonify({"message": "添加店铺失败"}), 500

@app.route('/shop_inventory.html')
def shop_inventory_page():
    return render_template('shop_inventory.html')

@app.route('/api/shopInventory/<int:shop_id>')
def shop_inventory_api(shop_id):
    # 假设 get_inventory_by_shop 是从数据库获取数据的函数
    inventory_data = get_inventory_by_shop(shop_id)
    return jsonify(inventory_data)

@app.route('/api/teaOptions')
def get_tea_options():
    """API端点,获取所有可用的奶茶选项"""
    teas = get_all_teas()
    return jsonify(teas)

@app.route('/api/addInventory/<int:shop_id>', methods=['POST'])
def add_inventory(shop_id):
    """API端点,添加奶茶到指定店铺的库存"""
    data = request.get_json()
    tea_id = data.get('TeaID')
    stock = data.get('Stock')
    if not (tea_id and stock):
        return jsonify({'result': 'failure', 'message': 'Missing tea ID or stock information'}), 400
    result = add_tea_to_shop_inventory(shop_id, tea_id, stock)
    return jsonify({'result': 'success' if result else 'failure'})

@app.route('/api/deleteInventory/<int:shop_id>/<int:tea_id>', methods=['DELETE'])
def delete_inventory(shop_id, tea_id):
    result = remove_tea_from_inventory(shop_id, tea_id)
    if result:
        return jsonify({'result': 'success'}), 200  # 成功删除
    else:
        return jsonify({'result': 'failure', 'message': 'No matching record found or error occurred'}), 404  # 未找到记录或出现错误



if __name__ == '__main__':
    app.run(host="localhost", port=8900,debug=True)
