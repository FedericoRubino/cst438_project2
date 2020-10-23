// Checkout Success
app.get("/checkout-success", function(req, res){	
	var user_id = req.session.user.user_id;

	var statement = "SELECT * FROM order_table NATURAL JOIN product_table where user_id = " + user_id;
	conncetion.query(statement,function(err,results){
		if(err) throw err;
		if(results.length > 0){
			function1( results,req,res);
		} else {
			res.redirect("/");
		}
	})
});	


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

var function2 = function(inventory,res,req){

	inventory.forEach((val, key) =>{
		var newInventory = val;
		updateStatement = "UPDATE product_table SET inventory = " + newInventory +" WHERE product_id=" + key;
		connection.query(updateStatement, function(err,result){
			if(err) throw err;
			res.redirect("/");
		}
	});
}