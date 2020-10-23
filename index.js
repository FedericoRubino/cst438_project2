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


var prepData = function(callback, next, res, req){
	let statement = "SELECT * FROM order_table NATURAL JOIN product_table WHERE user_id =" + req.session.user.user_id;
	var products = null;
	connection.query(statement, function(err,results){
		if(err){throw err;}
		if(results.length > 0){
			products = results;
			callback(products, next, res, req)
		} else {
			next();
		}
	});
}

var populateProductDetails = function(products, next, res, req){
	var total = 0;
	res.locals.quantity = products.length;
	for(var i = 0; i < products.length; i++){
		total += products[i].price;
	}
	res.locals.total = total;
	next();
}

// This is gold!!
// This will make a user variable available in all your templates.
app.use(function(req, res, next) {
	res.locals.user = req.session.user;
	if(req.session.user === undefined){
		next();

	} else {
		prepData(populateProductDetails, next, res, req);
	}
  });




function onSubmit(token) {
     document.getElementById("register").submit();
}


function checkForDuplicateUser(user,res,req){
	let statement = "SELECT * FROM user_table where username = '" + user + "';";
	connection.query(statement, function(err, results){
		if(err) {throw err;}
		console.log("result:", results);
		console.log(results.length);
		if(results.length == 0){
			let statement = 'INSERT INTO user_table (username, password) VALUES (?, ?)';
			let data = [req.body.username, req.body.password]; 
			connection.query(statement, data, function(error, result){
				if(error){ throw error; }
				else{ 
					console.log(result); 
					console.log(data);
					res.redirect('/login');
				}
			}); 
		} else {
		res.render("create-account", {duplicateUsername:true});
		}
	});
}

// register user path
app.post('/register-account', function(req, res){
	let statement = 'INSERT INTO user_table (username, password) VALUES (?, ?)';
	let data = [req.body.username, req.body.password]; 
	// console.log(data);
	checkForDuplicateUser(req.body.username,res,req);
});


// Grabs the user in the table with the given username
function checkUser(username){
	let statement = "SELECT * FROM user_table WHERE username='"+username+"'";
	// console.log(statement);
	return new Promise(function(resolve, reject){
		connection.query(statement, function(error, results){
			if(error) throw error;
			if(results.length > 0){
				// console.log(results);
				resolve(results);
				return results;
			}
		});
	});
}


app.get('/logout', function(req, res) {
	// clear session
	console.log('In logout route.');
	req.session.destroy();
	res.redirect('/');
});

// grabs the username/password from login and checks to see if the user is valid
app.post('/login', async function(req, res){
	let currentUser = await checkUser(req.body.username);
	// the if below checkes if currentUser returns empty array
	// if an empty array this means user does not exist
	// reload to login for now
	if (currentUser.length === 0) {
		res.render('login', {error: true});
		return;
	}

	// previously:    await checkPassword(req.body.password)
	// notided checkPassword was commented out so I removed it
	// feel free to change it back though
	let passwordEntered =  req.body.password;
	if(passwordEntered == currentUser[0].password){
		req.session.authenticated = true;
		req.session.user = currentUser[0]; // this will allow access to all the user info from anywhere
		console.log("You have successfully logged in as:");
		console.log(req.session.user);
		res.redirect('/');
	} else {
		res.render('login', {error: true});
	}
});

