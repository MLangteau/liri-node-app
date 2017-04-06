// Load the keys
var keys = require('./keys.js');  // must be same as file with stuff
//console.log(keys.twitterKeys);

//spotify-this-song,"I Want it That Way" in random.txt

// try other variations of above for other commands
// movie-this,"Star Wars", etc.

var fs = require("fs");

var request = require("request");
var Twitter = require('twitter');
var spotify = require('spotify');
var movieOrSongPopulated = false;
var maxNumOfSongs = 5;

// Take two arguments.
var command = process.argv[2];
//var movieOrSongStr = process.argv[3];  // temporarily unless more than one word in string
var movieOrSongStr = " ";

var movieDefault = "Mr Nobody";
var songDefault = "The Sign";
var dataOne = [];
var delimiterOne = ",";
var delimiterWrite = " ; ";

if (process.argv.length >3) {
    process.argv.shift();  // skip node.exe [0]
    process.argv.shift();  // skip name of js file [1]
    process.argv.shift();  // skip action/command [2]

    console.log("process.argv.join: " + process.argv.join(" "));
    movieOrSongStr = process.argv.join(" ");
    movieOrSongPopulated = true;
};

console.log("command: " + command);
console.log("movieOrSongStr: " + movieOrSongStr);

decideSwitch(command, movieOrSongStr);

function decideSwitch(action, value) {
    console.log("inside decideSwitch");
    console.log("action: " + action);
    console.log("value: " + value);

    switch (action) {
      case "help":
      case "h":
        console.log("\nType one of the following commands:\n node liri.js my-tweets \n node liri.js spotify-this-song '<song name here>' \n node liri.js movie-this '<movie name here>'  \n node liri.js do-what-it-says\n");
        console.log("OR one of the following short-cut commands:\n node liri.js tw \n node liri.js sp '<song name here>' \n node liri.js mo '<movie name here>'  \n node liri.js do");
        break;

      case "my-tweets":
      case "tw":
      case "my":
        console.log("Switch my-tweet");
        tweet();
        break;

      case "spotify-this-song":
      case "song":
      case "sp":
        console.log("Switch spotify");
        console.log("movieOrSongPopulated: " + movieOrSongPopulated);
        if (movieOrSongPopulated === true) {
//        if ((typeof value === 'string') && (value != " ")) {
          spot(value);
        } 
        else {
          value = songDefault;
          spot(value);
        }
        break;

      case "movie-this":
      case "mo":
        console.log("Switch movie-this");
        if (movieOrSongPopulated === true) {
//        if (typeof value === 'string') {
          movies(value);
        } 
        else {
          value = movieDefault;
          movies(value);
        }
        break;

      case "do-what-it-says":
      case "do":
//        console.log("Going to read random file function.");
        readRandom();
        break;

      default:
        throw new Error("\nYou MUST type one of the following commands:\n node liri.js my-tweets \n node liri.js spotify-this-song '<song name here>' \n node liri.js movie-this '<movie name here>'  \n node liri.js do-what-it-says\n OR Type: 'node liri.js help' for help");
        break;

     }  // end of switch (action)
     return;
}; // end of decideSwitch function

function tweet() {
	
  console.log("in tweet function");
  var client = new Twitter(keys.twitterKeys);
  var params = {screen_name:'flotus'}; 
//  var params = {screen_name:'ReenieSwim'}; 

  client.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (!error) {
    console.log("tweets.length: " + tweets.length);
    if (tweets.length > 20) {
      newTweetslength = 20;
    }
    else {
      newTweetslength = tweets.length;  
    }
    initialTweetLabel = "\nThese are in Latest tweets first order: ";
    writeToLogAndConsole(initialTweetLabel);
    for (var i=0; i<tweets.length; i++){
      tweetInfo = "\nTweets: " + tweets[i].created_at + " " + tweets[i].text + delimiterWrite;
      writeToLogAndConsole(tweetInfo);
    }
  }
  else {
    tweetError = "Error in finding tweet!!!!!!!!!!!!";
    writeToLogAndConsole(tweetError);
  } 
  return;
  });  // end of client.get
  return;
}; // end of tweet function

