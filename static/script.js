function fetchShopData() {
    fetch('/teashops')
        .then(response => response.json())
        .then(data => {
            data.sort((a, b) => a.queueTime - b.queueTime);  // 按排队时间排序
            const shopList = document.getElementById('shopList');
            shopList.innerHTML = '';
            data.forEach(shop => {
                const div = document.createElement('div');
                div.className = 'shop';
                div.innerHTML = `<strong>品牌名：</strong>${shop.brand}<br>
                                 <strong>地址：</strong>${shop.address}<br>
                                 <strong>排队时间：</strong>${shop.queueTime}分钟`;
                shopList.appendChild(div);
            });
        })
        .catch(error => console.error('Error:', error));
}

document.getElementById('refreshButton').addEventListener('click', fetchShopData);

fetchShopData();

document.getElementById('addShopButton').addEventListener('click', function() {
    document.getElementById('addShopModal').style.display = 'block';
});

document.getElementsByClassName('close')[0].addEventListener('click', function() {
    document.getElementById('addShopModal').style.display = 'none';
});

document.getElementById('addShopForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const brandName = document.getElementById('brandName').value;
    const address = document.getElementById('address').value;
    const queueTime = document.getElementById('queueTime').value;

    fetch('/addTeaShop', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ brandName: brandName, address: address, queueTime: parseInt(queueTime) })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        document.getElementById('addShopModal').style.display = 'none';
        fetchShopData(); // 重新加载列表
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

