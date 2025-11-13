import express from 'express';
import mysql from 'mysql'
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();
const app = express()



// environemnt variables are used to store sensitive data like database credentials
// in real world applications we use dotenv package to manage environment variables

//to achieve this we use dotenv package

app.use(bodyParser.json());

//mysql connection
const mysqlConnection = mysql.createConnection({
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE
})

mysqlConnection.connect((err) => {
    if (!err) {
        console.log('DB connection successful')
    }
    else {
        console.log('DB connection failed ')
    }
})

// start with creating a table
let sql = 'CREATE TABLE employee (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), emp_code VARCHAR(255), salary INT)'
mysqlConnection.query(sql, (err, result) => {
    if (err) {
        console.log('table already exists')
    }
    console.log('table created')
})



app.get('/', (req, res) => {
    res.send('welcome to my api')
})


//create employee
app.post('/employee', (req, resp) => {
    const { id, name, emp_code, salary } = req.body;
    let sql = 'INSERT INTO employee(id,name,emp_code,salary) VALUES(?,?,?,?)'

    mysqlConnection.query(sql, [id, name, emp_code, salary], (err, result) => {
        if (err) {
            throw err;
        }
        else {
            resp.json({ message: 'employee added successfully', result })
        }
    })
})

//get all employees
app.get('/employee', (resp, res) => {
    let sql = 'SELECT * FROM employee'
    mysqlConnection.query(sql, (err, results) => {
        if (err) {
            throw err;
        }
        else {
            res.json({ message: "got data", results })
        }
    })
})


//get employee by id
app.get('/employee/:id', (req, res) => {
    let sql = 'SELECT * FROM employee WHERE id = ?'
    mysqlConnection.query(sql, [req.params.id], (err, result) => {
        if (err) {
            throw err;
        }
        else {
            res.json({ message: "ihave got data", result })
        }
    })

})

// PUT update employee

app.put('/employee/:id', (req, res) => {
    const { name, emp_code, salary } = req.body;
    let sql = 'UPDATE employee SET name = ?, emp_code = ?, salary = ? WHERE id = ?'
    mysqlConnection.query(sql, [name, emp_code, salary, req.params.id], (err, result) => {
        if (err) {
            throw err;
        }
        else {
            res.json({ message: "employee updated", result })
        }
    })
})

//  DELETE employee
app.delete('/employee/:id', (req, res) => {
    let sql = 'DELETE FROM employee WHERE id =?'
    mysqlConnection.query(sql, [req.params.id], (err, result) => {
        if (err) {
            throw err;

        }
        else {
            res.json({ message: "employee deleted", result })
        }
    })
})

app.listen(process.env.POT, () => {
    console.log(`server is running on pots ${process.env.PORT}`)
})


