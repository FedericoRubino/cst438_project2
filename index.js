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

// Create Account
app.get("/create-account", function(req, res){
	res.render("create-account");
});

// Login Authentication TODO: make controller
app.post('/login', function(req, res){
	res.send("Successful to POST @ login '/login'!\n");
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


// LEAVE BELOW COMMENTED OUT, We may use it for later

// _____________ DB TESTING ___________________________________ 
// index.js was the only thing not saved to stash for some reason
// So lost all the db test code
// Insert item into database
// Check to see if data can be retrieved from database (var = retrievedValue, next(retrievedValue == insertedValue, ?))
// Update value in database (increment or decrement)
// Retrieve value and test to see if it has been incremented (insertedValue =/= retrievedValue)
// Decrement Value, UPDATE
// _________________These tests prove that the data can be Inserted, Retrieved, Updated, and Deleted_________________________________________ 

// function instantiate(){
	
// 	var callToTest = {
// 		insert: function (tableName){
// 			if(tableName == product_table){
// 				// pgClient.con
// 				// INSERT INTO product_table(c1, c2, ...) VALUES(v1, v2, ...) RETURNING *;
// 				const text = "INSERT INTO product_table(product_id, name, price, details, inventory, img_path) VALUES($1, $2, $3, $4, $5, $6) RETURNING *";
// 				const values = ['v1', 'v2', 'v3', 'v4', 'v5', 'v6'];
				
// 				async function q() {
	
// 					let promise = new Promise((resolve, reject) => {
// 						setTimeout(() => resolve(pgClient.query(test, values)), 1000)
// 					})

// 					let result = await promise;

// 					alert(result);
// 				}
// 				q();

// 				// pgClient.query((test, values), function(error,found){
// 			 //    	var products = null;
// 			 //    	if(error) throw error;
// 				// 	if(found.length){
// 				// 		return found; // this gets us a list of products that have the keyword in their name
// 				// 	}
//     // 			});
// 				//promise here
// 		// 	}
// 		// }

// 		showAllProduct: function (product_table){
// 			return this.product_id + " " + this.name + " " + this.price + " " + this.details + " " + this.inventory + " " + this.img_path + "\n" ;
// 		}
// 	} 

// 	// }
// 	var product_table = {
// 		product_id: "product_id",
// 		name: "product_name",
// 		price: "price",
// 		details: "details",
// 		inventory: "inventory",
// 		img_path: "img_path"
// 	}
// 	var user_table = {
// 		user_id: "user_id",
// 		username: "username",
// 		password: "password",
// 		product_bought_id: "product_bought_id"
// 	}
// 			//Tables

// 	console.log(callToTest.showAllProduct.call(product_table));
// 	// console.log(callToTest.insert.call(product_table));
// 	// callToTest.insert.call(product_table);
// }