var mysql = require("mysql");
var inquirer = require("inquirer");
var csv = require("csv");
var Table = require("cli-table");
var test;
var currstring;

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "bamazon_DB"
});


displayInventory();


function displayInventory () {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log("\nAvailable Products\n");
        test = "Product ID, Product, Department, Price\n";

        for(var i = 0; i < res.length; i++){
            currstring = res[i].id+ "," + res[i].product_name + "," + res[i].depart_name + "," + res[i].price.toFixed(2) + "\n";
            test = test + currstring;
        }

        csv.parse(test, {comment: ""}, function (err, test) {
            var headers = test[0];
            var values = test.slice(1);
            var table = new Table({head: headers});

            table.push.apply(table, values);
            console.log(table.toString());
            purchasProd();
        });
    });
}

function purchasProd () {
    inquirer.prompt([
        {
            type: "input",
            name: "prod",
            message: "What is the ID of the product you wamt to purchase"
        },
        {
            type: "input",
            name: "quant",
            message: " How many do you want to purchase?"
        }
    ]).then(function(answer){
        connection.query("SELECT * FROM products WHERE ?",
            [{
                id: answer.prod
            }],
            function(err,res){
                if(err) {
                    console.log(err);
                    return;
                }
                var purAmount = (res[0].price * answer.quant).toFixed(2);
                if ((res[0].stock - answer.quant) > 0 ){
                    connection.query("UPDATE products SET ? WHERE ?",
                        [{
                            stock: res[0].stock - answer.quant,
                            product_sales: parseInt(res[0].product_sales) + parseInt(purAmount)
                        },
                            {
                                id: answer.prod
                            }],
                        function(err,res){
                        if(err) { console.log(err); return;}
                        // console.log(res);
                        console.log("Order has been filled\nYour Total is $" + purAmount);

                        })
                }else {
                    console.log("Not enough stock to fill your order")
                }
                connection.end();
            }
        );
    })
}