$( document ).ready(function() {

var config = {
    apiKey: "AIzaSyBOJAvRGnPhNcEiyHq4jVavt1mDC_Rcd0w",
    authDomain: "train-schedule-b5ded.firebaseapp.com",
    databaseURL: "https://train-schedule-b5ded.firebaseio.com",
    projectId: "train-schedule-b5ded",
    storageBucket: "train-schedule-b5ded.appspot.com",
    messagingSenderId: "474493541741"
  };
  firebase.initializeApp(config);

var database=firebase.database();

var d = new Date();
var timzoneOffset = d.getTimezoneOffset();
var currentTime = Date.now();
var currentTimeInMin = Math.floor((currentTime-timzoneOffset*60*1000)%(1000*60*60*24)/(1000*60));
//obtain current time in Min. Start from 00:00

console.log(currentTimeInMin);

var formatTimeToMin = function (time) {
	var hour=Number(time[0]+time[1]);
	var min=Number(time[3]+time[4]);
	if (hour==NaN||hour>23|| min ==NaN ||min>59 || time[2]!=":" || time.length!=5) {
		alert("Please follow the time format hh:mm (military time) for First Train Time");
		return false;
	}
	else {
		return Number(hour*60+min);
	}
}

var minToFormatTime = function (time) {
	var hour = Math.floor(time/60)%24;
	var min = time%60;
	var amOrPm;
	var result='';
	if (hour <12) {
		amOrPm="AM";
	}
	else if (hour ==12)
	{
		amOrPm="PM";
	}
	else {
		amOrPm="PM";
		hour=hour-12;
	}

	hour = (hour < 10 ? '0' : '')+ hour;
	min = (min < 10 ? '0' : '')+ min;
	result=hour+':'+min +amOrPm;
	return result;
}

var showTrains = function (snap){}

/*var x = 800;
console.log(minToFormatTime(x));
*/


//console.log(currentTime);

$("#addTrain").on("click", function (event){
	event.preventDefault();
	var trainName=$("#trainName").val().trim();
	var destination= $("#destination").val().trim();
	var firstTrain= $("#firstTrain").val().trim();
	var frequency= $("#frequency").val().trim();

	if (frequency!='' && frequency.indexOf("e")==-1 && frequency.indexOf(".")==-1) {
		firstTrainTime = formatTimeToMin(firstTrain);
		if (firstTrainTime) {
			database.ref().push({
			trainName: trainName,
			destination: destination,
			frequency: frequency,
			firstTrainTime: firstTrainTime
			});
			$("#trainName").val('');
			$("#destination").val('');
			$("#firstTrain").val('');
			$("#frequency").val('');
		}
	}
	else {
		alert ("Please enter an integer for Frequency");
	}
});

database.ref().on("value", function(snap){
	$("#displayTrainInfo").empty();
	var sv=snap.val();
	for (var key in sv) {
		var trainInfo = $("<tr>");
		var trainNameTd = $("<td>");
		var destinationTd = $("<td>");
		var frequencyTd = $("<td>");
		var nextArrivalFormatTd = $("<td>");
		var minAwayTd = $("<td>");

		trainInfo.append(trainNameTd);
		trainInfo.append(destinationTd);
		trainInfo.append(frequencyTd);
		trainInfo.append(nextArrivalFormatTd);
		trainInfo.append(minAwayTd);

		$("#displayTrainInfo").append(trainInfo);
		var thisObject=sv[key];
		var firstTrainTime = thisObject.firstTrainTime;
		var frequency = thisObject.frequency;
		var nextArrival;
		var nextArrivalFormat;
		var minAway;
		var i=0;
		while (firstTrainTime + frequency * i < currentTimeInMin) {
			i++;
		}
		nextArrival = firstTrainTime + frequency * i;
		minAway= nextArrival - currentTimeInMin;
		nextArrivalFormat = minToFormatTime (nextArrival);
		trainNameTd.html(thisObject.trainName);
		destinationTd.html(thisObject.destination);
		frequencyTd.html(thisObject.frequency);
		nextArrivalFormatTd.html(nextArrivalFormat);
		minAwayTd.html(minAway);
	}
});
    console.log( "ready!" );
});
