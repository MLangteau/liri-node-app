// Load the keys
var keys = require('./keys.js');  // must be same as file with stuff
//console.log(keys.twitterKeys);

var fs = require("fs");

var request = require("request");
var Twitter = require('twitter');
var spotify = require('spotify');

// Take two arguments.
var action = process.argv[2];
var value = process.argv[3];

var valueToDo = "";
var actionToDo = "";
var dataOne = [];
var delimiterOne = ",";
var delimiterWrite = " ; ";
var readingFromFile = false;
var queryStr = "";
var queryString = "";

console.log("King 0");
//decideSwitch(actionToDo, valueToDo);
//decideSwitch();
console.log("King 1");

//function decideSwitch(action, value){
//function decideSwitch(){  
console.log("Here: first");

if ((action == "do-what-it-says") || (action == "do")) {
    console.log("Previsit doWhat");
    readingFromFile = true;
    console.log("below reset to true");
//    readRandom(actionToDo, valueToDo);
    fs.readFile("random.txt", "utf8", function(error, data) {
      console.log(" reading random.txt ");
     // readingFromFile = true;
      // If there was an error reading the file, we log it and return immediately
      //var delimiter = ",";
      if (error) throw error;
      //data = data.split(delimiter);
      console.log("data: ", data);
      dataOne = data.split(delimiterOne);
      console.log("dataOne: ", dataOne);

  //    console.log(" dataOne[0]/action: " + dataOne[0]);
  //    console.log(" dataOne[1]/value: " + dataOne[1]);
      var actionToDo = dataOne[0];
      var valueToDo = dataOne[1];

      console.log("DO actionToDo: " + actionToDo);
      console.log("DO valueToDo: " + valueToDo);
   
      value = valueToDo;
      action = actionToDo;

  }) // end of readFile
}  // end of if
else {
    console.log("Not a do");
    readingFromFile = false;
    console.log("below reset to false");
    console.log("action: " + action);
    console.log("value: " + value);
}

console.log("getting switched");
console.log("***action: " + action);
console.log("***value: " + value);

switch (action) {
  case "help":
  case "h":
    console.log("type one of the following commands:\n node liri.js my-tweets \n node liri.js spotify-this-song '<song name here>' \n node liri.js movie-this '<movie name here>'  \n node liri.js do-what-it-says");
    console.log("or one of the following commands:\n node liri.js tw \n node liri.js sp '<song name here>' \n node liri.js mo '<movie name here>'  \n node liri.js do");
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
    spot();
    break;

  case "movie-this":
  case "mo":
    console.log("Switch movie-this");
    movies();
    break;

//  case "do-what-it-says":
//  case "do":
//    console.log("Going to doWhat");
//    doWhat();
//    readingFromFile = false;
//    console.log("below reset to false");
//    break;
 }
// return;
//} // end of decideSwitch function

function tweet() {
	
  console.log("in tweet function");
  var client = new Twitter(keys.twitterKeys);
  var params = {screen_name:'flotus'}; 

  client.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (!error) {
    console.log("tweets.length: " + tweets.length);
    if (tweets.length > 20) {
      newTweetslength = 20;
    }
    else {
      newTweetslength = tweets.length;  
    }
    writeStuff = "\nThese are in Latest tweets first order: ";
    writeToLogAndConsole(writeStuff);
    for (var i=0; i<tweets.length; i++){
      writeStuff = "Tweets: " + tweets[i].created_at + " " + tweets[i].text + delimiterWrite;
      writeToLogAndConsole(writeStuff);
    }
  }
  else {
    console.log("error in finding tweet!!!!!!!!!!!!")
  } 
  return;
  });  // end of client.get
  return;
}; // end of tweet function