var paths = ['images\\Core\\CPU\\CPU', 'images\\Core\\MotherBoard\\Motherboard','images\\Accessories\\HardDrives\\HardDrive','images\\Accessories\\USB\\USB','images\\Accessories\\Cables\\Cable', 'images\\Accessories\\Adapters\\Adapter'];
var names = [["I9-9900K","I7-10700K","I9-10900K"],["MSI Gaming Edge WIFI Z490 Motherboard", "ASUS ROG STRIX Z490 Motherboard", "AMD AM4 (3rd Gen Ryzen) ATX Motherboard"],["Blackhole", "Wonderland", "Floppy"],["Thumb", "Jump Drives", "Data stick"],["Coaxial", "Fibre Optics", "Shielded Cable"],["3-port Tripp Lite 3-port USB Cable", "Dell Adapter USB-C", "USB-C Hub Multiport Adapter"]];
var prices = [[300.99, 400.99, 550,50],[200, 250,350.60],[100,89.99,200],[20,5,1.99],[10.50,15,30.89],[10.50,15,20]]
var details = [["CPU","CPU","CPU"],["Motherboard","Motherboard","Motherboard"],["HardDrive","HardDrive","HardDrive"],["USB","USB","USB"],["Cable","Cable","Cable"],["Adapter","Adapter","Adapter"]]

// clears the product table
var nukeProductTable = function(){
	var statement = "DELETE FROM product_table";
	connection.query(statement, function(error, results){
		if(error) throw error;
	});
}

// checks if product table has any rows
var checkDBFull = function(){
	var statement = "SELECT * FROM product_table";
	connection.query(statement, function(error, results){
		if(error) throw error;
		if(results.length > 0){
			// console.log(results)
			// console.log(results.length)

			return true;
		} else {
			return false;
		}
	});
}

// fills the product table with products
var populateDB = function(){
	nukeProductTable();
	if(checkDBFull()){return;}
// return new Promise(function(resolve, reject){
	var insert_stmt = "INSERT INTO product_table (product_name, price, details, inventory, img_path) VALUES (?,?,?,?,?)";
	for (var i = 0; i < 6; i++) {
		var path = paths[i];
		var names_ = names[i];
		var prices_ = prices[i];
		var details_ = details[i];
		for(var j=1;j<4;j++){
			var img_path = path + j + ".jpg";
			data = [names_[j-1],prices_[j-1],details_[j-1],10,img_path];
			// console.log(data)
			connection.query(insert_stmt, data, function(error, results){
				if(error) throw error;
				// resolve(results);
			});
		}
	}
// });
}

// get all of the products
var getAllProducts = function(callback,res) {
	var statement = "SELECT * FROM product_table";
	connection.query(statement, function(error, results){
		if(error) throw error;
		if(results.length > 0){
			callback(results,res);
		} 
	});
}

// using callback functions to over come the asynch issue
var renderHome = function(products,res){
	// console.log	(products);
	res.render("home", {products:products});
} 

// Home
app.get("/", function(req, res){
	// populateDB();
	// checkDBFull();
	getAllProducts(renderHome,res);
});

// Clear Account
app.get("/clear-account", function(req, res){
	res.render("clear-account");
});

// Login
app.get("/login", function(req, res){
	res.render("login");
});

//goes 3rd
// var deleteTable = function(res,req){

// 	statement = "DELETE FROM order_table WHERE user_id = " + req.session.user.user_id + ";";
// 	connection.query(statement,function(err,result){
// 		if(err){throw err;}
// 	});

// 	res.render("checkout-success");

// }

// //goes 2nd
// var getTheCart = function(callback,inventories,req,res){
	
// 	var mapSize = inventories.size;
// 	inventories.forEach(function(key,val){
// 		mapSize = mapSize - 1;
// 		var statement = "SELECT * FROM product_table WHERE product_id =" + key;
// 		var currentInventory = 0; 
// 		connection.query(statement, function(err,result){
// 			if(err){throw err;}
// 			if(result > 0){
// 				currentInventory = result[0].inventory;
// 			}
// 		});

// 		var newInventory = currentInventory - val;
// 		console.log("mapsize", mapSize)

// 		console.log("key:", key, currentInventory);
// 		console.log(newInventory);
// 		stmt = "UPDATE product_table SET inventory = " + newInventory +" WHERE product_id=" + key;
// 		connection.query(stmt, function(err,result){
// 			if(err){throw err;}
// 		});
// 		if(mapSize <= 0){
// 			callback(res,req);
// 		}
// 	}); // end of for loop
// }

