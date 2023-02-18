const inquirer = require('inquirer');
const connection = require('./db/connection');
const cTable = require('console.table');

/////// EXAMPLE ///////
// console.table([
//     {
//       name: 'foo',
//       age: 10
//     }, {
//       name: 'bar',
//       age: 20
//     }
//   ]);
  
//   // prints
//   name  age
//   ----  ---
//   foo   10
//   bar   20

const selectManager = 'Select the **EMPLOYEE ID** of the assigned manager. Refer to the table of employees for assistance.';

const deptStore = [
    // query already stored departments. output comma delimeted list of names
];

const jobStore = [
    // query already stored jobs. output comma delimeted list of titles
];

const personStore = [
    // query already stored persons. output comma delimeted list of employee-ids
];

const action = [
    {
        type: 'rawlist',
        name: 'action',
        choices: [
            'View all Departments',
            // no additional prompt needed. SQL command
            'Add a New Department',
            // launch department array prompt
            'Delete an Existing Department',
            // launch department array prompt + okdelete array prompt
            'View all Positions',
            // no additional prompt needed. SQL command
            'Add a New Position',
            // launch job array prompt
            'Delete an Existing Position',
            // launch jobless array prompt + okdelete array prompt
            'View all Employees',
            // no additional prompt needed. SQL command
            'Add a New Employee',
            // launch person array prompt
            'Update an Existing Employee',
            // launch uperson array prompt
            'Delete an Existing Employee',
            // launch personless array prompt + okdelete array prompt
            'View Employees by Manager',
            // no additional prompt needed. SQL command
            'View Employees by Department',
            // no additional prompt needed. SQL command
            'View Salary Liability by Department'
            // no additional prompt needed. SQL command
        ],
        message: 'Select from the following actions:'
    },
];

const another = [
    {
        type: 'confirm',
        name: 'next_action',
        message: 'Would you like to do something else?',
        default: 'true'
    },
];

const okdelete = [
    {
        type: 'confirm',
        name: 'delete',
        message: 'Are you sure you want to delete this item? Related profiles in other tables may be affected.',
        default: 'true'
    },
];

const department = [
    {
        type: 'input',
        name: 'dept_name',
        message: 'Enter the Department Name'
    },
];

const job = [
    {
        type: 'input',
        name: 'title',
        message: 'What role?'
    },
    {
        type: 'input',
        name: 'salary',
        message: 'How much do individuals in thie role earn?'
    },
    {
        type: 'rawlist',
        name: 'dept',
        choices: [
            // resource Dept list from already stored departments
        ],
        message: 'What dept does this role belong to?'

    },
];

const jobless = [
    {
        type: 'input',
        name: 'title',
        message: 'What role is no longer in use?'
    },
];

const person = [
    {
        type: 'input',
        name: 'first_name',
        message: 'Enter First Name'
    },
    {
        type: 'input',
        name: 'last_name',
        message: 'Enter Last Name'
    },
    {
        type: 'rawlist',
        name: 'role',
        choices: [jobStore],
        message: 'What is their role?'
    },
    {
        type: 'rawlist',
        name: 'dept',
        choices: [deptStore],
        message: 'What dept does this role belong to?'
    },
    {
        type: 'confirm',
        name: 'has_manager',
        message: 'Does this person have an assigned manager?',
        default: 'true'
    },
    {
        type: 'rawlist',
        name: 'manager',
        choices: [personStore],
        messages: selectManager,
        when: (confirm) => confirm.has_manager === true
    },
];

const personless = [
    {
        type: 'input',
        name: 'emp_id',
        message: 'Enter the employee ID for the person that should be terminated.'
    },
];

const uperson = [
    {
        type: 'rawlist',
        name: 'update_choice',
        choices: [
            'first_name',
            'last_name',
            'role',
            'dept',
            'manager'
        ],
        message: 'What field would you like to update?'
    },
    {
        type: 'input',
        name: 'update_first',
        message: 'Please provide the new First Name',
        when: (rawlist) => rawlist.update_choice === 'first_name'
    },
    {
        type: 'input',
        name: 'update_last',
        message: 'Please provide the new Last Name',
        when: (rawlist) => rawlist.update_choice === 'last_name'
    },
    {
        type: 'rawlist',
        name: 'update_role',
        choices: [jobStore],
        message: 'Please select the new role from the list of titles.',
        when: (rawlist) => rawlist.update_choice === 'role'
    },
    {
        type: 'rawlist',
        name: 'update_dept',
        choices: [deptStore],
        message: 'Please select the new Department from the list of Departments',
        when: (rawlist) => rawlist.update_choice === 'dept'
    },
    {
        type: 'rawlist',
        name: 'update_manager',
        choices: [personStore],
        message: selectManager,
        when: (rawlist) => rawlist.update_choice === 'manager'
    },
];

const managers = [
    {
        type: 'confirm',
        name: 'allmanagers',
        message: 'You must have the employee ID of the manager to proceed. If you already have this select Yes to proceed, else go back and view managers first',
        default: true
    },
    {
        type: 'input',
        name: 'managerID',
        message: "What is the manager's employee ID?",
        when: (confirm) => confirm.allmanagers === true
    },
];

// JOIN Example
// SELECT
//   favorite_books.book_name AS name, book_prices.price AS price
// FROM favorite_books
// JOIN book_prices ON favorite_books.book_price = book_prices.id;

// translated: find the book_name and rename the column name ALSO the price and rename it price
// from the table favorite_books
// to pull in the price value instead JOIN the tables book_prices at the related field book_price by using the id saved for the lookup

