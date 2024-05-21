CREATE DATABASE TestDB;
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

CREATE TABLE TeaDrinks (
    TeaID INT PRIMARY KEY IDENTITY(1,1),
    TeaName NVARCHAR(255),
    Ingredients NVARCHAR(1000)
);

CREATE TABLE TeaInventory (
    ShopID INT,
    TeaID INT,
    Stock INT,
    PRIMARY KEY (ShopID, TeaID),
    FOREIGN KEY (ShopID) REFERENCES TeaShops(ShopID),
    FOREIGN KEY (TeaID) REFERENCES TeaDrinks(TeaID)
);

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

-- 创建 Comments 表
CREATE TABLE Comments (
    CommentID INT IDENTITY(1,1) PRIMARY KEY,  -- 评论的ID，自动递增作为主键
    Username NVARCHAR(50),                   -- 用户的用户名
    ShopID INT,                             -- 店铺的ID
    Content NVARCHAR(1000),                  -- 评论的内容
    CONSTRAINT FK_Comments_ShopID FOREIGN KEY (ShopID) REFERENCES TeaShops(ShopID) -- 外键约束，引用TeaShops表
);


CREATE TABLE Ingredients (
    IngredientID INT PRIMARY KEY IDENTITY(1,1),
    IngredientName NVARCHAR(255)
);


CREATE TABLE TeaIngredients (
    TeaID INT,
    IngredientID INT,
    PRIMARY KEY (TeaID, IngredientID),
    FOREIGN KEY (TeaID) REFERENCES TeaDrinks(TeaID),
    FOREIGN KEY (IngredientID) REFERENCES Ingredients(IngredientID)
);

INSERT INTO TeaDrinks (TeaName)
VALUES 
(N'椰椰芒芒'),
(N'黑糖波波牛乳茶'),
(N'抹茶红豆奶茶'),
(N'桂花乌龙茶'),
(N'芝士蓝莓茶');

INSERT INTO Ingredients (IngredientName)
VALUES 
('椰果'),
('新鲜芒果片'),
('黑糖珍珠'),
('抹茶'),
('红豆'),
('桂花'),
('乌龙茶叶'),
('芝士奶盖'),
('蓝莓');

-- 假设 '椰椰芒芒' 的 TeaID 是 1, '椰果' 的 IngredientID 是 1, '新鲜芒果片' 的 IngredientID 是 2
INSERT INTO TeaIngredients (TeaID, IngredientID)
VALUES 
(1, 1),
(1, 2),
(2, 3),  -- 假设 '黑糖波波牛乳茶' 的 TeaID 是 2, '黑糖珍珠' 的 IngredientID 是 3
(3, 4),  -- '抹茶'
(3, 5),  -- '红豆'
(4, 6),  -- '桂花'
(4, 7),  -- '乌龙茶叶'
(5, 8),  -- '芝士奶盖'
(5, 9);  -- '蓝莓'


