DROP DATABASE IF EXISTS bamazon_DB;

CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products(
    id INTEGER(11) AUTO_INCREMENT NOT  NULL,
    product_name VARCHAR(20) NOT NULL,
    depart_name VARCHAR(20)  NOT NULL,
    price DECIMAL(18,2) NOT NULL,
    stock INTEGER(111),
    PRIMARY KEY(id)
);

INSERT INTO bamazon_DB (product_name, depart_name, price, stock)
VALUES ("Electric Shaver", "Hygiene", 40.00, 20);

INSERT INTO bamazon_DB (product_name, depart_name, price, stock)
VALUES ("Video Game", "Electronics", 150.00, 20);

INSERT INTO bamazon_DB (product_name, depart_name, price, stock)
VALUES ("TV", "Electronics", 450.00, 20);

INSERT INTO bamazon_DB (product_name, depart_name, price, stock)
VALUES ("Food", "Produce", 10.00, 20);

INSERT INTO bamazon_DB (product_name, depart_name, price, stock)
VALUES ("Cleaning Supplies", "Household goods", 8.00, 20);

INSERT INTO bamazon_DB (product_name, depart_name, price, stock)
VALUES ("Couches", "Furniture", 800.00, 10);

INSERT INTO bamazon_DB (product_name, depart_name, price, stock)
VALUES ("Dish Washer", "Appliances", 650.00, 10);

INSERT INTO bamazon_DB (product_name, depart_name, price, stock)
VALUES ("Stove", "Appliances", 700.00, 20);

INSERT INTO bamazon_DB (product_name, depart_name, price, stock)
VALUES ("Bed Frame", "Furniture", 200.00, 20);

INSERT INTO bamazon_DB (product_name, depart_name, price, stock)
VALUES ("Speakers", "Electronics", 200.00, 15);