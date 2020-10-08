var express = require("express");
var app = express();
var session = require('express-session')
var bodyParser = require("body-parser");
var mysql = require('mysql');

// need this in order to use req.body.xyz
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies | by specifying extended: true, object can be any type;

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(session({
	secret: 'top secret code!',
	resave: true,
	saveUninitialized: true
}));

// ___________________________CLEARDB_______________________________________________________________________________________________

// mysql://b17b3063986ea6:e550d2df@us-cdbr-east-02.cleardb.com/heroku_135761bbf9978a7?reconnect=true

// To connect to database via mysql command line
// mysql --host=us-cdbr-east-02.cleardb.com --user=b17b3063986ea6 --password=e550d2df --reconnect heroku_135761bbf9978a7

var connection = mysql.createPool({
  host: "us-cdbr-east-02.cleardb.com",
  user: "b17b3063986ea6",
  password: "e550d2df",
  database: "heroku_135761bbf9978a7"
}); 
module.exports = connection;

// _________________________________________________________________________________________________________________________________

app.post('/register-account', function(req, res){
	let statement = 'INSERT INTO user_table (username, password) VALUES (?, ?)';
	let data = [req.body.username, req.body.password];
	connection.query(statement, data, function(error, result){
		if(error) throw error;
		else console.log(result);
		console.log(data);;
		res.render('home');
	});
});

// grabs the username/password from login and checks to see if the user is valid
app.post('/login', async function(req, res){
	console.log("In login post, see username logged below.");
	console.log(req.body.username);
	let doesUserExist = await checkUser(req.body.username);
	// the if below checkes if doesUserExist returns empty array
	// if an empty array this means user does not exist
	// reload to login for now
	if (doesUserExist.length === 0) {
		res.render('login', {error: true});
		return;
	}
	// previously:    await checkPassword(req.body.password)
	// notided checkPassword was commented out so I removed it
	// feel free to change it back though
	let passwordMatch =  req.body.password;
	if(passwordMatch){
		req.session.authenticated = true;
		req.session.user = doesUserExist[0].username;
		res.redirect('/home');
	} else {
		res.render('login', {error: true});
	}
});

// Grabs the username in the table
function checkUser(username){
	let statement = 'SELECT * FROM user_table WHERE username=?';
	return new Promise(function(resolve, reject){
		connection.query(statement, [username], function(error, results){
			if(error) throw error;
			resolve(results);
		});
	});
}
// Grabs the password in the table
// function checkPassword(password){
// 	return new Promise(function(resolve, reject){
// 		// Use bcrypt to compare password?
// 	})
// }





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