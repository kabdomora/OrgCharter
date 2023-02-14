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
    dept_name VARCHAR(30),
    FOREIGN KEY (dept_name) REFERENCES departments(id) ON DELETE SET NULL        
);

CREATE TABLE people (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    manager VARCHAR(30),
    FOREIGN KEY (manager) REFERENCES people(id) ON DELETE SET NULL
    title VARCHAR(30),
    FOREIGN KEY (title) REFERENCES jobs(id) ON DELETE CASCADE
    dept_name VARCHAR(30),
    FOREIGN KEY (dept_name) REFERENCES departments(id) ON DELETE CASCADE
    salary INT,
    FOREIGN KEY (salary) REFERENCES jobs(id) ON DELETE SET NULL
);