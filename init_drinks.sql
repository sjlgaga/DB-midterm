USE TestDB;
GO

CREATE TABLE TeaDrinks (
    TeaID INT PRIMARY KEY IDENTITY(1,1),
    TeaName NVARCHAR(255),
    Ingredients NVARCHAR(1000)
);

INSERT INTO TeaDrinks (TeaName, Ingredients)
VALUES 
(N'椰椰芒芒', N'椰果, 新鲜芒果片'),
(N'黑糖波波牛乳茶', N'黑糖珍珠'),
(N'抹茶红豆奶茶', N'抹茶, 红豆'),
(N'桂花乌龙茶', N'桂花, 乌龙茶叶'),
(N'芝士蓝莓茶', N'芝士奶盖, 蓝莓');

SELECT * FROM TeaDrinks;
