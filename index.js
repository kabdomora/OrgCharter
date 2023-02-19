const inquirer = require('inquirer');
const connection = require('./db/connection');
const cTable = require('console.table');

let deptStore = [
    // query already stored departments. output comma delimeted list of names
];

let storeJob = [
    // query already stored jobs. output comma delimeted list of titles
];

let personStore = [
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
            'View all Managers',
            // no additional prompt needed. SQL command
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
        message: 'Enter the Department Name',
        validate: (answer) => {
            if(answer.trim() === "") {
                return "Department Name is a mandatory field. Please enter the Department Name"
            } return true;
        },
    },
];

const departments = [
    {
        type: 'confirm',
        name: 'alldepts',
        message: 'You must have the department code (as opposed to name) to proceed. If you already have this select Yes to proceed, else go back and view departments first',
        default: true
    },
    {
        type: 'input',
        name: 'deptID',
        message: "What is the department code?",
        when: (confirm) => confirm.alldepts === true,
        validate: (answer) => {
            if (isNaN(answer)) {
                return "Department Code is a numeric field. Please enter the numeric Department Code"
            } else if(answer.trim() === "") {
                return "Department Code is a mandatory field. Please enter the Department Code"
            } return true;
        },
    },
];

const job = [
    {
        type: 'input',
        name: 'dept',
        message: `What is the department code for this role's Home Department?`,
        validate: (answer) => {
            if (isNaN(answer)) {
                return "Department Code is a numeric field. Please enter the numeric Department Code"
            } else if(answer.trim() === "") {
                return "Department Code is a mandatory field. Please enter the Department Code"
            } return true;
        },
    },
    {
        type: 'input',
        name: 'salary',
        message: 'How much do individuals in thie role earn?',
        validate: (answer) => {
            if (isNaN(answer)) {
                return "Salary is a numeric field. Please enter the numeric Salary"
            } else if(answer.trim() === "") {
                return "Salary is a mandatory field. Please enter the Salary"
            } return true;
        },
    },
    {
        type: 'input',
        name: 'title',
        message: `What is the Title Name for this new role?`,
        validate: (answer) => {
            if(answer.trim() === "") {
                return "Title Name is a mandatory field. Please enter the Title Name"
            } return true;
        },

    },
];

const jobless = [
    {
        type: 'input',
        name: 'titleGone',
        message: 'Enter the Title Code for the role that should be eliminated.',
        validate: (answer) => {
            if (isNaN(answer)) {
                return "Title Code is a numeric field. Please enter the numeric Title Code"
            } else if(answer.trim() === "") {
                return "Title Code is a mandatory field. Please enter the Title Code"
            } return true;
        },
    },
];

const person = [
    {
        type: 'input',
        name: 'dept',
        message: `What is the Department Code for this Employee's Home Department? `,
        validate: (answer) => {
            if (isNaN(answer)) {
                return "Department Code is a numeric field. Please enter the numeric Department Code"
            } else if(answer.trim() === "") {
                return "Department Code is a mandatory field. Please enter the Department Code"
            } return true;
        },
    },
    {
        type: 'input',
        name: 'role',
        message: `What is the title code for this Employee's position?`,
        validate: (answer) => {
            if (isNaN(answer)) {
                return "Title Code is a numeric field. Please enter the numeric Title Code"
            } else if(answer.trim() === "") {
                return "Title Code is a mandatory field. Please enter the Title Code"
            } return true;
        },
    },
    {
        type: 'input',
        name: 'first_name',
        message: 'Enter First Name',
        validate: (answer) => {
            if(answer.trim() === "") {
                return "Employee First Name is a mandatory field. Please enter the Employee First Name"
            } return true;
        },
    },
    {
        type: 'input',
        name: 'last_name',
        message: 'Enter Last Name',
        validate: (answer) => {
            if(answer.trim() === "") {
                return "Employee Last Name is a mandatory field. Please enter the Employee Last Name"
            } return true;
        },
    },
    {
        type: 'confirm',
        name: 'has_manager',
        message: 'Does this person have an assigned manager?',
        default: 'true'
    },
    {
        type: 'input',
        name: 'manager',
        message: 'Enter the **EMPLOYEE ID** of the assigned manager. Refer to the table of managers for assistance.',
        when: (confirm) => confirm.has_manager === true,
        validate: (answer) => {
            if (isNaN(answer)) {
                return "Manager ID is a numeric field. Please enter the numeric Manager ID"
            } else if(answer.trim() === "") {
                return "Manager ID is a mandatory field. Please enter the Manager ID"
            } return true;
        },
    },
];

