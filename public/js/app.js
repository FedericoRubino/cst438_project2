function testFun(string){
    document.write("The test function prints: " + string +  "<br>");
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

// print individual images based off the buttons
var showImages = function(value) {
    paths = ['images\\Core\\CPU\\CPU','images\\Accessories\\HardDrives\\HardDrive','images\\Accessories\\Adapters\\Adapter', 'images\\Core\\MotherBoard\\Motherboard','images\\Accessories\\USB\\USB', 'images\\Accessories\\Cables\\Cable'];
    for (var i = 1; i < 4; i++) {
        var id = paths[value].split("\\")[3];
        document.getElementById("images").innerHTML += "<a href='product-details?productID="+paths[value]+i+"'> <img src='"+paths[value]+i+".jpg' width=50> </a>";

        // document.getElementById("images").innerHTML += "<img src='"+paths[value]+i+".jpg' width=50>";
    } 
}

// print all of tne images for the home page 
var showButtonImagesHome = function() {
    paths = ['images\\Core\\CPU\\CPU','images\\Accessories\\HardDrives\\HardDrive','images\\Accessories\\Adapters\\Adapter', 'images\\Core\\MotherBoard\\Motherboard','images\\Accessories\\USB\\USB', 'images\\Accessories\\Cables\\Cable'];
    for ( var i = 1; i < 4; i++) {
        for ( var k = 0; k < paths.length; k++) {
            var id = paths[k].split("\\")[3];
            document.getElementById("p"+i).innerHTML += "<a href='product-details?productID="+paths[k]+i+"'> <img src='"+paths[k]+i+".jpg' width=50> </a>";
        }
    }
}
