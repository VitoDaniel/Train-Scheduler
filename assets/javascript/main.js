// add CDN for Firebase html script
// firebase configuration
// initialize the firebase
// capture the users inputs 
    // clear the form for the next train.
    // trim() the inputs , create an object of the data
//create new data in database
// get back data from database
// use momentjs to calculate time of the next train arrival
// use momentjs to calculate minutes away
// create html elements  and append it to the page


// Initialize Firebase
var config = {
    apiKey: "AIzaSyBoZiClm1exGSCnjLpjnETeq_aUeDDugYE",
    authDomain: "train-scheduler-bb0eb.firebaseapp.com",
    databaseURL: "https://train-scheduler-bb0eb.firebaseio.com",
    projectId: "train-scheduler-bb0eb",
    storageBucket: "",
    messagingSenderId: "928291333623"
  };
  firebase.initializeApp(config);

  // Create a variable to reference the database
  var database = firebase.database();


//   initial value
var name = "";
var destination = "";
var firstTime = "";
var frequency = "";
var currentTime = 0;
var index = 0;
var trains = [];

// show current time
var datetime = null;
date = null;

var update = function (){
    date = moment(new Date())
    datetime.html(date.format('dddd, MMMM Do YYYY, h:mm:ss a'));
};

$(document).ready(function(){
    datetime = $("#current-time")
    update();
    setInterval(update, 500);
});


//   capture button click
$("#btnSubmit").on("click", function(){
    // don't refresh the page
    event.preventDefault();
        name = $("#train-name").val().trim(),
        destination = $("#destination").val().trim(),
        firstTime = $("#FTT").val().trim(),
        frequency = $("#frequency").val().trim()

        // first time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
        // console.log("FTC: " + firstTimeConverted);

        // difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        // console.log("Difference in time :" + diffTime);

        // time apart, remidner
        var tRemainder = diffTime % frequency;
        // console.log(tRemainder);

        // minutes until train
        var minutesAway = frequency - tRemainder;
        // console.log("Minutes away :" + minutesAway);

        // next train time:
        var nextTrain = moment().add(minutesAway, "minutes");
        // console.log("Arrival time :" + moment(nextTrain).format("HH:mm"));

        // arrival time
        var nextArrival = moment(nextTrain).format("HH:mm a");
        
        var nextArrivalUpdate = function(){
            date = moment(new Date())
            datetime.html(date.format('HH:mm a'));
        }
    
    // handle the push
    database.ref().push({
        name: name,
        destination: destination,
        firstTime: firstTime,
        frequency: frequency,
        minutesAway: minutesAway,
        nextArrival: nextArrival,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

    // empty text input fort the next train
    $(".form-control").val("");
});

// display last 20 trains
database.ref().orderByChild("dateAdded").limitToLast(20).on("child_added", function(snapshot){

    console.log("train name: " + snapshot.val().name);
    console.log("Destination: " + snapshot.val().destination);
    console.log("First Train : " + snapshot.val().firstTime);
    console.log("Frequency: " + snapshot.val().frequency);
    console.log("Next train: " + snapshot.val().nextArrival);
    console.log("minutes Away: " + snapshot.val().minutesAway);
    console.log("%%%%%%%%%%%%DONE%%%%%%%%%%%");

    // change the html with data from database
    $("#trainList").append("<tr><td>" + snapshot.val().name + "</td>" +
"<td>" + snapshot.val().destination + "</td>" +
"<td>" + snapshot.val().frequency + "</td>" +
"<td>" + snapshot.val().nextArrival + "</td>" +
"<td>" + snapshot.val(). minutesAway + "</td></tr>");

index++;

}, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);

});

// // get the trains in a array
// database.ref().once("value", function(dataSnapshot){
//     var trainIndex = 0;


//       dataSnapshot.forEach(
//           function(childSnapshot) {
//                   trains[trainIndex++] = childSnapshot.key();
//           }
//       );
// });

// console.log(trains);






// database.ref().on("child_added", function(childSnapshot){
//     // log everything that is coiming out of snapshot
//     var name = childSnapshot.val().name;
//     var destination = childSnapshot.val().destination;
//     var firstTime = childSnapshot.val().firstTime;
//     var frequency = childSnapshot.val().frequency;


//     // display from the database
//     $("#trainList").append("<tr class='newTrainRow'><td class='name'>" + name + "</td>" +
//                          "<td class='newTrain'>" + destination + "</td>" +
//                          "<td class='newTrain'>" + firstTime + "</td>" +
//                          "<td class='newTrain'>" + frequency + "</td></tr>"); 

//   //  handle the errors.
// }, function(errorObject) {
//     console.log("Error handled" + errorObject.code);
// });