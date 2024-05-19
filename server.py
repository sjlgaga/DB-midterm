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

if __name__ == '__main__':
    app.run(host="localhost", port=8900,debug=True)
