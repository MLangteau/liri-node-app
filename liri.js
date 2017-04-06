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

var maxNumOfSongs = 5;

// Take two arguments.
var command = process.argv[2];
//var value = process.argv[3];

process.argv.shift();  // skip node.exe
process.argv.shift();  // skip name of js file
process.argv.shift();  // skip action

console.log(process.argv.join(" "));

movieOrSongStr = process.argv.join(" ");

console.log("command: " + command);
console.log("movieOrSongStr: " + movieOrSongStr);

//var valueToDo = "";
//var actionToDo = "";
var dataOne = [];
var delimiterOne = ",";
var delimiterWrite = " ; ";
//var readingFromFile = false;
//var queryStr = "";
//var queryString = "";

decideSwitch(command, movieOrSongStr);
//console.log("King 1");

console.log("Here: first");

function decideSwitch(action, value) {
    console.log("inside decideSwitch");
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
        if (typeof value === 'string') {
          spot(value);
        } else {
          throw new Error("must have a song choice after spotify-this-song.\ntype 'node liri.js help' for additional help. ");
        }
        break;

      case "movie-this":
      case "mo":
        console.log("Switch movie-this");
        if (typeof value === 'string') {
          movies(value);
        } else {
          throw new Error("must have a song choice after movie-this.\ntype 'node liri.js help' for additional help. ");
        }
        break;

      case "do-what-it-says":
      case "do":
        console.log("Going to read random file function.");
        readRandom();
//        readingFromFile = false;
  //      console.log("below reset to false");
        break;
     }  // end of switch (action)
     return;
}; // end of decideSwitch function

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
    initialTweetLabel = "\nThese are in Latest tweets first order: ";
    writeToLogAndConsole(initialTweetLabel);
    for (var i=0; i<tweets.length; i++){
      tweetInfo = "\nTweets: " + tweets[i].created_at + " " + tweets[i].text + delimiterWrite;
      writeToLogAndConsole(tweetInfo);
    }
  }
  else {
    console.log("error in finding tweet!!!!!!!!!!!!");
  } 
  return;
  });  // end of client.get
  return;
}; // end of tweet function

function spot(songChoice) {

// console.log("readingFromFile? " + readingFromFile);
 // if (!readingFromFile) {
 //   console.log("prepopulate spot");
   // populateValue(queryStr, queryString);

    console.log("songChoice in spot function: " + songChoice);

    //    spotify.search({ type: 'track', query: 'dancing in the moonlight' }, function(err, data) {
    spotify.search({ type: 'track', query: songChoice}, function(err, data) {
      console.log("is there and err? " + err);
      if (err || data.tracks.items.length <=0) { // in search of any song is bad
        songChoice = "the ace of base"; 
        console.log("Made the ace of base the songChoice: " + songChoice);
        spotify.search({ type: 'track', query: songChoice}, function(err, data) {
          if (err || data.tracks.items.length <=0) { // in search of the ace of base/err
              console.log('Error occurred in searching for song: ' + songChoice);
              return;
          }
          else { // in search of ace of base is good
//            getSongInfo(data);

              console.log("ACE: data.tracks.items.length: " + data.tracks.items.length);
              if (data.tracks.items.length >=5){
                maxNumOfSongs = 5;
              }
              else {
                maxNumOfSongs = data.tracks.items.length;
              }
              console.log("maxNumOfSongs: " + maxNumOfSongs);
    //        getSongInfo(data);
              for (var i=0; i<maxNumOfSongs; i++) {
                // delimeter string
        //        songIntro = "\nSong you chose: ";
          //      writeToLogAndConsole(songIntro);
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
              } // end of for loop
          }  // end of else of if (err) // in search of the ace of base
        }); // end of spotify search function (inside search)
        return;
        console.log("near return");
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
//        getSongInfo(data);
          for (var i=0; i<maxNumOfSongs; i++) {
            // delimeter string
      //      songIntro = "\nSong you chose: ";
      //      writeToLogAndConsole(songIntro);
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
//////////////  }  // end of if queryStr is not blank
  return;
}  // end of spot function

function movies(movieChoice) {
	console.log("in movies function");
// Then run a request to the OMDB API with the movie specified
  request("http://www.omdbapi.com/?t=" + movieChoice + "&y=&plot=short&r=json", function(error, response, body) {
    if (!error && response.statusCode === 200) {
//      console.log("THIS IS THE (body): ", JSON.parse(body));
      // delimeter string
 //     movieIntro = "\nThe following is about the movie you chose: ";
 //     writeToLogAndConsole(movieIntro);
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
//        .
      // * Rotten Tomatoes URL
//        .
    } // end of if 
    else 
    {
      console.log("Movie not found or not entered. ");
      movieChoice = "Mr Nobody";
      request("http://www.omdbapi.com/?t=" + movieChoice + "&y=&plot=short&r=json", function(error, response, body) {
          if (!error && response.statusCode === 200) {

     //       intro = "\nThe following is about the movie you chose: ";
       //     writeToLogAndConsole(intro);
            // * Title of the movie.
            title = "\n\n Title: " + JSON.parse(body).Title + delimiterWrite;
            writeToLogAndConsole(title);
            // * Year the movie came out.
            year = "\n Year: " + JSON.parse(body).Year + delimiterWrite;
            writeToLogAndConsole(year);
            // * IMDB Rating of the movie.
            rating = "\n Rating: " + JSON.parse(body).Ratings[0].Value + delimiterWrite;
            writeToLogAndConsole(rating);
            // * Country where the movie was produced.
            country = "\n Country: " + JSON.parse(body).Country + delimiterWrite;
            writeToLogAndConsole(country);
            // * Language of the movie.
            language = "\n Language: " + JSON.parse(body).Language + delimiterWrite;
            writeToLogAndConsole(language);
            // * Plot of the movie.
            plot = "\n Plot: " + JSON.parse(body).Plot + delimiterWrite;
            writeToLogAndConsole(plot);
            // * Actors in the movie.
            actors = "\n Actors: " + JSON.parse(body).Actors + delimiterWrite;
            writeToLogAndConsole(actors);
            // * Rotten Tomatoes Rating.
    //        .
            // * Rotten Tomatoes URL
    //        .
          } // end of if
        }) // end of one of the request functions
    }  // end of else 
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
   // readingFromFile = true;
    // If there was an error reading the file, we log it and return immediately
    //var delimiter = ",";
    if (error) throw error;
    //data = data.split(delimiter);
    console.log("data: ", data);

// split the words by the delimeter established in the variable (var) section
    dataOne = data.split(delimiterOne);
    console.log("dataOne: ", dataOne);

    console.log(" dataOne[0]/command: " + dataOne[0]);
    console.log(" dataOne[1]/movieOrSongStr: " + dataOne[1]);

//    var actionToDo = dataOne[0];
//    var valueToDo = dataOne[1];

//    console.log(" actions: " + action + " "  + actionToDo);
//    console.log(" values: " + value + " "  + valueToDo);

    decideSwitch(dataOne[0], dataOne[1]);
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
  return;
// end of readRandom function following this line
};