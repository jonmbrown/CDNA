//
// CDNA.js
//
// Jon Brown - Mar 2015
//
// Retrieves netball details - started from Netball.js which just did the Hummers and the Legends
//
// Ideas: Could do a "now playing" page to show the teams that are playing and on what court
//        Show age groups?
//        Heatmap option based on calculated percentage?
//        Could charge extra to have your team as a button?
//        Need to build the gradeid array from reading the webpage - rather than hard coded
//
// 15 Aug 2018   Amended for summer season
//               37463, 37465, 37464, 37471 = Sierras U13-7, Legends U15-2, Thunderbirds U15-1, Hummers U17-4 Updated 15 Aug 2018
//
// 17 Jul 2018   Amended for summer season (grading games)
//               14852, 5813, 5812, 5818 = Sierras U13-7, Legends U15-2, Thunderbirds U15-1, Hummers U17-3
//
// 18 Apr 2018   Added buttons for H, L, S and T popular teams
//
// 12 Apr 2018   Amended for winter season (after grading games)
//               14852, 5814, 5813, 5818 = Sierras U13-7, Legends U15-3, Thunderbirds U15-2, Hummers U17-3
//
// 24 Mar 2018   Amended for winter season, id 105 - hosted on Heroku now.
//               35285, 35287, 35286, 35291 = Sierras U13-ORANGE, Legends U15-RED, Thunderbirds U15-BLUE, Hummers U17-RED
//
// 19 Aug 2017   Ameended for updates summer season. Some hiccups due to the source
//               web pages being updated during the week. Also hiccups uploading
//               to Bluemix (log error) but retried and it worked OK.
//               Sierras U11S4, Legends U13S2, Thunderbirds U15S2, Hummers U17S2
//
// 19 Jul 2017   Amended for Summer (!) Season - Sierras U11-x, Legends U13-RED, Thunderbirds U15-x, Hummers U17-RED
//
// 17 Apr 2017   Added Thunderbirds (U15S1)
//
// 24 Mar 2017   Loaded Winter (!) 2017 season - U11S4 (Barb's daughter), U13S2 (Sophie) and U17S3 (Ruby) only for speed
//               Keeping the code in erase/update mode as it's so quick to update with this small range of games (25 teams and 136 games)
//               Meteor version 1.4.3.2 needed to do $meteor npm install --save babel-runtime
//
//  6 AUG 2016   Not using test for local IP at refresh at all now
//
// 23 Jul 2016   Loaded summer (!) 2016 season by following the instructions in 10 Feb 2016 comment
//               Now only capturing U13 - U17 so it loads quicker and they're the teams I'm interested in.
//               Now at Meteor 1.3.5.1
//
// 10 Feb 2016   Amended for Winter 2016 season
//               Using Winter colour scheme : gold/yellow rather than greenyellow/yellow - see .css
//		 Note that the table colour scheme is hard coded in the .html (around line 52)
//		 Remember to uncomment out the kill and comment out the unblock if refreshing for a new year
//		 To see the areas to change for a new season, search for *NEW*
//
// 14 Jul 2015   Amended teams and seasonid for the Summer 2015 season. To do this, remember to delete the
//               CDNA and CDNATeams databases and comment out the this.unblock(); at the start of getGames: function(gradeID)
//               Also, remember to use GreetD now as Greet is commented out to stop too much stuff
//               Using Summer colour scheme : greenyellow/yellow rather than gold/yellow
//
// 21 May 2015   Removed the 'insecure' packages - no other changes required
//               Added a few things to .cfignore so they don't get uploaded too - older files are now in 'backups' directory
//
// 18 May 2015   Now sorts by team name when doing a search.
//               Now supports a CDNA_MESSAGE environment variable to show a message in red on the top of the app.
//      HOWEVER: CHANGING THE ENVIRONMENT VARIABLE CAUSES BLUEMIX SERVER TO RESTART SO USE WITH CAUTION!
//
// 15 May 2015   Added check for client IP address. Not used but may be handy in the future.
//               Current IP address is shown in the About menu option.
//               Added keyword (Wombat) to be used in search before performing a Refresh - stops it happening my accident / others
//               Added glyph icons for menu items
//
// 14 May 2015   Changed to load teams first - so seems to load MUCH faster (less than a second).
//               Because it loads faster PCdone (percent done) is now commented out in .JS and .HTML
//               Changed menu structure so looks better on desktop and mobile.
//               Also hides the number of games etc from main screen (and the refresh link too)
//
// 13 May 2015   Cannot use H1 for buttons as Caulfield South Thunderbirds stuffs it up!
//
// 12 May 2015   Commented out greet method for production and changed stylesheet a little and uses H1 for more friendly on a small mobile screen
//
// 11 May 2015   Changed to not delete the teamnames on a refresh - silly as they never change.
//               Now also only uses the collection - not an array as it got too confusing to keep things in sync
//               Need to NOT use unblock if loading the team names collection from scratch due to clashes with parallel IO
//               Perhaps the code to load the data should be in another app altogether.
//
//  9 May 2015   Used Netball colour for heading and fixed bug so that team array is cleaned out when team collection is killed
//               THOUGHTS: Maybe best to go back to the older Netball system (ie one collection to store games and teams
//               because otherwise a refresh may cause anyone looking at a team to see a totally new team displayed if the
//               system refreshes while they are looking - whoa!
//
//  5 May 2015   Better centering and now shows percent done as it loads (shows game and team count at the bottom)
//
//  3 May 2015   Made field names smaller and use own _id rather than system one. Now much smaller and faster.
//
// 26 Apr 2015   Major change to store the team names as a hash to save space and speed up DDP loading
//
// 20 Apr 2015   Removed duplicate 'teams' publish/subscribe as it was not required
//
// 25 Mar 2015   CDNA colours and better busy gif (uses ?2503 (today's date) after name to force reload)
//               No longer shows other team buttons once a team is selected
//               Table is hidden if it's empty
//               Added meta "user-scalable=no" to stop popup keyboard destroying reactivity
//
// 21 Mar 2015   No longer writes Bye records (to stop silly search results)
//
// 20 Mar 2015   Added date in Mongo format to be able to return records sorted by date
//               Added handlebar helper to change colours as page loads
//               Can now select opposition team to see how they have gone
//
// 19 Mar 2015 - Now reads all teams in the various age groups - next challenge is to sort out the selection of the team
//
// 18 Mar 2015 - First version from Netball.js
//               meteor add underscore - but could not get $meteor add zvictor:mongodb-server-aggregation to work
//