function init() {
    inquirer.prompt(action)
    .then(chosen => {
        console.log(chosen.action);
        let choice = chosen.action;
        if(choice === 'View all Departments') {
            viewDepartments()
        } else if(choice === 'Add a New Department') {
            inquirer.prompt(department)
            .then(newdep => {
                addDepartment(newdep.dept_name);
                console.log(`${newdep.dept_name} has been added to the Department list`);
                nextAction();
            })
        } else if(choice === 'Delete an Existing Department') {
            deleteDepartment(choice);
            nextAction();
        } else if(choice === 'View all Positions') {
            viewJobs()
        } else if(choice === 'Add a New Position') {
            inquirer.prompt(job)
            .then(newjob => {
                addJob(newjob);
                console.log(`${newjob.title} has been added to the Jobs list`);
                nextAction();
            })
        } else if(choice === 'Delete an Existing Position') {
            deleteJob(choice);
            nextAction();
        } else if(choice === 'View all Employees') {
            viewEmployees()
        } else if(choice === 'Add a New Employee') {
            inquirer.prompt(person)
            .then(newper => {
                addEmployee(newper);
                console.log(`${newper.first_name} ${newper.last_name} has been added to the list of current Employees`);
                nextAction();
            })            
        } else if(choice === 'Update an Existing Employee') {
            updateEmployee(choice);
            nextAction();
        } else if(choice === 'Delete an Existing Employee') {
            deleteEmployee(choice);
            nextAction();
        } else if(choice === 'View Employees by Manager') {
            inquirer.prompt(managers)
            .then(selected => {
                viewBman(selected);
            })
        } else if(choice === 'View Employees by Department') {
            viewBdept(choice);
            nextAction();
        } else if(choice === 'View Salary Liability by Department') {
            viewCost(choice);
            nextAction();
        } else {
            // close program function
        }

    })
}

function viewDepartments() {    
    connection.query(`SELECT id AS department_id, dept_name AS department_name FROM departments;`, function (err, deptInfo) {
        console.table(deptInfo);
        nextAction();
    })
}

function addDepartment(newdep) {
    connection.query(`INSERT INTO departments (dept_name) VALUES ("${newdep}")`)
}

function deleteDepartment() {

}

function viewJobs() {
    connection.query(`SELECT jobs.id AS title_code, jobs.title AS title, jobs.salary AS compensation, departments.dept_name AS home_department FROM jobs JOIN departments ON jobs.dept = departments.id;`, function (err, jobInfo) {
        console.table(jobInfo);
        nextAction();
    })
}

function addJob(newjob) {
    connection.query(`INSERT INTO jobs (title, salary, dept) VALUES ("${newjob.title}", ${newjob.salary}, ${newjob.dept})`)
}

function deleteJob() {

}

function viewEmployees() {
    connection.query(`SELECT people.id AS employee_id, people.first_name AS first, people.last_name AS last, jobs.title AS title, CONCAT(manager.first_name,' ',manager.last_name) AS manager, jobs.salary AS annual_rate, departments.dept_name AS home_department FROM people JOIN jobs ON people.title_pay = jobs.id JOIN departments on people.dept_id = departments.id LEFT JOIN people manager on manager.id = people.manager_id;`, function (err, empInfo) {
        console.table(empInfo);
        nextAction();
    })
}

function addEmployee(newper) {
    let first = newper.first_name;
    let last = newper.last_name;
    let manager = newper.manager;
    let role = newper.title_pay;
    let dept = newper.dept_id;

    if(manager && role && dept) {
        connection.query(`INSERT INTO people (first_name, last_name, manager, title_pay, dept_id) VALUES ("${first}", "${last}", ${manager}, ${role}, ${dept})`)
    } else if(manager && role) {
        connection.query(`INSERT INTO people (first_name, last_name, manager, title_pay) VALUES ("${first}", "${last}", ${manager}, ${role})`)
    } else if(manager && dept) {
        connection.query(`INSERT INTO people (first_name, last_name, manager, dept_id) VALUES ("${first}", "${last}", ${manager}, ${dept})`)
    } else if(role && dept) {
        connection.query(`INSERT INTO people (first_name, last_name, title_pay, dept_id) VALUES ("${first}", "${last}", ${role}, ${dept})`)
    } else if(role) {
        connection.query(`INSERT INTO people (first_name, last_name, manager, title_pay, dept_id) VALUES ("${first}", "${last}", ${role})`)
    } else if(manager) {
        connection.query(`INSERT INTO people (first_name, last_name, manager, title_pay, dept_id) VALUES ("${first}", "${last}", ${manager})`)
    } else if(dept) {
        connection.query(`INSERT INTO people (first_name, last_name, manager, title_pay, dept_id) VALUES ("${first}", "${last}", ${dept})`)
    } else {
        console.log("Something went wrong, try again!")
    }
}

function updateEmployee() {
    
}

function deleteEmployee() {
    
}

function viewBman(manager) {
    connection.query(`SELECT people.id AS employee_id, people.first_name AS first, people.last_name AS last, jobs.title AS title, jobs.salary AS annual_rate, departments.dept_name AS home_department FROM people JOIN jobs ON people.title_pay = jobs.id JOIN departments on people.dept_id = departments.id WHERE manager_id = ${manager.managerID};`, function (err, empInfo) {
        console.table(empInfo);
        nextAction();
    })
}

function viewBdept() {

}

function viewCost() {

}

function nextAction() {
    inquirer.prompt(another)
    .then(next => {
        if(next.next_action === true) {
            init();
        } else {
            console.log('Goodbye!')
        }
    });
}

init();