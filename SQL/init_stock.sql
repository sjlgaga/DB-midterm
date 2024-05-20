USE TestDB;
GO

CREATE TABLE TeaInventory (
    ShopID INT,
    TeaID INT,
    Stock INT,
    PRIMARY KEY (ShopID, TeaID),
    FOREIGN KEY (ShopID) REFERENCES TeaShops(ShopID),
    FOREIGN KEY (TeaID) REFERENCES TeaDrinks(TeaID)
);

INSERT INTO TeaInventory (ShopID, TeaID, Stock)
VALUES
(1, 1, 50),  -- 假设店铺1有50杯椰椰芒芒
(1, 2, 30),  -- 假设店铺1有30杯黑糖波波牛乳茶
(2, 1, 20),  -- 假设店铺2有20杯椰椰芒芒
(2, 3, 15);  -- 假设店铺2有15杯抹茶红豆奶茶

SELECT * FROM TeaInventory;
