from flask import Flask, jsonify, render_template, request
from flask_cors import CORS
import db_utils as dbu

app = Flask(__name__)
CORS(app)  # 这会为所有域启用CORS

"""
app routes
"""

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/teashops')
def tea_shops():
    shop_list = dbu.get_shop_data()
    return jsonify(shop_list)

@app.route('/addTeaShop', methods=['POST'])
def add_tea_shop():
    data = request.get_json()
    address_id = dbu.insert_address(data['city'], data['district'], data['detailedAddress'])
    success = dbu.insert_tea_shop(data['brandName'], address_id, data['queueTime'])
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
    inventory_data = dbu.get_inventory_by_shop(shop_id)
    return jsonify(inventory_data)

@app.route('/api/teaOptions')
def get_tea_options():
    """API端点,获取所有可用的奶茶选项"""
    teas = dbu.get_all_teas()
    return jsonify(teas)

@app.route('/api/teaOptions/<int:shop_id>', methods=['GET'])
def get_tea_shops(shop_id):
    teas = dbu.get_teas_for_shop(shop_id)  # 假设这个函数根据店铺ID从数据库获取奶茶
    return jsonify(teas)


@app.route('/api/addInventory/<int:shop_id>', methods=['POST'])
def add_inventory(shop_id):
    """API端点,添加奶茶到指定店铺的库存"""
    data = request.get_json()
    tea_id = data.get('TeaID')
    stock = data.get('Stock')
    if not (tea_id and stock):
        return jsonify({'result': 'failure', 'message': 'Missing tea ID or stock information'}), 400
    result = dbu.add_tea_to_shop_inventory(shop_id, tea_id, stock)
    return jsonify({'result': 'success' if result else 'failure'})

@app.route('/api/deleteInventory/<int:shop_id>/<int:tea_id>', methods=['DELETE'])
def delete_inventory(shop_id, tea_id):
    result = dbu.remove_tea_from_inventory(shop_id, tea_id)
    if result:
        return jsonify({'result': 'success'}), 200  # 成功删除
    else:
        return jsonify({'result': 'failure', 'message': 'No matching record found or error occurred'}), 404  # 未找到记录或出现错误
    
@app.route('/api/createOrder', methods=['POST'])
def create_order():
    data = request.get_json()
    phone_number = data.get('PhoneNumber')
    shop_id = data.get('ShopID')

    if not phone_number or not shop_id:
        return jsonify({'error': 'Missing required parameters'}), 400

    try:
        order_id = dbu.create_order_in_database(phone_number, shop_id)
        return jsonify({'orderID': order_id, 'message': 'Order created successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/submitOrder/<int:shop_id>', methods=['POST'])
def submit_order(shop_id):
    data = request.get_json()
    order_details = data.get('orderDetails')
    order_id = data.get('orderId')  # 假设前端会发送orderId

    if not order_id:
        return jsonify({'success': False, 'message': 'Missing order ID'}), 400

    success = True
    for detail in order_details:
        tea_id = detail.get('teaId')
        quantity = detail.get('quantity')
        if not dbu.insert_order_details(order_id, tea_id, quantity):
            success = False
            break

    if success:
        return jsonify({'success': True, 'message': 'Order submitted successfully'}), 200
    else:
        return jsonify({'success': False, 'message': 'Failed to submit order details'}), 500
    
    
@app.route('/viewComments.html')
def comments_page():
    return render_template('viewComments.html')

@app.route('/api/getComments/<int:shop_id>', methods=['GET'])
def get_comments(shop_id):
    try:
        comments = dbu.get_comments_for_shop(shop_id)
        return jsonify(comments)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/addComment/<int:shop_id>', methods=['POST'])
def add_comment(shop_id):
    """添加评论到店铺"""
    data = request.get_json()
    username = data.get('Username')
    content = data.get('Content')
    if not username or not content:
        return jsonify({'success': False, 'message': '用户名和评论内容不能为空'}), 400

    if dbu.add_comment_to_db(username, shop_id, content):
        return jsonify({'success': True}), 201
    else:
        return jsonify({'success': False, 'message': '添加评论失败'}), 500


if __name__ == '__main__':
    app.run(host="localhost", port=8900,debug=True)
