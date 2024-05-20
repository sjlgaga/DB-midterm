USE TestDB;
GO

-- 创建 Comments 表
CREATE TABLE Comments (
    CommentID INT IDENTITY(1,1) PRIMARY KEY,  -- 评论的ID，自动递增作为主键
    Username NVARCHAR(50),                   -- 用户的用户名
    ShopID INT,                             -- 店铺的ID
    Content NVARCHAR(1000),                  -- 评论的内容
    CONSTRAINT FK_Comments_ShopID FOREIGN KEY (ShopID) REFERENCES TeaShops(ShopID) -- 外键约束，引用TeaShops表
);

-- 可选: 插入示例数据进行测试
INSERT INTO Comments (Username, ShopID, Content)
VALUES ('user123', 1, 'Great tea and excellent service!'),
       ('user456', 1, 'Loved the ambiance and the matcha latte.'),
       ('user789', 2, 'Perfect place to relax and enjoy a cup of tea.'),
       ('kobe', 5, 'Man! What can I say!');
