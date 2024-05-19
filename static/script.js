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
                                 <strong>地址：</strong>${shop.city} ${shop.district}, ${shop.detailed}<br>
                                 <strong>排队时间：</strong>${shop.queueTime}分钟`;
                div.onclick = function() {
                    window.location.href = `/shop_inventory.html?shopId=${shop.shopId}`; // 确保后端能解析此 URL
                    };
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
    const city = document.getElementById('city').value + "市";
    const district = document.getElementById('district').value + "区";
    const detailedAddress = document.getElementById('detailedAddress').value;
    const queueTime = document.getElementById('queueTime').value;

    fetch('/addTeaShop', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            brandName: brandName,
            city: city,
            district: district,
            detailedAddress: detailedAddress,
            queueTime: parseInt(queueTime)
        })
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

