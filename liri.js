// Load the keys
var keys = require('./keys.js');  // must be same as file with stuff
//console.log(keys.twitterKeys);
// holds the package "request"
var request = require("request");
var Twitter = require('twitter');

var spotify = require('spotify');


// Take two arguments.
var action = process.argv[2];
var value = process.argv[3];

switch (action) {
  case "help":
    console.log("type one of the following commands:\n node my-tweets \n node spotify-this-song '<song name here>' \n node movie-this '<movie name here>'  \n node do-what-it-says");
    break;

  case "my-tweets":
    tweet();
    break;

  case "spotify-this-song":
    spot();
    break;

  case "movie-this":
    movies();
    break;

  case "do-what-it-says":
    doWhat();
    break;
}

function tweet() {
	
  console.log("in tweet function");
  var client = new Twitter(keys.twitterKeys);
//  var params = {screen_name: 'ReenieSwim'};
  var params = {screen_name: 'wsj'};

  client.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (!error) {
    console.log(tweets);
  }
});

};

function spot() {

	console.log("in spot function");

  spotify.search({ type: 'track', query: 'dancing in the moonlight' }, function(err, data) {
    if ( err ) {
        console.log('Error occurred: ' + err);
        return;
    }
 
    // Do something with 'data'
  
  }); // end of spotify search function
}  // end of spot function
function movies() {
	console.log("in movies function");

// Include the request npm package 
// don't forget "npm init", then "npm install request --save" first

// Grab the movieName which will always be the third node argument.
var movieName = value;

// Then run a request to the OMDB API with the movie specified
var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&r=json";

// This line is just to help us debug against the actual URL.
console.log(queryUrl);

// end of movies function
};

function doWhat() {
	console.log("in doWhat function");
// end of doWhat function
};