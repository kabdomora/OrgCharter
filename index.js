const inquirer = require('inquirer ');


const action = [
    {
        type: 'rawlist',
        name: 'action',
        choices: [
            'View all Departments',
            'Add a New Department',
            'View all Positions',
            'Add a New Position',
            'View all Employees',
            'Add a New Employee',
            'Update an Existing Employee'
        ],
        message: 'Select from the following actions:'
    }
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
        choices: [
            // resource titles list from already stored jobs
        ],
        message: 'What is their role?'
    },
    {
        type: 'rawlist',
        name: 'dept',
        choices: [
            // resource Dept list from already stored departments
        ],
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
        choices: [
            // resource managers list from already stored people
        ],
        messages: 'Who is the assigned manager?',
        when: (confirm) => confirm.has_manager === true
    },
];

