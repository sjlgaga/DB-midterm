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
        SELECT t.BrandName, a.City, a.District, a.DetailedAddress, t.QueueTime
        FROM TeaShops t
        JOIN Addresses a ON t.AddressID = a.AddressID
    ''')
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return data

def insert_tea_shop(brand_name, address, queue_time):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute('''
            INSERT INTO TeaShops (BrandName, Address, QueueTime)
            VALUES (?, ?, ?)
        ''', (brand_name, address, queue_time))
        conn.commit()  # 不要忘记提交事务
    except Exception as e:
        print("Error inserting into database: ", e)
        return False
    finally:
        cursor.close()
        conn.close()
    return True

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/teashops')
def tea_shops():
    data = get_shop_data()
    return jsonify([{'brand': row[0], 'address': row[1], 'queueTime': row[2]} for row in data])

@app.route('/addTeaShop', methods=['POST'])
def add_tea_shop():
    data = request.get_json()
    success = insert_tea_shop(data['brandName'], data['address'], data['queueTime'])
    if success:
        return jsonify({"message": "店铺添加成功"})
    else:
        return jsonify({"message": "添加店铺失败"}), 500

if __name__ == '__main__':
    app.run(host="localhost", port=8900,debug=True)
