// inventory.js

document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const shopId = params.get('shopId');
    const refreshButton = document.getElementById('refreshInventoryButton');
        // 封装加载库存列表的函数
        function loadInventory() {
            fetch(`/api/shopInventory/${shopId}`)
                .then(response => response.json())
                .then(data => {
                    const inventoryList = document.getElementById('inventoryList');
                    inventoryList.innerHTML = ''; // 清空当前内容
                    data.forEach(item => {
                        const div = document.createElement('div');
                        div.className = 'inventory-item';
                        div.innerHTML = `<strong>奶茶名称：</strong>${item.teaName}<br>
                                         <strong>配料：</strong>${item.ingredients}<br>
                                         <strong>库存：</strong>${item.stock}杯`;
                        inventoryList.appendChild(div);
                    });
                })
                .catch(error => console.error('Error:', error));
        }
    // 页面加载时加载库存
    loadInventory();

    // 刷新按钮点击事件
    refreshButton.addEventListener('click', function() {
        loadInventory();  // 执行加载库存的函数
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const addTeaButton = document.getElementById('addTeaButton');
    const addTeaModal = document.getElementById('addTeaModal');
    const teaSelect = document.getElementById('teaSelect');
    const params = new URLSearchParams(window.location.search);
    const shopId = params.get('shopId');

    // 加载可用奶茶列表

     // 封装加载库存列表的函数
     function loadInventory() {
        fetch(`/api/shopInventory/${shopId}`)
            .then(response => response.json())
            .then(data => {
                const inventoryList = document.getElementById('inventoryList');
                inventoryList.innerHTML = ''; // 清空当前内容
                data.forEach(item => {
                    const div = document.createElement('div');
                    div.className = 'inventory-item';
                    div.innerHTML = `<strong>奶茶名称：</strong>${item.teaName}<br>
                                     <strong>配料：</strong>${item.ingredients}<br>
                                     <strong>库存：</strong>${item.stock}杯`;
                    inventoryList.appendChild(div);
                });
            })
            .catch(error => console.error('Error:', error));
    }

    function loadTeaOptions() {
        fetch('/api/teaOptions')
            .then(response => response.json())
            .then(teas => {
                teaSelect.innerHTML = '';
                teas.forEach(tea => {
                    let option = new Option(tea.TeaName, tea.TeaID);
                    teaSelect.appendChild(option);
                });
            });
    }

    // 显示添加库存模态
    addTeaButton.onclick = () => {
        addTeaModal.style.display = 'block';
        loadTeaOptions();
    };

    

    // 将新库存添加到数据库
    window.addTeaToInventory = function() {
        let teaId = teaSelect.value;
        let stock = document.getElementById('stockInput').value;
        fetch(`/api/addInventory/${shopId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ TeaID: teaId, Stock: stock })
        })
        .then(response => response.json())
        .then(result => {
            console.log(result);
            alert('库存已更新！');
            addTeaModal.style.display = 'none';
            loadInventory();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('添加库存失败！');
        });
    };
});

document.addEventListener('DOMContentLoaded', function() {
    const deleteTeaButton = document.getElementById('deleteTeaButton');
    const deleteTeaModal = document.getElementById('deleteTeaModal');
    const deleteTeaSelect = document.getElementById('deleteTeaSelect');
    const shopId = new URLSearchParams(window.location.search).get('shopId');

    // 函数：加载可删除的奶茶列表
     // 封装加载库存列表的函数
     function loadInventory() {
        fetch(`/api/shopInventory/${shopId}`)
            .then(response => response.json())
            .then(data => {
                const inventoryList = document.getElementById('inventoryList');
                inventoryList.innerHTML = ''; // 清空当前内容
                data.forEach(item => {
                    const div = document.createElement('div');
                    div.className = 'inventory-item';
                    div.innerHTML = `<strong>奶茶名称：</strong>${item.teaName}<br>
                                     <strong>配料：</strong>${item.ingredients}<br>
                                     <strong>库存：</strong>${item.stock}杯`;
                    inventoryList.appendChild(div);
                });
            })
            .catch(error => console.error('Error:', error));
    }

    function loadDeleteOptions() {
        fetch('/api/teaOptions')
            .then(response => response.json())
            .then(teas => {
                deleteTeaSelect.innerHTML = ''; // 清空之前的选项
                teas.forEach(tea => {
                    let option = new Option(tea.TeaName, tea.TeaID);
                    deleteTeaSelect.appendChild(option);
                });
            });
    }

    // 显示删除库存模态
    deleteTeaButton.onclick = () => {
        deleteTeaModal.style.display = 'block';
        loadDeleteOptions();
    };

    // 删除库存项
    window.deleteTeaFromInventory = function() {
        let teaId = deleteTeaSelect.value;  // 获取选中的奶茶ID
        fetch(`/api/deleteInventory/${shopId}/${teaId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                alert('删除失败：');  // 如果响应不是200，抛出错误
            }
            return response.json();  // 解析JSON数据
        })
        .then(result => {
            if (result.result === 'success') {
                alert('库存已删除！');
                deleteTeaModal.style.display = 'none';  // 关闭模态框
                loadInventory();  // 重新加载库存列表，确保界面更新
            } else {
                alert('删除失败：' + result.message);  // 显示失败消息
            }
        })
        .catch(error => {
            //console.error('Error:', error);
            //alert('删除失败：' + error.message);  // 捕获错误并显示
        });
    };
    
});

