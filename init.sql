create database user_db;
CREATE TABLE user (
usr_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
usr_name VARCHAR(150),
usr_password VARCHAR(250)
);