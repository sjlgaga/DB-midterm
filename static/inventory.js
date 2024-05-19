// inventory.js
document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const shopId = params.get('shopId');

    fetch(`/api/shopInventory/${shopId}`)
        .then(response => response.json())
        .then(data => {
            const inventoryList = document.getElementById('inventoryList');
            data.forEach(item => {
                const div = document.createElement('div');
                div.className = 'inventory-item'; // 应用我们定义的样式类
                div.innerHTML = `<strong>奶茶名称：</strong>${item.teaName}<br>
                                 <strong>配料：</strong>${item.ingredients}<br>
                                 <strong>库存：</strong>${item.stock}杯`;
                inventoryList.appendChild(div);
            });
        })
        .catch(error => console.error('Error:', error));
});