/*function populateValue(queryStr, queryString) {

  // moved the lines that were previously here

  console.log("queryStr populated: " + queryStr);
  console.log("queryString populated: " + queryString);

  return queryStr;
}  // end of populateValue
*/
function spot() {

	console.log("in spot function");

  console.log("readingFromFile? " + readingFromFile);
  if (!readingFromFile) {
    console.log("prepopulate spot");
   // populateValue(queryStr, queryString);

    if (process.argv[3]) {
    //   console.log("queryStr is populated.");
    // Take in the command line arguments
    console.log("going to populate.")
    var nodeArgs = process.argv;

    // Create an empty string for holding the queryStr
    var queryStr = "";

    // Capture all the words in the queryStr (ignoring 1st three arguments)
    for (var i = 3; i < nodeArgs.length; i++) {
      // Build a string with the queryStr
      queryStr = queryStr + " " + nodeArgs[i];
    }
  }
  console.log("queryStr populated NOW******: " + queryStr);
  console.log("regular spot");
  }
  else {
    console.log("actionToDo and valueToDo" + actionToDo + " " + valueToDo);
    queryStr = valueToDo;
  }

    console.log("queryStr: **********" + queryStr + " **********");

    //    spotify.search({ type: 'track', query: 'dancing in the moonlight' }, function(err, data) {
    spotify.search({ type: 'track', query: queryStr}, function(err, data) {
      console.log("err " + err);
      if (err || data.tracks.items.length <=0) { // in search of any song is bad
        queryStr = "the ace of base"; 
        console.log("Made the ace of base the queryStr: " + queryStr);
        spotify.search({ type: 'track', query: queryStr}, function(err, data) {
          if (err || data.tracks.items.length <=0) { // in search of the ace of base/err
            console.log('Error occurred in searching for song: ' + queryStr);
            return;
          }
          else { // in search of ace of base is good
//            getSongInfo();

              console.log("data.tracks.items.length: " + data.tracks.items.length);
              for (var i=0; i<data.tracks.items.length; i++) {
                // Artist name
                writeStuff = " Artist Name: data.tracks.items[i].album.artists[0].name: " + data.tracks.items[i].album.artists[0].name + delimiterWrite;
                writeToLogAndConsole(writeStuff);
                // Preview link
                writeStuff = " Preview link: data.tracks.items[i].preview_url: " + data.tracks.items[i].preview_url + delimiterWrite;
                writeToLogAndConsole(writeStuff);
                // Name of the song (specifically)
                writeStuff = " Name of the Song: data.tracks.items[i].name: " + data.tracks.items[i].name + delimiterWrite;
                writeToLogAndConsole(writeStuff);
                // Name of the Album the song is from 
                writeStuff = " Album Name: data.tracks.items[i].album.name: " + data.tracks.items[i].album.name + delimiterWrite;
                writeToLogAndConsole(writeStuff);
              }; // end of for loop


          }  // end of else of if (err) // in search of the ace of base
        }); // end of spotify search function
        return;
        console.log("near return");
      }  // end of if in search of any song
      else {  // if you find the song
          console.log("data.tracks.items.length: " + data.tracks.items.length);

//        getSongInfo();
          for (var i=0; i<data.tracks.items.length; i++) {
            // Artist name
            writeStuff = "\nArtist Name: data.tracks.items[i].album.artists[0].name: " + data.tracks.items[i].album.artists[0].name + delimiterWrite;
            writeToLogAndConsole(writeStuff);
            // Preview link
            writeStuff = "Preview link: data.tracks.items[i].preview_url: " + data.tracks.items[i].preview_url + delimiterWrite;
            writeToLogAndConsole(writeStuff);
            // Name of the song (specifically)
            writeStuff = "Name of the Song: data.tracks.items[i].name: " + data.tracks.items[i].name + delimiterWrite;
            writeToLogAndConsole(writeStuff);
            // Name of the Album the song is from 
            writeStuff = "Album Name: data.tracks.items[i].album.name: " + data.tracks.items[i].album.name + delimiterWrite;
            writeToLogAndConsole(writeStuff);
          }; // end of for loop

      }  // end of else of if (err)
    }); // end of spotify search function
//////////////  }  // end of if queryStr is not blank
  return;
}  // end of spot function
/*
function getSongInfo() {
  console.log("data.tracks.items.length: " + data.tracks.items.length);
  for (var i=0; i<data.tracks.items.length; i++) {
    //console.log("Spotify data.tracks.items[i].album: ", data.tracks.items[i].album);
    //console.log("Spotify data.tracks.items[i].album.artists[0].external_urls: \n", data.tracks.items[i].album.artists[0].external_urls);
    // Artist name
  }; // end of for loop
}  // end of getSongInfo function
*/
function movies() {
	console.log("in movies function");

  if ((process.argv[3])) {
     console.log("queryStr is populated.");
    // Take in the command line arguments
    var nodeArgs = process.argv;

    // Create an empty string for holding the queryStr
    var queryStr = "";

    // Capture all the words in the queryStr (ignoring 1st three arguments 0,1,2)
    for (var i = 3; i < nodeArgs.length; i++) {
      // Build a string with the queryStr
      queryStr = queryStr + " " + nodeArgs[i];
    }
//    console.log("queryStr: **********" + queryStr + " **********");

    // Then run a request to the OMDB API with the movie specified
    request("http://www.omdbapi.com/?t=" + queryStr + "&y=&plot=short&r=json", function(error, response, body) {
      if (!error && response.statusCode === 200) {
 //      console.log("THIS IS THE (body): ", JSON.parse(body));
        writeStuff = "\nThe following is about the movie you chose: ";
        writeToLogAndConsole(writeStuff);
        // * Title of the movie.
        writeStuff = " Title: " + JSON.parse(body).Title + delimiterWrite;
        writeToLogAndConsole(writeStuff);
        // * Year the movie came out.
        writeStuff = " Year: " + JSON.parse(body).Year + delimiterWrite;
        writeToLogAndConsole(writeStuff);
        // * IMDB Rating of the movie.
        writeStuff = " Rating: " + JSON.parse(body).Ratings[0].Value + delimiterWrite;
        writeToLogAndConsole(writeStuff);
        // * Country where the movie was produced.
        writeStuff = " Country: " + JSON.parse(body).Country + delimiterWrite;
        writeToLogAndConsole(writeStuff);
        // * Language of the movie.
        writeStuff = " Language: " + JSON.parse(body).Language + delimiterWrite;
        writeToLogAndConsole(writeStuff);
        // * Plot of the movie.
        writeStuff = " Plot: " + JSON.parse(body).Plot + delimiterWrite;
        writeToLogAndConsole(writeStuff);
        // * Actors in the movie.
        writeStuff = " Actors: " + JSON.parse(body).Actors + delimiterWrite;
        writeToLogAndConsole(writeStuff);
        // * Rotten Tomatoes Rating.
//        .
        // * Rotten Tomatoes URL
//        .
      } // end of if queryStr is okay
      else 
      {
        console.log("Movie not found or not entered. ");
        return;
      }  // end of else 
    })  // end of request function
  }  // end of if process.argv[3] ... if moveName is populated
  else {
    console.log('Error occurred in searching for movie: ' + queryStr);
    return;
  }
  return;
}; // end of movies function

