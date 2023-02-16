INSERT INTO departments (dept_name)
VALUES 
    ('Human Resources'),
    ('Accounting'),
    ('Legal'),
    ('Facilities'),
    ('IT'),
    ('Sales'),
    ('Executive Offices');

INSERT INTO jobs (title, salary, dept)
VALUES
    ('Recruiter', 85000, 1),
    ('Onboarding Coordinator', 56000, 1),
    ('Background Checker', 46000, 1),
    ('Bookkeeper', 72000, 2),
    ('Auditor', 91000, 2),
    ('Controller', 97000, 2),
    ('Intern', 32000, 3),
    ('Lawyer I', 110000, 3),
    ('Lawyer II', 140000, 3),
    ('Custodian', 86000, 4),
    ('Electrician', 86000, 4),
    ('Groundskeeper', 92000, 4),
    ('Network Analyst', 115000, 5),
    ('Data Manager', 107000, 5),
    ('Security Specialist', 132000, 5),
    ('Regional Sales Lead', 120000, 6),
    ('Local Sales Lead', 81000, 6),
    ('Floor Salesman', 32000, 6),
    ('Receptionist', 48000, 7),
    ('Filing Clerk', 37000, 7),
    ('CEO', 2000000, 7);

INSERT INTO people (first_name, last_name, title_pay, dept_id)
VALUES
    ('Bill', 'Stein', 2, 1),
    ('Susie', 'Edwards', 15, 5),
    ('Sarah', 'Jackson', 5, 2),
    ('Clinton', 'McMurphy', 4, 2),
    ('Fred', 'Astair', 12, 4),
    ('Jack', 'Ripper', 6, 2),
    ('Paul', 'Smee', 8, 3),
    ('Laura', 'Engles', 9, 3),
    ('Tara', 'Pinkerton', 7, 3),
    ('Katrina', 'Tournay', 21, 7);