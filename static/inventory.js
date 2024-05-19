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