// // goes 1st
// var prepFunction = function(callback,foundItems,req,res){
// 	for(var i=0; i<foundItems.length;i++){
// 		if(foundItems[i].inventory <= 0){
// 			//complain here!!
// 		}
// 	}

// 	let inventories = new Map();
// 	for(var i=0; i<foundItems.length;i++){
// 		if(inventories.has(foundItems[i].product_id)){
// 			inventories.set(foundItems[i].product_id, inventories.get(foundItems[i].product_id) + 1)
// 		} else{
// 			inventories.set(foundItems[i].product_id,1);
// 		}
// 		if(i == foundItems.length - 1){
// 			callback(deleteTable,inventories,req,res)
// 		}
// 	}
// }

// get all the inventory from the cart where the userID === {userID}
// for each of those, select the inventory item that === the {itemID} (can use natural join)
// if there is enough inventory:
// 	Update table with current-amountPurchased
// else
// 	Cart error


// Checkout Success
app.get("/checkout-success", function(req, res){	
	var user_id = req.session.user.user_id;

	var statement = "SELECT * FROM order_table NATURAL JOIN product_table where user_id = " + user_id;
	connection.query(statement,function(err,results){
		if(err) throw err;
		if(results.length > 0){
			function1( results,req,res);
		} else {
			res.redirect("/");
		}
	})
});	

// 1st checkout
var function1 = function(foundItems,res,req){
	var inventory = new Map();
	for(var i=0; i<foundItems.length;i++){
		if(foundItems[i].inventory > 0){
			if(inventory.has(foundItems[i].product_id)){
				if(inventory.get(foundItems[i].product_id) > 0){
					inventory.set(foundItems[i].product_id, inventory.get(foundItems[i].product_id) - 1)
				}
			} else{
				inventory.set(foundItems[i].product_id,foundItems[i].inventory - 1);
			}
		}
		if(i == foundItems.length - 1){
			function2(inventory,req,res)
		}
	}
}

// 2nd checkout
var function2 = function(inventory,res,req){

	inventory.forEach((val, key) =>{
		var newInventory = val;
		updateStatement = "UPDATE product_table SET inventory = " + newInventory +" WHERE product_id=" + key;
		connection.query(updateStatement, function(err,result){
			if(err) throw err;
			deleteTable(res,req);
		});
	});
}

// goes 3rd
var deleteTable = function(res,req){
	statement = "DELETE FROM order_table WHERE user_id = " + req.session.user.user_id + ";";
	connection.query(statement,function(err,result){
		if(err){throw err;}
	});
	res.render("checkout-success");
}


// User Profile
app.get("/user_profile", function(req, res){
	var tempPassword = req.session.user.password.substring(0,3);
	// tempPassword += "*".repeat(req.session.user.password - 3);
	tempPassword = tempPassword.concat(Array(req.session.user.password.length - 3).join("*"));
	res.render("user_profile", {password:tempPassword});
});

// Create Account
app.get("/create-account", function(req, res){
	res.render("create-account", {duplicateUsername:false});
});

// Login Authentication TODO: make controller
app.post('/login', function(req, res){
	res.send("Successful to POST @ login '/login'!\n");
 });
 

// get product by id w/ callback
var getProductById = function(callback,res, product_id) {
	var statement = "SELECT * FROM product_table where product_id = " +product_id;
	connection.query(statement, function(error, results){
		if(error) throw error;
		if(results.length > 0){
			callback(results,res,product_id);
		} 
	});
}

// callback function for the product page
// using callback functions to over come the asynch issue
var renderProductPage = function(products,res,product_id){
	res.render("product-details", {product:products,product_id:product_id});
} 

// product details
app.get("/product-details", function(req, res){
	var product_id_ = req.query.productID;
	getProductById(renderProductPage,res,product_id_)
	// res.render("product-details", {productPath:req.query.productID});
});

