var express = require("express");
var app = express();

var mysql = require('mysql');
var bodyParser = require("body-parser");


// _________________________________________MariaDB_______________________________________________________________________________
/* Configure MySQL DBMS */
const connection = mysql.createConnection({
    host: 'ao9moanwus0rjiex.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user: 'ua4cics2dvefr0xv',
    password: 'q7rox4ht0tjx6jqn',
    database: 'ct7pzqsmv8u8s8ca'
});
connection.connect();
// ________________________________________________________________________________________________________________________________

app.set('view engine', 'ejs');
app.use(express.static('public'));


// Home
app.get("/", function(req, res){
	res.render("home");
});

// Clear Account
app.get("/clear-account", function(req, res){
	res.render("clear-account");
});

// Login
app.get("/login", function(req, res){
	res.render("login");
});

// product details
app.get("/product-details", function(req, res){
	res.render("product-details");
});

// product page
app.get("/product-page", function(req, res){
	res.render("product-page");
});

// shopping cart
app.get("/shopping-cart", function(req, res){
	res.render("shopping-cart");
});

// user profile
app.get("/user-profile", function(req, res){
	res.render("user-profile");
});

/* error page (route not found) */
app.get("/*", function(req, res){
	res.render("error");
});


// required server
app.listen(process.env.PORT || 3000, function(){
	console.log("Server is running...");
});



// Test