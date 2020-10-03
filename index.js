var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var pg = require('pg');


// _________________________________________PostGres_______________________________________________________________________________
/* Configure PostGres DBMS */
const connectionString = "postgres://rbzsyojsobnbob:873c939e5e300adc7fab04974f1009f9ffedb5e46ac5729f3b66c8efefbc6d4a@ec2-54-160-161-214.compute-1.amazonaws.com:5432/d9bm3n25k10aka";
var pgClient = new pg.Client(connectionString);

/* Async function + await promise fixes the issue by setting a delay */
async function con() {
	
	let promise = new Promise((resolve, reject) => {
		setTimeout(() => resolve(pgClient.connect() ), 1000)
	})

	let result = await promise;

	alert(result);
}


// ________________________________________________________________________________________________________________________________


// _________________________________________Query Functions_______________________________________________________________________________
var product_table = "PRODUCT_TABLE";
var currentCustomer = "logged_in_user"; //this is temporary until we figure this out


var findIdBySearchValue = function(keyword){
	return 2; // this is just temporary until the database has been finished  
	var getIdByKeyword = "SELECT * FROM " + product_table + " WHERE customerId =" + currentCustomer + " AND WHERE productName LIKE '%" + keyword + "%'";
	connection.query(getIdByKeyword, function(error,found){
    	var products = null;
    	if(error) throw error;
		if(found.length){
			return found; // this gets us a list of products that have the keyword in their name
		}
    });
}


// ________________________________________________________________________________________________________________________________



app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

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
	res.render("product-details", {productPath:req.query.productID});
});

// product page
app.get("/product-page", function(req, res){
	// console.log("Hello")
	res.render("product-page", {productID:req.query.productID});
});

app.get("/search-action", function(req, res) {
    var keyword = req.query.search_field;
    console.log(keyword); // check if the search value gets passed successfully
    var id = findIdBySearchValue(keyword); // this function should return a list of products which we will then display on the products page
    res.render("product-page", {productID:id});
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