const personSure = [
    {
        type: 'confirm',
        name: 'person_proceed',
        message: `You must have ready the Department Code and Title Code for the new Employee, as well as Manager's Employee ID if a Manager has already been assigned. If you have these, select Yes to proceed. Else go back and view these details first.`,
        default: 'true'
    },
];

const personless = [
    {
        type: 'input',
        name: 'emp_id',
        message: 'Enter the employee ID for the person that should be terminated.',
        validate: (answer) => {
            if (isNaN(answer)) {
                return "Employee ID is a numeric field. Please enter the numeric Employee ID"
            } else if(answer.trim() === "") {
                return "Employee ID is a mandatory field. Please enter the Employee ID"
            } return true;
        },
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
        name: 'empl_id',
        message: 'What is the Employee ID for this person?',
        validate: (answer) => {
            if (isNaN(answer)) {
                return "Employee ID is a numeric field. Please enter the numeric Employee ID"
            } else if(answer.trim() === "") {
                return "Employee ID is a mandatory field. Please enter the Employee ID"
            } return true;
        },

    },
    {
        type: 'input',
        name: 'update_first',
        message: 'Please provide the new First Name',
        when: (rawlist) => rawlist.update_choice === 'first_name',
        validate: (answer) => {
            if(answer.trim() === "") {
                return "Employee First Name is a mandatory field. Please enter the Employee First Name"
            } return true;
        },
    },
    {
        type: 'input',
        name: 'update_last',
        message: 'Please provide the new Last Name',
        when: (rawlist) => rawlist.update_choice === 'last_name',
        validate: (answer) => {
            if(answer.trim() === "") {
                return "Employee Last Name is a mandatory field. Please enter the Employee Last Name"
            } return true;
        },
    },
    {        
        type: 'input',
        name: 'update_role',
        message: `Enter the new Title Code for Employee's position?`,
        when: (rawlist) => rawlist.update_choice === 'role',
        validate: (answer) => {
            if (isNaN(answer)) {
                return "Title Code is a numeric field. Please enter the numeric Title Code"
            } else if(answer.trim() === "") {
                return "Title Code is a mandatory field. Please enter the Title Code"
            } return true;
        },
    },
    {
        type: 'input',
        name: 'update_dept',
        message: `What is the Department Code for this Employee's *NEW* Home Department? `,
        when: (rawlist) => rawlist.update_choice === 'dept',
        validate: (answer) => {
            if (isNaN(answer)) {
                return "Department Code is a numeric field. Please enter the numeric Department Code"
            } else if(answer.trim() === "") {
                return "Department Code is a mandatory field. Please enter the Department Code"
            } return true;
        },
    },
    {
        type: 'input',
        name: 'update_manager',
        message: 'Enter the **EMPLOYEE ID** of the new assigned manager. Refer to the table of managers for assistance.',
        when: (rawlist) => rawlist.update_choice === 'manager',
        validate: (answer) => {
            if (isNaN(answer)) {
                return "Manager ID is a numeric field. Please enter the numeric Manager ID"
            } else if(answer.trim() === "") {
                return "Manager ID is a mandatory field. Please enter the Manager ID"
            } return true;
        },
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
        when: (confirm) => confirm.allmanagers === true,
        validate: (answer) => {
            if (isNaN(answer)) {
                return "Manager ID is a numeric field. Please enter the numeric Manager ID"
            } else if(answer.trim() === "") {
                return "Manager ID is a mandatory field. Please enter the Manager ID"
            } return true;
        },
    },
];

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
            inquirer.prompt(okdelete)
            .then(confirm => {
                if(confirm.delete === true) {
                    inquirer.prompt(departments)
                    .then(depDelete => {
                        deleteDepartment(depDelete.deptID);
                        console.log(`Department with Dept. Code ${depDelete.deptID} has been deleted`);
                        nextAction();
                    })
                } else if(confirm.delete === false) {
                    nextAction();
                }
            })
        } else if(choice === 'View all Positions') {
            viewJobs()
        } else if(choice === 'Add a New Position') {
            depStore();
            inquirer.prompt(job)
            .then(newjob => {
                addJob(newjob);
                console.log(`${newjob.title} has been added to the Jobs list`);
                nextAction();
            })
        } else if(choice === 'Delete an Existing Position') {
            inquirer.prompt(okdelete)
            .then(confirm => {
                if(confirm.delete === true) {
                    inquirer.prompt(jobless)
                    .then(jobDelete => {
                        deleteJob(jobDelete.titleGone);
                        console.log(`Role with Title Code ${jobDelete.titleGone} has been deleted`);
                        nextAction();
                    })
                } else if(confirm.delete === false) {
                    nextAction();
                }
            })
        } else if(choice === 'View all Managers') {
            viewManagers()
        } else if(choice === 'View all Employees') {
            viewEmployees()
        } else if(choice === 'Add a New Employee') {
            inquirer.prompt(personSure)
            .then(confirm => {
                if(confirm.person_proceed === true) {
                    inquirer.prompt(person)
                    .then(newper => {
                        addEmployee(newper);
                        console.log(`${newper.first_name} ${newper.last_name} has been added to the list of current Employees`);
                        nextAction();
                    }) 
                } else if(confirm.delete === false) {
                    nextAction();
                }             
            })
           
        } else if(choice === 'Update an Existing Employee') {
            inquirer.prompt(uperson)
            .then(field => {
                updateEmployee(field);
                nextAction();
            })
        } else if(choice === 'Delete an Existing Employee') {
            inquirer.prompt(okdelete)
            .then(confirm => {
                if(confirm.delete === true) {
                    inquirer.prompt(personless)
                    .then(empDelete => {
                        deleteEmployee(empDelete.emp_id);
                        console.log(`Employee with ID# ${empDelete.emp_id} has been deleted`);
                        nextAction();
                    })
                } else if(confirm.delete === false) {
                    nextAction();
                }
            })
        } else if(choice === 'View Employees by Manager') {
            inquirer.prompt(managers)
            .then(selected => {
                viewBman(selected);
            })
        } else if(choice === 'View Employees by Department') {
            inquirer.prompt(departments)
            .then(selected => {
                viewBdept(selected);
            })
        } else if(choice === 'View Salary Liability by Department') {
                viewCost()
        } 
    })
}