// get specific products w/ callback
var getSpecificProducts = function(callback,res, product_n) {
	var statement = "SELECT * FROM product_table where img_path like '%" +product_n+"%'";
	connection.query(statement, function(error, results){
		if(error) throw error;
		if(results.length > 0){
			callback(results,res,product_n);
		} 
	});
}

// callback function for the product page
// using callback functions to over come the asynch issue
var renderProductDetails = function(products,res, product_n){
	res.render("product-page", {products:products, product_n:product_n});
} 

// product page
app.get("/product-page", function(req, res){
	var product_n = req.query.productID;
	getSpecificProducts(renderProductDetails,res,product_n)
});

// _________________________________________Search Functions_______________________________________________________________________________

// get specific products w/ callback
var searchProducts = function(callback,res, search_val) {
	var statement = "SELECT * FROM product_table where product_name like '%" +search_val+"%'";
	connection.query(statement, function(error, results){
		if(error) throw error;
		if(results.length > 0){
			callback(results,res,search_val);
		} else {
			res.redirect("/");
		} 
	});
}

// callback function for the product page
// using callback functions to over come the asynch issue
var renderProductDetailsSearch = function(products,res, search_val){
	// console.log	(products);
	res.render("product-page", {products:products, product_n:"Search: " + search_val});
} 
// ________________________________________________________________________________________________________________________________

//path to using the search functionality
app.get("/search-action", function(req, res) {
    var keyword = req.query.search_field;
    searchProducts(renderProductDetailsSearch,res,keyword)
    // res.render("product-page", {productID:id});
});

// after pressing the add to cart table
app.post("/add-to-cart", async function(req,res){
	if(req.session.user === undefined){
		res.render("login");
	} else {
		var quantity = req.body.quantity;
		console.log(quantity);
		var product_id_ = req.query.productID;
		var insert_stmt = "INSERT INTO order_table (user_id, product_id) VALUES (?,?)";
		var data = [req.session.user.user_id, product_id_];
		for(var i = 0;i<quantity;i++){
			connection.query(insert_stmt, data, function(error, results){
				if(error) throw error;
			});
		}
		res.redirect("/shopping-cart");
	}
});

// gets all of the items that a user has in their shopping cart
var getCartItems = function(callback, currentUserId, res){
	statement = "SELECT * FROM order_table NATURAL JOIN product_table WHERE user_id =" + currentUserId;
	connection.query(statement,function(error,results){
		if(error){ throw error;}
		console.log(results);
		callback(res, results);
	}); 
}

//callback function that renders the shopping-cart
var renderShoppingCart = function(res, products){
	// console.log(products);
	res.render("shopping-cart", {products:products});

}

// shopping cart
app.get("/shopping-cart", function(req, res){
	if(req.session.user === undefined){
		res.render("login");
	} else {
		var currentUserId = req.session.user.user_id;
		getCartItems(renderShoppingCart,currentUserId,res);
	}
	// res.render("shopping-cart");
});


var removeFromCart = function(callback,orderID,res){
	rem_stmt = "DELETE FROM order_table WHERE order_id =" + orderID;
	console.log(rem_stmt);

	connection.query(rem_stmt,function(error,results){
		if(error){throw error;}
		callback(res);
	});
}

var renderShoppingCart_Del = function(res){
	res.redirect("/shopping-cart");
}

// shopping cart
app.get("/remove-item", function(req, res){
	// var currentUserId = req.session.user.user_id;
	var orderID_ = req.query.orderID;
	removeFromCart(renderShoppingCart_Del,orderID_,res)
	// getCartItems(renderShoppingCart,currentUserId,res);

	// res.render("shopping-cart");
});

/* error page (route not found) */
app.get("/*", function(req, res){
	res.render("error");
});

// required server
app.listen(process.env.PORT || 3000, function(){
	console.log("Server is running...");
});
