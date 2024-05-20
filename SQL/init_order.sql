USE TestDB;
GO

CREATE TABLE Orders (
    OrderID INT IDENTITY(1,1) PRIMARY KEY,  -- 订单编号，自动递增
    PhoneNumber NVARCHAR(15),               -- 手机号
    ShopID INT,                            -- 店铺ID
    FOREIGN KEY (ShopID) REFERENCES TeaShops(ShopID)  -- 假设您已有TeaShops表
);

CREATE TABLE OrderDetails (
    OrderID INT,              -- 订单ID
    TeaID INT,                -- 奶茶ID
    Quantity INT,             -- 购买数量
    PRIMARY KEY (OrderID, TeaID),  -- 复合主键
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),  -- 外键，链接到Orders表
    FOREIGN KEY (TeaID) REFERENCES TeaDrinks(TeaID)    -- 假设您已有TeaDrinks表
);
