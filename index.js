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
    }
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
    })
}

init();