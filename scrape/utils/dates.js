const moment = require("moment-timezone")

function getDaysBetween(startDate, stopDate) {
    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate.isBefore(stopDate)) {
        dateArray.push( moment.tz(currentDate, "Australia/Melbourne") );
        currentDate.add(1, 'd')
    }
    return dateArray;
}

function getDaysFromToday(numDays) {
	const today = moment.tz("Australia/Melbourne");
	const endDate = today.clone().add(numDays, 'd');
	console.log("today: " + today.format('DD-MM-YYYY'))
	console.log(numDays + " days away: " + endDate.format('DD-MM-YYYY'));
	return getDaysBetween(today, endDate);
}

module.exports = getDaysFromToday