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
  case "h":
    console.log("type one of the following commands:\n node liri.js my-tweets \n node liri.js spotify-this-song '<song name here>' \n node liri.js movie-this '<movie name here>'  \n node liri.js do-what-it-says");
    console.log("or one of the following commands:\n node liri.js tw \n node liri.js sp '<song name here>' \n node liri.js mo '<movie name here>'  \n node liri.js do");
    break;

  case "my-tweets":
  case "tw":
  case "my":
    tweet();
    break;

  case "spotify-this-song":
  case "song":
  case "sp":
    spot();
    break;

  case "movie-this":
  case "mo":
    movies();
    break;

  case "do-what-it-says":
  case "do":
    doWhat();
    break;
}

function tweet() {
	
  console.log("in tweet function");
  var client = new Twitter(keys.twitterKeys);
  var params = {screen_name: 'ReenieSwim'};
//  var params = {screen_name:'flotus'}; 

  client.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (!error) {
    console.log("tweets.length: " + tweets.length);
    if (tweets.length > 20) {
      newTweetslength = 20;
    }
    else {
      newTweetslength = tweets.length;  
    }
    console.log("These are in Latest tweets first order: ");
    for (var i=0; i<tweets.length; i++){
      console.log(tweets[i].created_at + " " + tweets[i].text + "\n");
    }
  }
  else {
    console.log("error is finding tweet!!!!!!!!!!!!")
  }
  });  // end of client.get

}; // end of tweet function

function spot() {

	console.log("in spot function");

  if (process.argv[3]) {
    //   console.log("querySong is populated.");

    // Take in the command line arguments
    var nodeArgs = process.argv;

    // Create an empty string for holding the querySong
    var querySong = "";

    // Capture all the words in the querySong (ignoring 1st three arguments)
    for (var i = 3; i < nodeArgs.length; i++) {
      // Build a string with the querySong
      querySong = querySong + " " + nodeArgs[i];
    }
    console.log("querySong: **********" + querySong + " **********");
    //    spotify.search({ type: 'track', query: 'dancing in the moonlight' }, function(err, data) {
    spotify.search({ type: 'track', query: querySong}, function(err, data) {
      console.log("err " + err);
      if (err || data.tracks.items.length <=0) { // in search of any song is bad
        querySong = "the ace of base"; 
        console.log("Made the ace of base the querySong: " + querySong);
        spotify.search({ type: 'track', query: querySong}, function(err, data) {
          if (err || data.tracks.items.length <=0) { // in search of the ace of base/err
            console.log('Error occurred in searching for song: ' + querySong);
            return;
          }
          else { // in search of ace of base is good
            for (var i=0; i<data.tracks.items.length; i++) {
              console.log("in this part" + querySong);
              // Artist name
              console.log("\nArtist Name: data.tracks.items[i].album.artists[0].name: ", data.tracks.items[i].album.artists[0].name);
              // Preview link
              console.log("Preview link: data.tracks.items[i].preview_url: ", data.tracks.items[i].preview_url);
              // Name of the song (specifically)
              console.log("Name of the Song: data.tracks.items[i].name: ", data.tracks.items[i].name);
              // Name of the Album the song is from 
              console.log("Album Name: data.tracks.items[i].album.name: ", data.tracks.items[i].album.name);
            } // end of for loop
          }  // end of else of if (err) // in search of the ace of base
        }); // end of spotify search function
//        return;
console.log("near return");
      }  // end of if in search of any song
      else {  // if you find the song
        console.log("data.tracks.items.length: " + data.tracks.items.length);
        for (var i=0; i<data.tracks.items.length; i++) {
          //console.log("Spotify data.tracks.items[i].album: ", data.tracks.items[i].album);
          //console.log("Spotify data.tracks.items[i].album.artists[0].external_urls: \n", data.tracks.items[i].album.artists[0].external_urls);

          // Artist name
          console.log("\nArtist Name: data.tracks.items[i].album.artists[0].name: ", data.tracks.items[i].album.artists[0].name);
          // Preview link
          console.log("Preview link: data.tracks.items[i].preview_url: ", data.tracks.items[i].preview_url);
          // Name of the song (specifically)
          console.log("Name of the Song: data.tracks.items[i].name: ", data.tracks.items[i].name);
          // Name of the Album the song is from 
          console.log("Album Name: data.tracks.items[i].album.name: ", data.tracks.items[i].album.name);
        } // end of for loop
      }  // end of else of if (err)
    }); // end of spotify search function
  }  // end of if querySong is not blank
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