// These functions are available on both the client and the server ===========================

var greet = function(text) {
    /*
    console.log(text);
    if(Meteor.isClient) {
        if (Session.get("S-Debug")) Session.set("S-Greet", text); // If Debug is on, show status message
    }
    */
}

// A greet that is not commented out!
var greetD = function(text) {
    console.log(text);
    if(Meteor.isClient) {
        if (Session.get("S-Debug")) Session.set("S-Greet", text); // If Debug is on, show status message
    }
}

var isToday = function(date) { // Utility function to see if passed date (dd Mmm) is the same as today
    var d = new Date();
    var t = d.toString();
    var mmm = t.substring(4,7); // Month
    var dd = t.substring(8,10); // Day
    if (dd[0] == "0") { // If 01 May we want 1 May
        dd = t.substring(9,10);
//        greet("Single digit day");
    }
    var today = dd + " " + mmm;
//greet ("Game:" + date + ", Today:"+ today);
    if (date == today) return true;
    return false;
}

/* Example code:
function myFunction() {
    var fruits = ["EMPTY", "Caulfield South Legends", "Caulfield South Ferraris", "Caulfield South Hummers", "Caulfield South Thunderbirds"];
fruits.push("Legends");
    var a = fruits.indexOf("Legends");
*/

// Function that receives a text string and returns a number to use instead - kind of a hashing
// If the passed in string does not exist it is added to the collection and it's position is returned
// The aim is to map the long Netball team names (typical 20 chars or so) to a small numnber to
// save space and DDP load time. Before this process, the MongoLab collection was 262.36KB and the
// initial load took around 4 seconds (~2.5 on local machine)

var getHash = function(text) { // Utility function to see if passed team name is a new one or already exists

    var sel1={};
    var key1='Name';
    sel1[key1]=text;
    var teamnamerecord = NetballTeams.findOne( sel1 ); // See if we have a matching TeamName already

    if (teamnamerecord) {
        var hash = teamnamerecord.Hash;
        greet("Found match at hash " + hash);
        return hash; 
    }
    
    var count = NetballTeams.find({}).count(); // Number of entries
    var newhash = count + 1; // The hash is just the count of the new entry ie first entry has a hash of 1, 2nd has hash of 2 etc
    
    greet("No hash found. Added new team [" + text + "] as hash " + newhash);
    NetballTeams.insert({
        _id : newhash.toString(), Hash : newhash, Name : text
    }); // Meteor requires the _id to be a string
    return newhash;
}

NetballTeams = new Mongo.Collection("CDNATeams");

