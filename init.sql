create database user_db;
CREATE TABLE users_db (
usr_id SERIAL NOT NULL PRIMARY KEY,
usr_name VARCHAR(50),
usr_password VARCHAR(50)
);