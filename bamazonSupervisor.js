var inquirer = require("inquirer");
var mysql = require("mysql");
var csv = require("csv");
var Table = require("cli-table");
var test;
var currstring;
var profits;

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "bamazon_DB"
});

startSuperView();

function startSuperView () {
    inquirer.prompt([
        {
            name:"action",
            type: "list",
            message:"What would Mr. Supervisor like to do?",
            choices:["View Product Sales by Department", "Add New Department"]
        }
    ]).then(function (answer) {
        switch (answer.action) {
            case "View Product Sales by Department":
                viewSales();
                break;
            case "Add New Department":
                addDept();
                break;
        }
    })
}

function viewSales () {
    connection.query("SELECT departments.department_id, departments.department_name, departments.over_head_cost, SUM(products.product_sales) FROM departments LEFT JOIN products ON departments.department_name=products.depart_name GROUP BY departments.department_id ORDER BY departments.department_id",function(err,res){
        test = "department_id, department_name, over_head_costs, product_sales, total_profit\n";
        for(var i = 0; i < res.length; i++){
            if (res[i]["SUM(products.product_sales)"] === null){
                res[i]["SUM(products.product_sales)"] = 0
            }
            profits = res[i]["SUM(products.product_sales)"] - res[i].over_head_cost;
            currstring = res[i].department_id + "," + res[i].department_name + "," + res[i].over_head_cost + "," + res[i]["SUM(products.product_sales)"] + "," + profits + "\n";
            test = test + currstring;
        }

        csv.parse(test, {comment: ""}, function (err, test) {
            var headers = test[0];
            var values = test.slice(1);
            var table = new Table({head: headers});

            table.push.apply(table, values);
            console.log(table.toString());
        });
    });
    connection.end();
}

function addDept() {
    inquirer.prompt([
        {
            message:"What is the name of the department you would like to add?",
            name: "deptname",
            type:"input"
        },
        {
            message:"What is the over head cost for the department?",
            name:"cost",
            type:"input"
        }

    ]).then(function(answer) {
        connection.query("INSERT INTO departments SET ?", [
            {
                department_name: answer.deptname,
                over_head_cost: parseInt(answer.cost)
            }
        ], function (err, res) {
            if (err) console.log(err);
            console.log("Department has been added, Rows Affected: ",res.affectedRows);

        });
        connection.end();
    })
}