Netball = new Mongo.Collection("CDNA");

// Everything in here is only run on the server ==============================================

if(Meteor.isServer) {
    greet(">>> CDNA server is alive");

  Meteor.publish("netball", function () {
    return Netball.find();
  });

  Meteor.publish("netballteams", function () {
    return NetballTeams.find();
  });
  
  Meteor.methods({
    
    getMessage: function() { // Returns the contents of the environment variable CDNA_MESSAGE or ""
        var msg = process.env.CDNA_MESSAGE;
        if (typeof(msg) == 'undefined') {
//            greetD("Message UNDEFINED");
            return "";
        }
//        greetD("Message:" + msg);
        return msg; // eg Cancelled due to lightning   
    },
    
    getGames: function(gradeID) { // Looks up this team's details - Need Cheerio ie $meteor add mrt:cheerio // Probably should be a different application (just run by Jon)
/***************************************

   IF SETTING UP FOR A NEW SEASON, COMMENT
   OUT THE FOLLOWING UNBLOCK() CODE *NEW*

***************************************/

        //this.unblock(); // From an empty TeamNames database we cannot use this as could end up with duplicate team hashes due to parallel IO. Means updating stats takes ages! ~5 mins v 10 seconds!
        greet("Finding games for grade " + gradeID);
        
//      The url below is found by trial and error. Seems to be no way to deduce it.
//      Currently using hard coded gradeID for all supported teams (Legends and Hummers)

//      2015 Legends: seasonid=94&entityid=39427&gradeid=5802
//      2015 Hummers: same but gradeid=5814
//
//      2015 Summer season (starts July) seasonid=95
//	    2016 Winter season (starts Feb) seasonid=98
//
//      2016 Summer season (starts July) seasonid=99
//      2017 Winter season seasonid=102
//      2017 Summer season seasonid=103
//      2018 Winter season seasonid=105

/***************************************

   IF SETTING UP FOR A NEW SEASON
   ENSURE THE CORRECT SEASONID *NEW*

***************************************/
        var seasonid = 106;
        var url = "http://cdna.vic.netball.com.au/common/pages/public/rv/draw.aspx?seasonid=" + seasonid + "&entityid=39427&gradeid=" + gradeID;
        
        greet("URL:" + url);
        var result = HTTP.call("GET", url);
        var content = result.content;
//        greetD("(" + content.length + " bytes)");
//        greet("#################");
//        greetD(content);
//        greet("#################");
        
      greet("About to load into Cheerio...");
        var $ = cheerio.load(content);
        greet("Loaded into Cheerio...");
        var count = 0;
        
//      CHEERIO DOCUMENTATION HERE: https://github.com/cheeriojs/cheerio (scroll down)

        $('tr[class="fixtureRow"]').each(function(i, row)
        {
            var children = $(this).children();       
           greetD("Child 0 of " + i + " = " + $(children[0]).text());
           greetD("Child 1 of " + i + " = " + $(children[1]).text());
           greetD("Child 2 of " + i + " = [" + $(children[2]).text() + "]");
           greetD("Child 3 of " + i + " = " + $(children[3]).text());
           greetD("Child 4 of " + i + " = " + $(children[4]).text());

/* Result is something like this...
            
        Child 0 of 33 = 29 May 15 6:20PM
        Child 1 of 33 = St Anthonys Stars
        Child 2 of 33 = [  v  ]
    or  Child 2 of 33 = [ 9 def 2 ]
    or  Child 2 of 33 = [ 8 def by 6 ]
    or  Child 2 of 33 = [ 6 drew 6 ]
        Child 3 of 33 = Murrumbeena Brumbies
        Child 4 of 33 = 
                      Court 3 
*/
            var gameDate = $(children[0]).text(); // 29 May 15 6:20PM
            var team1    = $(children[1]).text();
            var team1Score = "";
            var team2Score = "";
            var team2 = "";
            var court = "";
            var courtNum = "";
            var gameTime = "";
            var gameHH = 0;
            var gameMM = 0;
            var gameDay = "";
            var result;
            var bye = false;
            
//          If txt is null then it's a bye
            if (team1 === "Bye")
            {
//              greet("BYE TYPE 1 FOUND");
              gameDay = gameDate.split(" ")[0]+" "+gameDate.split(" ")[1]; // Only DD MMM
              bye = true;
            }
            else
            {            
              team2 = $(children[3]).text();
              if (team2 === "Bye") {
//                greet("BYE TYPE 2 FOUND");
                gameDay = gameDate.split(" ")[0]+" "+gameDate.split(" ")[1]; // Only DD MMM
                team2 = "";
                team1 = "Bye"; // So all Byes are of the same form
                bye = true;
              }
              else
              {
                 var result = $(children[2]).text(); // v or 9 def 2
                 if (result.indexOf("v") > 0) // " v " does not work ?!
                 {
                    // greet("Unplayed game");
                 }
                 else
                 {
 //                   greet("Result before " + result);
                    result = result.replace(/[^0-9]/g, ' '); // Any none numbers become spaces
                    result = result.replace(/\s+/g, ' '); // Remove multiple spaces
 //                   greet("Result after " + result);
                    var scores = result.split(" ");
                    team1Score = scores[1];
                    team2Score = scores[2];
                 }
                 court = $(children[4]).text();
                 court = court.replace(/[^0-9]/g, ''); // Remove any none numbers
                 //courtNum = court.substr(court.length-2,1); // One character court number
	         courtNum = court;
                 //greetD("court:" + court + ":,  length: " + court.length + "courtNum:" + courtNum);
                 var gamestart = gameDate.split(" ")[3];    // 6:20PM
                 greetD("GradeID:" + gradeID + " gamestart:" + gamestart); // Logging this as it sometimes seems to kick out an error
                 gameTime = gamestart.split(/[AP]/)[0];     // Part before the AM/PM
                 var gameAMPM = gamestart.substr(gamestart.length-2,2); // AM/PM
//                 greet("== GAMETIME:" + gameTime + "(" + gameAMPM + ")");
                 gameHH = parseInt(gameTime.split(":")[0]); // Hours
                 gameMM = parseInt(gameTime.split(":")[1]); // Minutes
                 greetD("gradeID:" + gradeID + " gameHH:gameMM " + gameHH + ":" + gameMM);
                 if (gameHH == 12) {
                    // Mid-day so ignore
//                    greet("NOON");
                 }
                 else
                 {
                    if (gameAMPM.indexOf("P") == 0) // If it's in the afternoon but after 12, we add 12 to make it 24hr clock
                    {
                        gameHH += 12;
//                        greet("AFTERNOON");
                    }
                    else
                    {
//                        greet("MORNING");                        
                    }
                 }
                 gameDay = gameDate.split(" ")[0]+" "+gameDate.split(" ")[1]; // Only DD MMM
                }
            }
//          If there's a score then set the court to blank as game has been played
            if (team1Score != "") courtNum = "";
            
            var months = {
                            Jan: 1,
                            Feb: 2,
                            Mar: 3,
                            Apr: 4,
                            May: 5,
                            Jun: 6,
                            Jul: 7,
                            Aug: 8,
                            Sep: 9,
                            Oct: 10,
                            Nov: 11,
                            Dec: 12
                        };
            var gameDD = gameDate.split(" ")[0]; // DD
            
            var gameMMM = gameDate.split(" ")[1]; // MMM
            var gameMonthNum = months[gameMMM];

            var gameYY = "20" + gameDate.split(" ")[2]; // YY
                           
            var d = new Date();
            d.setFullYear(gameYY, gameMonthNum-1, gameDD);
//            greet("Game date =" + d);
            d.setHours(gameHH);
            d.setMinutes(gameMM);
            d.setSeconds(0);
            d.setMilliseconds(0)
            
//            greet("Game date/time =" + d);
//            greet("Round " + count + ") " + gameDay + "/" + gameTime + "/" + team1 + "/" + team1Score + "::" + team2Score + "/" + team2 + "/" + courtNum + "/");
            if (bye)
            {
//                greet("Ignoring Bye"); // Don't write or count Bye records
            }
            else
            {
                var t1 = getHash(team1);
                var t2 = getHash(team2);
                var id = t1.toString()+ " " + t2.toString()+ gameDay; // Using a smaller unique ID saves time and space at startup
                Netball.insert({
                  _id : id, At: d, gD: gameDay, gT: gameTime, T1: t1, T2: t2, C: courtNum, S1: team1Score, S2: team2Score
//WAS                  _id : id, At: d, gD: gameDay, gT: gameTime, T1: getHash(team1), T2: getHash(team2), C: courtNum, S1: team1Score, S2: team2Score
 // WAS                 gameAt: d, gameDay: gameDay, gameTime: gameTime, Team1: getHash(team1), Team2: getHash(team2), Court: courtNum, Score1: team1Score, Score2: team2Score
                }); // Could add ,createdAt: new Date() // current time
                count++;
            }
        }); // S()
        greet("COUNT:" + count);        
        return count;
    }, // getGames
 
    KillNetball: function() {
      greet("\nKilling all netball games");
      Netball.remove({});
    }, // KillNetball

    KillNetballTeams: function() {
      greet("\nKilling all netball teams - NOT REALLY - NOT REQUIRED!"); // Not killing them means they stay in the same order on refresh
/***************************************

   IF SETTING UP FOR A NEW SEASON,
   UNCOMMENT THE FOLLOWING LINE *NEW*

***************************************/
     NetballTeams.remove({}); // COMMENTED OUT! *NEW*
    }, // KillNetballTeams
    
    getIP: function(){
        var ip = this.connection.clientAddress;
        return ip;
    } // GetIP
    
  });
} // isServer

