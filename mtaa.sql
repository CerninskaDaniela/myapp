DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS labels CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS pictures CASCADE;
DROP TABLE IF EXISTS communications CASCADE;
DROP TABLE IF EXISTS label_products CASCADE;
DROP TABLE IF EXISTS messages CASCADE;

CREATE TABLE categories (
  id SERIAL NOT NULL PRIMARY KEY,
  name varchar(100) NOT NULL
);
CREATE TABLE labels (
  id SERIAL NOT NULL PRIMARY KEY,
  name varchar(25) NOT NULL
);
CREATE TABLE users (
  id SERIAL NOT NULL PRIMARY KEY,
  email varchar(25) NOT NULL,
  password varchar(50) NOT NULL,
  displayname varchar(20) NOT NULL,
  vorname varchar(20) NOT NULL,
  lastname varchar(20) NOT NULL
);
CREATE TABLE products(
  id SERIAL NOT NULL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id),
  category_id BIGINT NOT NULL REFERENCES categories(id),
  name varchar(50) NOT NULL,
  address varchar(100) NOT NULL,
  price integer,
  creationdate TIMESTAMP,
  body TEXT
);
CREATE TABLE pictures(
  id SERIAL NOT NULL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id),
  picture BYTEA
);
CREATE TABLE communications (
  id SERIAL NOT NULL PRIMARY KEY,
  seller_id BIGINT NOT NULL REFERENCES users(id),
  customer_id BIGINT NOT NULL REFERENCES users(id),
  product_id BIGINT NOT NULL REFERENCES products(id)
);
CREATE TABLE messages(
  id SERIAL NOT NULL PRIMARY KEY,
  communication_id BIGINT NOT NULL REFERENCES communications(id),
  user_id BIGINT NOT NULL REFERENCES users(id),
  body TEXT,
  creationdate TIMESTAMP
);
CREATE TABLE label_products(
  id SERIAL NOT NULL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id),
  label_id BIGINT NOT NULL REFERENCES labels(id)
);
INSERT INTO categories(name) VALUES
('toys'),
('reading'),
('kitchen'),
('clothes');
INSERT INTO labels(name) VALUES
('game'),
('book'),
('cooking'),
('music'),
('dress');
INSERT INTO users(email,password,displayname, vorname, lastname) VALUES
('horvathmartin@gmail.com','SuperTajneHeslo','Martin78','Martin','Horvath'),
('petranovakova@gmail.com','Hgf6s.#j','petka55','Petra','Novakova'),
('horvatheva@gmail.com','SuperTajneHeslo2','Evicka78','Eva','Horvath');
INSERT INTO products(user_id,category_id,name,address,price,creationdate,body) VALUES
(1,2,'book Cooking for beginners','Nitra','500','2024-04-14 19:02:49','This is a great book.'),
(1,2,'book How to play piano','Nitra','300','2024-04-14 19:05:23','This is a great book to read.'),
(2,4,'book How to play piano','Nitra','300','2024-04-14 19:15:23','This is a third book to read.');

INSERT INTO communications(seller_id,customer_id,product_id) VALUES
(1,2,1),
(1,2,2),
(2,3,3);
INSERT INTO messages(communication_id,user_id,body,creationdate) VALUES
(1,2,'Dobry den, mam zaujem o knihu Cooking, kedy si mozem vyzdvihnut','2024-04-15 09:02:00'),
(2,2,'Dobry den. Je to este aktualne?','2024-04-15 09:08:45'),
(1,1,'Dobry den, zajtra od 12-16 na adrese Hlavna 14, Nitra','2024-04-15 09:35:12'),
(2,1,'Zdravim, bohuzial uz nie.','2024-04-15 09:38:11'),
(1,2,'Tak sa vidime asi o druhej','2024-04-15 11:48:25');
INSERT INTO label_products(product_id,label_id) VALUES
(1,2),
(1,3),
(2,3),
(2,4);
