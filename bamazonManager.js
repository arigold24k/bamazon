var mysql = require("mysql");
var inquirer = require("inquirer");
var csv = require("csv");
var Table = require("cli-table");
var productos = [];

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "bamazon_DB"
});

displayProd();

startmanagerView();

function startmanagerView () {
    inquirer.prompt([
        {
            type: "list",
            name: "action",
            choices: ["View Products for Sale", "View low Inventory", "Add to inventory", "Add New Product"],
            message: "What would you want to do Mr. Manager"
        }
    ]).then(function(answer){
        var action = answer.action;

        switch(action) {
            case "View Products for Sale":
                viewProd();
                break;
            case "View low Inventory":
                viewLow();
                break;
            case "Add to inventory":
                addInventory();
                break;
            case "Add New Product":
                addNewProd();
                break;
        }
    })
}


function viewProd () {
    connection.query("SELECT * FROM products WHERE stock > 0", function(err,res) {
        if(err) console.log(err);
        var test = "Product ID, Product, Department, Price, Quantity\n";
        console.log("\nAvailable Products\n");
        for (var i = 0; i < res.length; i++) {
            if (res[i].stock > 0) {
                test = test + res[i].id + "," + res[i].product_name + "," + res[i].depart_name + "," + res[i].price.toFixed(2) + "," + res[i].stock + "\n";
            }
        }

        csv.parse(test, {comment: ""}, function (err, test) {
            var headers = test[0];
            var values = test.slice(1);
            var table = new Table({head: headers});

            table.push.apply(table, values);
            console.log(table.toString());
        });
        connection.end();
    });

}

function viewLow () {
    connection.query("SELECT * FROM products WHERE stock <= 5", function(err,res) {
        if(err) console.log(err);
        var test = "Product ID, Product, Department, Price, Quantity\n";
        console.log("Low Stock Products\n");
        if (res.length > 0) {
            for (var i = 0; i < res.length; i++) {
                if (res[i].stock > 0) {
                    test = test + res[i].id + "," + res[i].product_name + "," + res[i].depart_name + "," + res[i].price.toFixed(2) + "," + res[i].stock + "\n";
                    // console.log("Product ID: " + res[i].id + " || Product: " + res[i].product_name + " || Department: " + res[i].depart_name + " || Price: $" + res[i].price.toFixed(2) + " || Quantity: " + res[i].stock + "\n");
                }
            }
            csv.parse(test, {comment: ""}, function (err, test) {
                var headers = test[0];
                var values = test.slice(1);
                var table = new Table({head: headers});

                table.push.apply(table, values);
                console.log(table.toString());
            });
        }else {
            console.log("Enough stock in inventory.\n")
        }
    });
    connection.end();
}

function addInventory () {
    var curramt;
    inquirer.prompt([
        {
            name:"prod",
            type:"input",
            message:"What is the product ID you wish to add more inventory to?"
        },
        {
            name:"amt",
            type:"input",
            message:"How many units do you want to add?"
        }
    ]).then(function(answer) {
        connection.query("SELECT * FROM products WHERE ?", [
            {
                id:answer.prod
            }
        ], function(err, res) {
            curramt = parseInt(res[0].stock) + parseInt(answer.amt);

            console.log("this is the error line", curramt);
            connection.query("UPDATE products SET ? WHERE ?", [
                {
                    stock: curramt
                },
                {
                    id: answer.prod
                }
            ],function(err,res){
                if(err) console.log(err);
                viewProd();
            });
        });
    });

}

function addNewProd () {
    inquirer.prompt([
        {
            name: "product",
            type: "input",
            message:"What is the name of the Product you want to Add?"
        },
        {
            name: "dept",
            type: "list",
            choices: productos,
            message:"What is the name of the Department the product belongs to?"
        },
        {
            name: "price",
            type: "input",
            message:"What is the price of the Product?"
        },
        {
            name: "quantity",
            type: "input",
            message:"How much stock do you want to add?"
        }
    ]).then(function(answer) {
        connection.query("INSERT INTO products SET ?", [
            {
                product_name: answer.product,
                depart_name: answer.dept,
                price: parseInt(answer.price),
                stock: parseInt(answer.quantity)
            }
        ], function(err,res){
            console.log(res.affectedRows + " Rows affected");
            console.log("You have successfully added a new product")
        });
        connection.end();
    })
}

function displayProd () {
    connection.query("SELECT * FROM departments",function(err,res) {
        if (err) console.log(res);
        for (var i = 0; i < res.length; i++) {
            if (productos.indexOf(res[i].department_name) === -1) {
                productos.push(res[i].department_name)
            }
        }
        // connection.end();
        // console.log(test_array);
    })
}