function viewDepartments() {    
    connection.query(`SELECT id AS department_code, dept_name AS department_name FROM departments;`, function (err, deptInfo) {
        console.table(deptInfo);
        nextAction();
    })
}

function depStore() {    
    connection.query(`SELECT id AS department_code, dept_name AS department_name FROM departments;`, function (err, deptInfo) {
        deptStore = [];
        deptInfo.forEach((deptInfo, index) => {
            if (index >= 0 ) {                
                deptStore.push(`${deptInfo.department_name} | Code# ${deptInfo.department_code}`);
            }
        })
        console.log(deptStore);
    })
}

function addDepartment(newdep) {
    connection.query(`INSERT INTO departments (dept_name) VALUES ("${newdep}")`)
}

function deleteDepartment(depDelete) {
    connection.query(`DELETE FROM departments WHERE id = ${depDelete};`)
}

function viewJobs() {
    connection.query(`SELECT jobs.id AS title_code, jobs.title AS title, jobs.salary AS compensation, departments.dept_name AS home_department FROM jobs JOIN departments ON jobs.dept = departments.id;`, function (err, jobInfo) {
        console.table(jobInfo);
        nextAction();
    })
}

function jobStore() {
    connection.query(`SELECT jobs.id AS title_code, jobs.title AS title, jobs.salary AS compensation, departments.dept_name AS home_department FROM jobs JOIN departments ON jobs.dept = departments.id;`, function (err, jobInfo) {
        storeJob = [];
        jobInfo.forEach((jobInfo, index) => {
            if (index >= 0 ) {                
                storeJob.push(`${jobInfo.title} | Code# ${jobInfo.title_code}`);
            }
        })
        console.log(storeJob);
    })    
}
// future functionality - help to populate storejob object for dynamig id reference.