document.addEventListener('DOMContentLoaded', function() {
    const shopId = new URLSearchParams(window.location.search).get('shopId');
    const startOrderButton = document.getElementById('startOrderButton');
    const phoneNumberInput = document.getElementById('phoneNumberInput');
    const orderInterface = document.getElementById('orderInterface');
    const teaOrderList = document.getElementById('teaOrderList');
    let currentOrderId = null;

    startOrderButton.onclick = function() {
        const phoneNumber = phoneNumberInput.value;
        const phoneRegex = /^\d{11}$/;  // 正则表达式，检查是否是11位数字

        if (!phoneNumber) {
            alert('请输入手机号！');
            return;
        } else if (!phoneRegex.test(phoneNumber)) {
            alert('手机号必须是11位数字！');
            return;
        }
        createOrder(phoneNumber, shopId);
    };

    function createOrder(phoneNumber, shopId) {
        fetch(`/api/createOrder`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ PhoneNumber: phoneNumber, ShopID: shopId })
        })
        .then(response => response.json())
        .then(order => {
            if (order.orderID) {
                currentOrderId = order.orderID; // 保存订单ID
                orderInterface.style.display = 'block';
                loadTeas(shopId);
            } else {
                alert('订单创建失败：' + order.message);
            }
        })
        .catch(error => console.error('Error creating order:', error));
    }

    function loadTeas() {
        fetch(`/api/teaOptions/${shopId}`)
        .then(response => response.json())
        .then(teas => {
            teaOrderList.innerHTML = '';
            teas.forEach(tea => {
                const teaDiv = document.createElement('div');
                teaDiv.innerHTML = `${tea.TeaName} <button onclick="updateQuantity(${tea.TeaID}, -1)">-</button> <input type="number" id="tea${tea.TeaID}" value="0" min="0"> <button onclick="updateQuantity(${tea.TeaID}, 1)">+</button>`;
                teaOrderList.appendChild(teaDiv);
            });
        });
    }

    window.updateQuantity = function(teaId, change) {
        const inputField = document.getElementById(`tea${teaId}`);
        let currentValue = parseInt(inputField.value);
        currentValue = Math.max(0, currentValue + change);
        inputField.value = currentValue;
    };

    window.submitOrder = function() {
        const orderDetails = [];
        document.querySelectorAll('input[type="number"]').forEach(input => {
            const teaId = input.id.replace('tea', '');
            const quantity = parseInt(input.value);
            if (quantity > 0) {
                orderDetails.push({ teaId: teaId, quantity: quantity });
            }
        });
    
        fetch(`/api/submitOrder/${shopId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: currentOrderId, orderDetails: orderDetails })
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert('订单提交成功！');
                location.reload(); // 刷新页面或做其他的页面清理工作
            } else {
                alert('订单提交失败：' + result.message);
            }
        })
        .catch(error => {
            console.error('Error submitting order:', error);
            alert('订单提交失败！');
        });
    };
});