//function doWhat() {

//	console.log("in doWhat function");
//  readRandom();
//  readingFromFile = false;
//  console.log("readingFrom File is now false,");
//  console.log("below readRandom but before return of doWhat");
//  return; 
//};  // end of doWhat function


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
}; // end of writeLogAndConsole function

function readRandom(action, value) {
  console.log("Inside of function readRandom");

  fs.readFile("random.txt", "utf8", function(error, data) {
//    console.log("In readRandom.");
   // readingFromFile = true;
    // If there was an error reading the file, we log it and return immediately
    //var delimiter = ",";
    if (error) throw error;
    //data = data.split(delimiter);
    console.log("data: ", data);
    dataOne = data.split(delimiterOne);
    console.log("dataOne: ", dataOne);

    console.log(" dataOne[0]/action: " + dataOne[0]);
    console.log(" dataOne[1]/value: " + dataOne[1]);
    var actionToDo = dataOne[0];
    var action = dataOne[0];
    var valueToDo = dataOne[1];
    var value = dataOne[1];

    console.log(" actions: " + action + " "  + actionToDo);
    console.log(" values: " + value + " "  + valueToDo);

/*
    if ((valueToDo == "do-what-it-says") || (valueToDo == "do")) {
      throw error;
        console.log("may be an endless loop:");
      return;
    }
    else {
      console.log("not an error");
      decideSwitch(actionToDo,valueToDo);
      return;
    }
*/
  }) // end of readFile
  return action, value;
// end of readRandom function following this line
} // end