function addJob(newjob) {
    connection.query(`INSERT INTO jobs (title, salary, dept) VALUES ("${newjob.title}", ${newjob.salary}, ${newjob.dept})`)
}

function deleteJob(jobDelete) {
    connection.query(`DELETE FROM jobs WHERE id = ${jobDelete};`)
}

function viewManagers() {
    connection.query(`SELECT people.manager_id AS manager_id, CONCAT(manager.first_name,' ',manager.last_name) AS manager FROM people JOIN people manager on manager.id = people.manager_id GROUP BY people.manager_id;`, function (err, empInfo) {
        console.table(empInfo);
        nextAction();
    })
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
    let role = newper.role;
    let dept = newper.dept;

    if(manager) {
        connection.query(`INSERT INTO people (first_name, last_name, manager_id, title_pay, dept_id) VALUES ("${first}", "${last}", ${manager}, ${role}, ${dept});`)
    } else if(!manager) {
        connection.query(`INSERT INTO people (first_name, last_name, title_pay, dept_id) VALUES ("${first}", "${last}", ${role}, ${dept});`)
    } else {
        console.log("Something went wrong, try again!")
    }
}

function updateEmployee(field) {
    if(field.update_choice === 'first_name') {
        connection.query(`UPDATE people SET first_name = '${field.update_first}' WHERE id=${field.empl_id};`)
    }  else if(field.update_choice === 'last_name') {
        connection.query(`UPDATE people SET last_name = '${field.update_last}' WHERE id=${field.empl_id};`)
    }  else if(field.update_choice === 'role') {
        connection.query(`UPDATE people SET title_pay = ${field.update_role} WHERE id=${field.empl_id};`)
    } else if(field.update_choice === 'dept') {
        connection.query(`UPDATE people SET dept_id = ${field.update_dept} WHERE id=${field.empl_id};`)
    } else if(field.update_choice === 'manager') {
        connection.query(`UPDATE people SET manager_id = ${field.update_manager} WHERE id=${field.empl_id};`)
    } else {
        console.log(`Something went wrong. Try again!`);
    }
}

function deleteEmployee(empDelete) {
    connection.query(`DELETE FROM people WHERE id = ${empDelete};`)    
}

function viewBman(manager) {
    connection.query(`SELECT people.id AS employee_id, people.first_name AS first, people.last_name AS last, jobs.title AS title, jobs.salary AS annual_rate, departments.dept_name AS home_department FROM people JOIN jobs ON people.title_pay = jobs.id JOIN departments on people.dept_id = departments.id WHERE manager_id = ${manager.managerID};`, function (err, empInfo) {
        if(empInfo.length <= 0) {
            console.log('This Employee either does not exist or does not manage any other Employees');
        } 
        
        console.table(empInfo);
        nextAction();
    })
}

function viewBdept(department) {
    connection.query(`SELECT people.id AS employee_id, people.first_name AS first, people.last_name AS last, jobs.title AS title, jobs.salary AS annual_rate FROM people JOIN jobs ON people.title_pay = jobs.id WHERE dept_id = ${department.deptID};`, function (err, empInfo) {
        if(empInfo.length <= 0) {
            console.log('This Department either does not exist or currently does not have any Employees');
        }
        
        console.table(empInfo);
        nextAction();
    })
}

function viewCost() {
    connection.query(`SELECT SUM(jobs.salary) AS total_salaries, departments.dept_name FROM jobs JOIN departments ON jobs.dept = departments.id GROUP BY jobs.dept;`, function (err, salInfo) {        
        console.table(salInfo);
        nextAction();
    })
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