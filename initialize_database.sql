USE TestDB;
GO

-- 创建 Addresses 表
CREATE TABLE Addresses (
    AddressID INT PRIMARY KEY IDENTITY(1,1),
    City NVARCHAR(100),
    District NVARCHAR(100),
    DetailedAddress NVARCHAR(255)
);

-- 创建 TeaShops 表
CREATE TABLE TeaShops (
    ShopID INT PRIMARY KEY IDENTITY(1,1),
    BrandName NVARCHAR(255),
    AddressID INT,
    QueueTime INT,
    FOREIGN KEY (AddressID) REFERENCES Addresses(AddressID)
);


-- 插入地址数据到 Addresses 表
INSERT INTO Addresses (City, District, DetailedAddress)
VALUES (N'上海', N'黄浦区', N'南京东路300号'),
       (N'北京', N'朝阳区', N'三里屯SOHO'),
       (N'广州', N'天河区', N'体育西路');

-- 插入店铺数据到 TeaShops 表
INSERT INTO TeaShops (BrandName, AddressID, QueueTime)
VALUES (N'茶百道', 1, 15),
       (N'喜茶', 2, 20),
       (N'一点点', 3, 10);


-- 查询所有店铺及其地址信息
SELECT t.ShopID, t.BrandName, a.City, a.District, a.DetailedAddress, t.QueueTime
FROM TeaShops t
JOIN Addresses a ON t.AddressID = a.AddressID;