// Everything in here is only run on the client ==============================================

if(Meteor.isClient) {
    Session.set("S-busy", 'Y'); // On startup assume we're busy
    Session.set("S-team-count", 0);
    
    Meteor.subscribe("netballteams", function() {
//      Callback...
        Session.set("S-busy", 'N'); // Assume we're not busy now    
    });
    
    Meteor.subscribe("netball", function() {
//      Callback...
        Session.set("S-busy", 'N'); // Assume we're not busy now    
    });
    
    Meteor.startup(function () {
//  Check to see if we're running locally (inside home network). This is used to see if we can run the Refresh function
        Session.set("S-LocalIP", false);
        Meteor.call('getIP', function(error, result){
            if (error){
                Session.set("S-IPAddr", "Unknown");
            }
            else {
               Session.set("S-IPAddr", result);
               var pos = result.indexOf("192.168.");
               if (pos == 0) {
//                    greetD("Client is running locally at " + result);
                    Session.set("S-LocalIP", true);
               } else {
//                   greetD("Client is " + result);               
               }
            }
        });

//      Find any environment variable message
/* POINTLESS TO INCLUDE HERE AS CHANGING THE ENVIRONMENT VARIABLE CAUSES BLUEMIX SERVER TO RESTART!
        Session.set("S-EnvMsg", "");
        Meteor.call('getMessage', function (err, data) {
            if (!err) Session.set("S-EnvMsg", data);
        }); // Meteor.call
*/        
        greet("Client is alive");
                    
    }); // Client startup
      
    var getNameFromHash = function(hash) { // Utility function to return the name given the hash
    if (!hash) return "";
    var sel1={};
    var key1='Hash'; // Hash
    var val1=parseInt(hash); //parseInt(hash);
    sel1[key1]=val1;
    var team=NetballTeams.findOne( sel1 ).Name; // The name matching the hash
//    greet(team);
    return team;
    };
    
//  ========================    
    Template.teamButton.helpers({
//  ========================    
    
    tTeamButton: function () {
        return this;
    },

    tTeamShortButton: function () {
        var words = this.split(" ");
        return words[(words.length)-1]; // Just use the shortname - problem for St.Paul's...?!
    }

  }); // Template.teamButton.helpers
    
//  ========================    
    Template.games.helpers({
//  ========================     

    tgameDayColour: function () {
//    Highlight today's game
      if (isToday(this.gD)) {
        return "lightblue";
      }
      return "inherit";      
    },
    
    tTeam: function () {
//    Only shows the opposition team
      var team1 = this.T1;
      var team2 = this.T2;
      if (Session.get("S-team") == team1) {
        return getNameFromHash(team2); // Don't show selected team name
      }
      return getNameFromHash(team1);      
    },

    tHashTeam: function () {
//    Only shows the opposition team
      var team1 = this.T1;
      var team2 = this.T2;
      if (Session.get("S-team") == team1) {
        return team2; // Don't show selected team name
      }
      return team1;      
    },
    
    tgameTime: function () {
      var team1 = this.T1;
      if (Session.get("S-team") == team1) {
//      Home game so add a space as there will be an icon there
        return " "+this.gT;
      }
      return this.gT;
    },

    tgameHome: function () {
//    Show a home icon if it's a home game
      var team1 = this.T1;
      if (Session.get("S-team") == team1) {
//      Home game so show it (if there's no result yet ie game has not been played)
        if (this.S1 =="") {
          return "glyphicon glyphicon-home"; 
        }
        return ""; 
      }
      return "";
    },
    
    tResultColour: function () {
      if (this.C > 0) return "black"; // If there's a court number there's no result
//    Shows the result with selected team first
      var s1 = parseInt(this.S1);
      var s2 = parseInt(this.S2);
      if (Session.get("S-team") == this.T1) { // Home game
        if (s1 >= s2) return "green"; // Win
        return "red"; // Loss
      }
      // Away game
      if (s2 >= s1) return "green"; // Win
      return "red"; // Loss 
    },
    
    tCourt_or_Result: function () {
      if (this.C > 0) return this.C; //    If there's a court number there's no result

//    Shows the result with selected team first
      var s1 = parseInt(this.S1);
      var s2 = parseInt(this.S2);
      if (Session.get("S-team") == this.T1) {
        return s1 + "-" + s2; // Normal result order as was a home game
      }
      // Away game
      return s2 + "-" + s1; // Reverse order for away result  
    }

  }); // Template.games.helpers
    
    Handlebars.registerHelper('NavbarColour', function(number) {
        if (!Session.get("S-busy")) return "navbar-inverse0"; // Starting up...
        if (Session.get("S-busy") != 'N') {
          return "navbar-inverse1";
        } else {
          return "navbar-inverse2";
        }
  });
      
//  ========================    
    Template.body.helpers({
//  ========================    
      
/* NO LONGER USED      
    BusySymbol: function () { // Show a busy graphic if we are
        if (!Session.get("S-busy")) return "busy.gif?2503"; // Starting up...
        
        if (Session.get("S-busy") != 'N') {
          return "busy.gif?2503"; // "Loading data...";
        } else {
          return "blank.gif"; // Nothing (ie not busy)
        }
    },
*/
    anyMessage: function () { // Returns contents of message envirnment variable
        return Session.get("S-EnvMsg");
    },
    
    isBusy: function () { // Returns visible or hidden depending on busy status
        if (!Session.get("S-busy")) return "visible"; // Starting up...
        if (Session.get("S-busy") != 'N') {
          return "visible"; // "Loading ...";
        } else {
          return "hidden"; // Nothing (ie not busy)
        }
    },
    
    isNOTBusy: function () { // Returns visible or hidden depending on busy status
        if (!Session.get("S-busy")) return "hidden"; // Starting up...
        if (Session.get("S-busy") != 'N') {
          return "hidden"; // "Loading ...";
        } else {
          return "visible"; // Something (ie not busy)
        }
    },
    
    isTableEmpty: function () {
        if (Session.get("S-team")) {
            return "visible"; // A team is selected so show its table
        }
        return "hidden"; // Hide empty table
    },
/*
    PCdone: function () { // percent loaded (uses Teams so it appears to load faster)
      var num = NetballTeams.find({}).count();
      if (num < 10) return 5; // Pretend we've loaded something
      return Math.floor(100 * num / 200); // Roughly
    },
*/

    IPAddr: function () {
      return Session.get("S-IPAddr");
    },

    NumGames: function () { // Number of games loaded
      return Netball.find({}).count();
    },

    NumTeams: function () { // Number of teams games loaded
      return NetballTeams.find({}).count();
    },
    
    TeamName: function () {
      if (!Session.get("S-busy")) return "Starting up"; // Starting up...
      if (Session.get("S-busy") != 'N') return ""; // Loading teams..."; // + Session.get("S-team-count");
      if (!Session.get("S-short")) return ""; // Starting up
      return getNameFromHash(Session.get("S-team")); // + " Fixture and Results"; // or can use S-short      
    },
    
    // New version using the NetballTeams collection and sorting the result by team name
    teams: function () {
        if (!Session.get("S-team-search"))
        {
            return; // Nothing to look up
        }
        var query = Session.get("S-team-search");
        Session.set("S-team-count", 5);
        
        var search = new RegExp(query, 'i');
        return NetballTeams.find({ "Name": search }, { sort: { "Name" : 1 } } ); 
// Old, unsorted:  return NetballTeams.find({"Name": { "$regex": query, "$options": 'i' } } ); // NetballTeams.find( { Name: { $eq: query } } );
    },     
            
    netball: function () {
    // All the games for the current team, sorted by game date

    greet("HASH is " + Session.get("S-team"));
    var query = parseInt(Session.get("S-team"));
    
/* AAAAAGGGGGHHHHHH!!!!!

var key = 'species';
var value = 'elephant';

var selector = {key: value};
Animals.find(selector);

But there is a subtle JavaScript gotcha that will prevent this find from returning the right results:

Using a variable identifier as a key in an object literal will substitute the identifier and not the value.

selector is actually evaluated as {key: 'elephant'} and not {species: 'elephant'} as intended. The only way to fix this is to initialize selector as an empty object and then use bracket notation to set the key:

var key = 'species';
var value = 'elephant';

var selector = {};
selector[key] = value;
Animals.find(selector);

*/
    var sel1={};
    var key1='T1';
    var val1=query;
    
    var sel2={};
    var key2='T2';
    var val2=query;

    sel1[key1]=val1;
    sel2[key2]=val2;
    
    return Netball.find({ $or: [ sel1, sel2 ] },
                        { sort: { "At": 1 }}); // Sort by ascending date
    }
  });  // Template.body.helpers
    
//  ========================    
  
//  ========================    
    Template.body.events({
//  ========================    

// 2015 Legends: seasonid=94&entityid=39427&gradeid=5802
// 2015 Hummers: same but gradeid=5814
//
/* ########################
// TO FIND THE gradeid, do this:
//
// 1. Go to CDNA -> Fixtures eg http://cdna.vic.netball.com.au/common/pages/public/rv/draw.aspx?entityid=39427&
// 2. View source
// 3. Find the section with the code for the drop-down. For example:
<option value="5802_1">-11 &amp; Under Section 1</option>
<option value="5804_1">-11 &amp; Under Section 2</option>
<option value="5805_1">-11 &amp; Under Section 3</option>
<option value="5806_1">-11 &amp; Under Section 4</option>
<option value="5874_1">-11 &amp; Under Section 5</option>
<option value="5875_1">-11 &amp; Under Section 6</option>
<option value="14852_1">-11 &amp; Under Section 7</option>
<option selected="selected" value="5807_1">-13 &amp; Under Section 1 - 2</option>
<option value="5809_1">-13 &amp; Under Section 3</option>
<option value="5810_1">-13 &amp; Under Section 4</option>
<option value="5811_1">-13 &amp; Under Section 5</option>
<option value="14857_1">-13 &amp; Under Section 6</option>
<option value="5812_1">-15 &amp; Under Section 1</option>
<option value="5813_1">-15 &amp; Under Section 2</option>
<option value="5814_1">-15 &amp; Under Section 3</option>
<option value="5815_1">-15 &amp; Under Section 4</option>
<option value="5816_1">-15 &amp; Under Section 5</option>
<option value="5817_1">-17 &amp; Under Section 1</option>
<option value="5818_1">-17 &amp; Under Section 2</option>
<option value="5819_1">-17 &amp; Under Section 3</option>
<option value="10871_1">-17 &amp; Under Section 4</option>
<option value="5821_1">-25 &amp; Under Section 1</option>
<option value="5822_1">-25 &amp; Under Section 2</option>
<option value="10872_1">-25 &amp; Under Section 3</option>
// 4. Notice the nnnn_l that corresponds to what team you want
// (eg in 2015, Sophie (Legends) was in Under 11 Section 1 = 5802_l)
// 5. The gradeid is nnnn
// 6. Check that the seasonid is correct too
//
// ########################*/

    "submit .team-search": function (event) {
//      Called when part of the team name is entered
        var text = event.target.text.value;
        greet("Submit text is " + text);
        Session.set("S-team-search", text);
        Session.set("S-team", null); // No selected team if we're searching
        event.target.text.value = ""; // Clear the form
        
//      Check incase any new environment variable message
        Meteor.call('getMessage', function (err, data) {
            if (!err) Session.set("S-EnvMsg", data);
        }); // Meteor.call
        
        return false; // Prevent default form submit
    },

//  Added special buttons for popular teams - 18 April 2018
     "click .SpecialButton": function (e) {
      var clickedButton = e.currentTarget;
//    greetD("Special Button:" + clickedButton.id);
      var team = clickedButton.id; 
      Session.set("S-busy", 'N');
      Session.set("S-team-search", null); // Not searching for a team as we have it
      var teamID = getHash(team);         // Get teamID from team name
      Session.set("S-team", teamID);
//    greetD("Special Button ID:" + teamID);
      var words = team.split(" ");
//    greetD("Words:" + words);
      Session.set("S-short",words[(words.length)-1]); // Make sure headings are displayed (just has to be none-blank)
    }, // SpecialButton

    "click .TeamButton": function (e) {
//      Which team did we select?
        var clickedButton = e.currentTarget;
//        greet("Button:" + clickedButton.id);
        var team = clickedButton.id; 
      Session.set("S-busy", 'N');
      Session.set("S-team", team);
      var words = Session.get("S-team").split(" ");
      greet("Words:" + words);
      Session.set("S-short",words[(words.length)-1]);
      Session.set("S-team-search", null); // Don't need the team buttons any more
    }, // TeamButton

    "click .OppositionButton": function (e) {
//      We want to know about the opposition
        var clickedButton = e.currentTarget;
//        greet("Button:" + clickedButton.id);
        var team = clickedButton.id; 
      Session.set("S-busy", 'N');
      Session.set("S-team", team);
      var words = Session.get("S-team").split(" ");
      greet("Words:" + words);
      Session.set("S-short",words[(words.length)-1]);
    }, // OppositionButton

    "click .refresh": function () {
//  Reloads all game details
//  First check to see if we're running locally. If not, this method does nothing
//  NO LONGER USED SO COMMENTED OUT NOW
//  if (!Session.get("S-LocalIP")) {
//      greetD("Attempted to run Refresh from public IP");
//      return; // COMMENTED OUT - NOW USES A HIDDEN WORD TO VALIDATE THAT REFRESH IS OK
//  }

/***************************************

   IF SETTING UP FOR A NEW SEASON, COMMENT
   OUT THE FOLLOWING SECTION - TO *HERE* *NEW*

***************************************/
      /*
      greetD("S-team-search:" + Session.get("S-team-search"));
        if (Session.get("S-team-search") == "Wombat") {
              greetD("REFRESH will run");
        } else {
              greetD("REFRESH attempted but will not run");
              return;
        }*/
   /* *HERE* */
 
      Session.set("S-busy", 'Y');
      Session.set("S-team", null);
      Session.set("S-team-search", null);
      Session.set("S-short", null);
            
      Meteor.call('KillNetball', function (err, data) {
          if (err) {
            greet("Kill Netball games FAILED");
            return;
          }
          greet("Killed Netball games OK");
          Meteor.call('KillNetballTeams', function (err, data) {
              if (err) {
                greet("Kill Netball teams FAILED");
                return;
              }
              greet("Killed Netball teams OK");
//              var sections =  [ 5802, 5814 ]; // Shorter for testing
/***************************************

   IF SETTING UP FOR A NEW SEASON,
   ENSURE CORRECT SECTIONS *NEW*
   SECTIONS AKA GRADEIDS

***************************************/
//              var sections =  [ 5802, 5804, 5805, 5806, 5874, 5875, 5807, 20092, 5809, 5810,
//                                5811, 5812, 5813, 5814, 5815, 5816, 5817, 21955, 5818, 5819,
//                                5821, 5822, 10872 ]; // All the sections for 2015
                            
              // var sections = [ 5802, 5804, 5805, 5806, 5874, 5875, 5807, 20092, 5809, 5810, 5811, 5812, 5813, 5814, 5815, 5816, 5817, 21955, 5818, 5819 ]; // U11 - U17

              // 2017: U11 Section 4, U13 Section 2, U17 Section 3 - Barb's daughter, Ruby and Sophie for super faster loading
              // 2017: Summer Season (July) - Sierras U11S4, Legends U13S1, Thunderbirds U15S2, Hummers U17S2

//              var sections = [ 20092 ]; // TESTING LEGENDS BUG

              // var sections = [ 5806, 20092, 5813, 21955 ]; // Sierras U11S4, Legends U13S2, Thunderbirds U15S2, Hummers U17S2 Updated 19 Aug 2017


              // var sections = [ 35285, 35287, 35286, 35291 ]; // Grading: Sierras U13-ORANGE, Legends U15-RED, Thunderbirds U15-BLUE, Hummers U17-RED Updated 24 Mar 2018

              // var sections = [ 14852, 5814, 5813, 5818 ]; // Sierras U13-7, Legends U15-3, Thunderbirds U15-2, Hummers U17-3 Updated 12 Apr 2018

              // var sections = [ 14852, 5813, 5812, 5818 ]; // Sierras U13-7, Legends U15-2, Thunderbirds U15-1, Hummers U17-3 Updated 18 Jul 2018

              var sections = [ 37463, 37465, 37464, 37471 ]; // Sierras U13-7, Legends U15-2, Thunderbirds U15-1, Hummers U17-4 Updated 15 Aug 2018

//              
              for (var i = 0; i < sections.length; i++)
              {
                greetD("Calling getGames for " + sections[i]);
                Meteor.call('getGames', sections[i], function (err, data) {
                  if (err)
                  {
                      greetD("getGames FAILED");
                      Session.set("S-busy", 'N');
                  }
                  else
                  {
                      greetD("getGames returned " + data + " games OK");
                      Session.set("S-busy", 'N');
                  }
                }); // Meteor.call
              }  // for
            }); // KillNetballTeams
        }); // KillNetball games
    } // refresh
    
  }); // Template.body.events
  
//  ========================         

} //is Client
