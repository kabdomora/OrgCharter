DROP DATABASE IF EXISTS company_db;
CREATE DATABASE company_db;

USE company_db;

CREATE TABLE departments (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    dept_name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE jobs (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) UNIQUE NOT NULL,
    salary INT NOT NULL,
    dept INT,
    FOREIGN KEY (dept) REFERENCES departments(id) ON DELETE SET NULL        
);

CREATE TABLE people (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    manager INT,
    FOREIGN KEY (manager) REFERENCES people(id) ON DELETE SET NULL
    title_pay INT,
    FOREIGN KEY (title_pay) REFERENCES jobs(id) ON DELETE CASCADE
    dept_name INT,
    FOREIGN KEY (dept_name) REFERENCES departments(id) ON DELETE CASCADE
);