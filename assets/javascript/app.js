//------------------------------------------------------------------------------------------------
// 1. Initialize Firebase
//------------------------------------------------------------------------------------------------

var config = {
  apiKey: 'AIzaSyA-NMXXGQpwnrGBxS44dWr7g-InPIFLRwE',
  authDomain: 'train-scheduler-ba046.firebaseapp.com',
  databaseURL: 'https://train-scheduler-ba046.firebaseio.com',
  projectId: 'train-scheduler-ba046',
  storageBucket: 'train-scheduler-ba046.appspot.com',
  messagingSenderId: '54390893018'
};

firebase.initializeApp(config);

var database = firebase.database();

//------------------------------------------------------------------------------------------------
// 2. Declaring global variables
//------------------------------------------------------------------------------------------------

var trainName = '';
var destination = '';
var firstTrain = '';
var frequency = '';
var nextArrival = '';
var minutesAway = '';

//------------------------------------------------------------------------------------------------
// 3. The next function give us a timer live that is appended to our page.
//------------------------------------------------------------------------------------------------

function timer() {
  var time = moment(moment()).format('HH:mm:ss a');
  $('#timer').text(time, 1000);
}
setInterval(timer);

//------------------------------------------------------------------------------------------------
// 4. This function (attached to on.click e) will grab input values & push them to our database.
//------------------------------------------------------------------------------------------------
$('#submit').on('click', function(event) {
  event.preventDefault();

  // 4.1 We start by assigning values to our initial variables.
  trainName = $('#train-name-input')
    .val()
    .trim();
  destination = $('#destination-input')
    .val()
    .trim();
  firstTrain = $('#first-train-time-input')
    .val()
    .trim();
  frequency = $('#frequency-input')
    .val()
    .trim();

  // 4.2 The next if statement will prevent populate empty values to our database
  if (
    $('#train-name-input').val().length > 0 &&
    $('#destination-input').val().length > 0 &&
    $('#first-train-time-input').val().length > 0 &&
    $('#frequency-input').val().length
  ) {
    // 4.3 Then, we create an object with the refered variables
    newTrain = {
      trainName: trainName,
      destination: destination,
      firstTrain: firstTrain,
      frequency: frequency
    };

    // 4.4 Next, we push the last object created to our database.
    database.ref().push(newTrain);

    // 4.5 We finish by clearing the value of our inputs
    $('#train-name-input').val('');
    $('#destination-input').val('');
    $('#first-train-time-input').val('');
    $('#frequency-input').val('');
  }
});

//------------------------------------------------------------------------------------------------
// 5. This function will grab elements from our database, and display them into our screen
//------------------------------------------------------------------------------------------------

database.ref().on(
  'child_added',
  function(snapshot) {
    // 5.1 First, we start by grabing the elements from our database and storing them in brand new variables
    var trainNameDT = snapshot.val().trainName;
    var destinationDT = snapshot.val().destination;
    var frequencyDT = snapshot.val().frequency;
    var firstTrain = snapshot.val().firstTrain;

    // 5.2 Next, we use the last created variables to get the remainder (in minutes) of our next arrival
    var firstTrainDT = moment(firstTrain, 'hh:mm').subtract(1, 'days');
    var diffTime = moment().diff(moment(firstTrainDT), 'minutes');
    var tRemainder = diffTime % frequencyDT;
    var tMinutesTillTrain = frequencyDT - tRemainder;

    // 5.3 Then, we use the next line of code to get the exact time in which our train will arrive
    var nextTrain = moment().add(tMinutesTillTrain, 'minutes');
    var nextArrival = moment(nextTrain).format('HH:mm');

    // 5.4 We create the next table data elements to hold on the last stored information
    var firstColumn = $('<td>').text(trainNameDT);
    var secondColumn = $('<td>').text(destinationDT);
    var thirdColumn = $('<td>').text(frequencyDT);
    var fourthColumn = $('<td>').text(nextArrival);
    var fithColumn = $('<td>').text(tMinutesTillTrain);
    var tr = $('<tr>');
    tr.append(firstColumn, secondColumn, thirdColumn, fourthColumn, fithColumn);

    //5.5 We finish by appending our last created elements to our assigned ID element.
    $('#table-body').append(tr);
  },
  function(errorObject) {
    console.log('Errors handled: ' + errorObject.code);
  }
);
