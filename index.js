var express = require("express");
var app = express();

app.set('view engine', 'ejs');


// Home
app.get("/", function(req, res){
	res.render("home");
});


/* error page (route not found) */
app.get("/*", function(req, res){
	res.render("error");
});


// required server
app.listen(process.env.PORT || 3000, function(){
	console.log("Server is running...");
});

