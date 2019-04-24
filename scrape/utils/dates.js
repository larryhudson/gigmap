const moment = require("moment-timezone")
const config = require("../config")

function getDaysBetween(startDate, stopDate) {
    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate.isBefore(stopDate)) {
        dateArray.push( moment.tz(currentDate, config.timezone) );
        currentDate.add(1, 'd')
    }
    return dateArray;
}

function getDaysFromToday(numDays) {
	const today = moment.tz(config.timezone).startOf('day');
	const endDate = today.clone().add(numDays, 'd');
	console.log("today: " + today.format(config.datePage.format))
	console.log(numDays + " days away: " + endDate.format(config.datePage.format));
	return getDaysBetween(today, endDate);
}

module.exports = getDaysFromToday