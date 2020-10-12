// nothing in here is being used anymore

//________________________________________________________________ Unused functions __________________________________________________________________________________________


// global variables
paths = ['images\\Core\\CPU\\CPU', 'images\\Core\\MotherBoard\\Motherboard','images\\Accessories\\HardDrives\\HardDrive','images\\Accessories\\USB\\USB','images\\Accessories\\Cables\\Cable', 'images\\Accessories\\Adapters\\Adapter'];

// Card sample
// card = "<div class='col-sm'> " +
//                     "<div class='card' style='width: 18rem;'> " +
//                         "<img class='card-img-top' src=arr[0] alt='Card image cap'> " +
//                             "<div class='card-body'> " +
//                                 "<h5 class='card-title'>Card title</h5> " +
//                                 "<p class='card-text'>card content.</p> " +
//                                 "<a href='#' class='btn btn-primary'>Go somewhere</a> " +
//                             "</div> " +
//                     "</div> " +
//                 "</div>";
// helper function to create the cards
var createCard = function(source, content, title, path){
    return "<div class='col-sm'> " +
                    "<div class='card' style='width: 18rem; margin-top:10px;'> " +
                        "<img class='card-img-top' src="+ source +" alt='Card image cap: "+ title +"'> " +
                            "<div class='card-body'> " +
                                "<h6 class='card-title'>"+ title +"</h6> " +
                                "<p class='card-text'>"+ content +".</p> " +
                                "<a href='product-details?productID="+ path +'.jpg'+"' class='btn btn-primary'>Product Details</a> " +
                            "</div> " +
                    "</div> " +
                "</div>";
}


// print individual images in the style that Anna designed
var showImagesCards = function(value) {
    for (var i = 1; i < 4; i++) {
        var source = paths[value]+i+".jpg";
        var id = paths[value].split("\\")[3];
        var content = "This is a high performing " + id; 
        document.getElementById("images").innerHTML += createCard(source, content, id, paths[value] + i);
    } 
}


// print all of tne images for the home page
// making the images buttons w/o details 
var showButtonImagesHome = function() {
    for ( var i = 1; i < 4; i++) {
        for ( var k = 0; k < paths.length; k++) {
            var id = paths[k].split("\\")[3];
            document.getElementById("p"+i).innerHTML += "<a href='product-details?productID="+paths[k]+i+"'> <img src='"+paths[k]+i+".jpg' width=50> </a>";
        }
    }
}

var homeDisplay = function(product) {
    document.getElementById("images").innerHTML += createCard(product.img_path, product.details,product.product_name , product.img_path);
}



// test function
function testFun(string){
    document.write("The test function prints: " + string +  "<br>");
}


// print individual images based off the buttons
var showImages = function(value) {
    for (var i = 1; i < 4; i++) {
        var id = paths[value].split("\\")[3];
        document.getElementById("images").innerHTML += "<a href='product-details?productID="+paths[value]+i+"'> <img src='"+paths[value]+i+".jpg' width=50> </a>";

        // document.getElementById("images").innerHTML += "<img src='"+paths[value]+i+".jpg' width=50>";
    } 
}


// returns an array based on user input
 function getSRCs(value) {
    var arrSRCs = new Array();
    for (var i = 0; i < 3; i++) {
        var id = paths[value].split("\\")[3];
        arrSRCs[i]= '"+paths[value]+i+".jpg';
        return arrSRCs;
        // document.getElementById("images").innerHTML += "<img src='"+paths[value]+i+".jpg' width=50>";
    } 
}

function Dictionary() {
    this.datastore = [];

    this.add = function(key, value) {
        if(key && value) {
            this.datastore.push({
                key: key,
                value: value
            });
            return this.datastore;
        }
    };

    this.removeAt = function(key) {
        for(var i = 0; i < this.datastore.length; i++ ) {
            if(this.datastore[i].key === key) {
                this.datastore.splice(this.datastore[i], 1);
                return this.datastore;
            }
        }
        return this.datastore;
    };

    this.findAt = function(key) {
        for(var i = 0; i < this.datastore.length; i++) {
            if (this.datastore[i] === key) {
                return this.datastore[i].value;
            }
        }
        return this.datastore;
    };

    this.size = function() {
        return this.datastore.length;
    };

}//Dictionary()

