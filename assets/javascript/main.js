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

$(function(){
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


    //   initial value as a global var
    var currentTime = 0;
    var index       = 0;


    // // Time form validation with jQuery Mask plugin.
    // var firstTime = $("#FTT").mask("00:00"); 




    // show current time to display for user.
        var datetime = null;
        date = null;

        var update = function (){
            date = moment(new Date())
            datetime.html(date.format('dddd, MMMM Do YYYY, h:mm:ss a'));
        };

    
        datetime = $("#current-time")
        update();
        setInterval(update, 1000);



    //   capture button click
    $("#btnSubmit").on("click", function(){
        // don't refresh the page
        event.preventDefault();
            var name = $("#train-name").val().trim();
            var destination = $("#destination").val().trim();
            var firstTime = $("#FTT").val().trim();
            var frequency = $("#frequency").val().trim();

            
            // var nextArrivalUpdate = function(){
            //     date = moment(new Date())
            //     datetime.html(date.format('HH:mm a'));
            // }
        
        // handle the push
        database.ref().push({
            name: name,
            destination: destination,
            firstTime: firstTime,
            frequency: frequency,
            // minutesAway: minutesAway,
            // nextArrival: nextArrival,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
        // let the user know, train has been added
        alert("Your train successfully added!");

        // empty text input fort the next train
        $(".form-control").val("");
    });

    // display last 20 trains
    // database.ref().orderByChild("dateAdded").limitToLast(20).on("child_added", function(snapshot){
    database.ref().on("child_added", function(snapshot){
        
        // getting variable from local storage
        var firstTime = snapshot.val().firstTime;
        var frequency = snapshot.val().frequency;
        // first time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
        // difference between the times
        var diffTime = moment().diff(firstTimeConverted, "minutes");
        // time apart, remidner
        var tRemainder = diffTime % frequency;
        // minutes until train
        var minutesAway = frequency - tRemainder;

        // next train time:
        var nextArrival = moment().add(minutesAway, "minutes").format("hh:mm A");

        // change the html with data from database
        $("#trainList").append(
            "<tr><td>" + snapshot.val().name + "</td>" +
            "<td>" + snapshot.val().destination + "</td>" +
            "<td>" + frequency + "</td>" +
            "<td>" + nextArrival + "</td>" +
            "<td>" + minutesAway + "</td></tr>");

        index++;
        console.log("INDEX: " + index);

    }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);

    });

});
