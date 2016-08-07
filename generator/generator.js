/*  Online Name Generators v.1.0 script is  made by Niels Gamborg webmaster at online-generator.com.  
*    The script is  free (as in "free speech" and also as in "free beer") in anyway. Use it after you own likings.
*    Peace and love. :)
*/
	
function generator(){
	var rustle = ["Rabbi", "Rachel", "Radish", "Railroad", "Rainbow", "Ramble", "Ramrod", "Ranch", "Ratburn", "Raven", "Ravioli", "Reagan", "Rebel", "Reindeer", "Relish", "Renaissance", "Retro", "Rhino", "Rhombus", "Rhubarb", "Ribcage", "Ringling", "Romans", "Ronald", "Rubble", "Rumble", "RuneScape"];
	var bromley = ["Bachelor", "Backgammon", "Backstroke", "Badminton", "Bagpipes", "Banjo", "Barbell", "Barber", "Barnacles", "Barnyard", "Baron Friedrich Wilhelm Ludolf Gerhard Augustin von Steuben", "Beachball", "Beanbag", "Beanstalk", "Benchpress", "Biceps", "Bilgepump", "Billiards", "Birdcall", "Birdwoman", "Biscuit", "Blackbeard", "Blackjack", "Bladder" , "Blister", "Blockbuster", "Board of Education", "Boatshoes", "Bobsled", "Bocce", "Boris", "Bosnia", "Breadbox", "Britches", "Bridesmaid", "Brimstone", "Broccoli", "Broth", "Bruegger's", "Buddhist", "Bulwark", "Bunkbed", "Burglar", "Butler"];
	var bands = ["Baha Men", "Black Sabbath", "Bob Dylan", "Dave and Buster's", "Rochester Institute of Technology", "Uncle Rico", "Wilford Brimley"];
	
	var r1 = parseInt(Math.random() * rustle.length);
	var r2 = parseInt(Math.random() * bromley.length);
	var r3 = parseInt(Math.random() * bands.length);
	
	var genName = rustle[r1] + " and " + bromley[r2];
	var bandName = bands[r3];
	
	var whichName = Math.random() * 100;
	if (whichName < 95) {
		var name = genName;
	}
	else {
		var name = bandName;
	}
	
	//remove any existing name 
	if(document.getElementById("result")){
		document.getElementById("placeholder").removeChild(document.getElementById("result"));
	}
	
	var element = document.createElement("div");
	element.setAttribute("id", "result");
	element.appendChild(document.createTextNode(name));
	document.getElementById("placeholder").appendChild(element);
	document.title = name;
}

function firstLoad() {
	var link = document.createElement("a");
	var name = document.createTextNode("Rustle and Bromley");
	link.appendChild(name);
	link.href = "https://www.facebook.com/RustleAndBromley";
	link.target = "_blank";
	var element = document.createElement("div");
	element.setAttribute("id", "result");
	element.appendChild(link);
	document.getElementById("placeholder").appendChild(element);
}