function spot(songChoice) {
    console.log("songChoice in spot function: " + songChoice);

    spotify.search({ type: 'track', query: songChoice}, function(err, data) {

      if (err || data.tracks.items.length <=0) { // in search of any song is bad
        throw Error("Error in choosing song: " + songChoice);
        return;
      }  // end of if in search of any song is in err
      else {  // if you find the original songChoice (no err)
          console.log("Good: data.tracks.items.length: " + data.tracks.items.length);
          if (data.tracks.items.length >=5){
            maxNumOfSongs = 5;
          }
          else {
            maxNumOfSongs = data.tracks.items.length;
          }
          console.log("maxNumOfSongs: " + maxNumOfSongs);

          for (var i=0; i<maxNumOfSongs; i++) {
            // Artist name
            artistName = "\n\n Artist Name: " + data.tracks.items[i].album.artists[0].name + delimiterWrite;
            writeToLogAndConsole(artistName);
            // Preview link
            previewLink = " Preview link: " + data.tracks.items[i].preview_url + delimiterWrite;
            writeToLogAndConsole(previewLink);
            // Name of the song (specifically)
            nameOfSong = " Name of the Song: " + data.tracks.items[i].name + delimiterWrite;
            writeToLogAndConsole(nameOfSong);
            // Name of the Album the song is from 
            albumName = " Album Name: " + data.tracks.items[i].album.name + delimiterWrite;
            writeToLogAndConsole(albumName);
          }; // end of for loop
      }  // end of else of if (err) which is (no err)
    }); // end of spotify search function (outside)
  return;
}  // end of spot function

function movies(movieChoice) {
	console.log("in movies function");
// Then run a request to the OMDB API with the movie specified
  request("http://www.omdbapi.com/?t=" + movieChoice + "&y=&plot=short&tomatoes=true&r=json", function(error, response, body) {
    if (!error && response.statusCode === 200) {

//  the following console.log is used to find rotten tomatoes and body
//      console.log("THIS IS THE (body): ", JSON.parse(body));  

      // * Title of the movie.
      movieTitle = "\n\n Title: " + JSON.parse(body).Title + delimiterWrite;
      writeToLogAndConsole(movieTitle);
      // * Year the movie came out.
      movieYear = "\n Year: " + JSON.parse(body).Year + delimiterWrite;
      writeToLogAndConsole(movieYear);
      // * IMDB Rating of the movie.
      movieRating = "\n Rating: " + JSON.parse(body).Ratings[0].Value + delimiterWrite;
      writeToLogAndConsole(movieRating);
      // * Country where the movie was produced.
      movieCountry = "\n Country: " + JSON.parse(body).Country + delimiterWrite;
      writeToLogAndConsole(movieCountry);
      // * Language of the movie.
      movieLang = "\n Language: " + JSON.parse(body).Language + delimiterWrite;
      writeToLogAndConsole(movieLang);
      // * Plot of the movie.
      moviePlot = "\n Plot: " + JSON.parse(body).Plot + delimiterWrite;
      writeToLogAndConsole(moviePlot);
      // * Actors in the movie.
      movieActors = "\n Actors: " + JSON.parse(body).Actors + delimiterWrite;
      writeToLogAndConsole(movieActors);
      // * Rotten Tomatoes Rating.
      movieTomatoRating = "\n Rotten Tomatoes Rating: " + JSON.parse(body).tomatoRating + delimiterWrite;
      writeToLogAndConsole(movieTomatoRating);
      // * Rotten Tomatoes URL.
      movieTomatoURL = "\n Rotten Tomatoes URL: " + JSON.parse(body).tomatoURL + delimiterWrite;
      writeToLogAndConsole(movieTomatoURL);

    } // end of if 
  }); // end of one of the request functions
};  // end of movies function

function writeToLogAndConsole(writeStuff) {
 // Creates and appends/prints to a file called "log.txt".
  console.log(writeStuff);
  fs.appendFile("log.txt", writeStuff, function(error) {

    // If write errors, log the error to the console.
    if (error) {
      return console.log("Error writing to the log.txt file", error);
    }
    // Otherwise, it will print: "log.txt was updated!"
    console.log("log.txt was updated.");

  });  // end of writeTxtFile
  return;
}; // end of writeLogAndConsole function

function readRandom() {
  console.log("Inside of function readRandom");

  fs.readFile("random.txt", "utf8", function(error, data) {
//    console.log("In readRandom.");
    if (error) throw error;
    //data = data.split(delimiter);
    console.log("data: ", data);

// split the words by the delimeter established in the variable (var) section
    dataOne = data.split(delimiterOne);
    console.log("dataOne: ", dataOne);
    if ((dataOne[0] == "do-what-it-says") || (dataOne[0] == "do")) {
      throw new Error("Must not type 'do-what-it-says' or 'do' in the random text file");
      //  console.log("may be an endless loop if you try do-what-it-says in file);
      return;
    }
    else {
      console.log(" dataOne[0]/command: " + dataOne[0]);
      console.log(" dataOne[1]/movieOrSongStr: " + dataOne[1]);

      switch (dataOne[0]) {
        case "movie-this":
        case "mo":
          value = movieDefault;
          movieOrSongPopulated = true;
        break;

        case "spotify-this-song":
        case "sp":
          value = songDefault;
          movieOrSongPopulated = true;
        break;
      }  // end of switch

      decideSwitch(dataOne[0], dataOne[1]);

    }  // end of else (does not have "do-what-it-says" in the file-endless loop)
  }) // end of readFile
  return;
  // end of readRandom function on next line 
}; 