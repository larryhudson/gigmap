const rpOptions = require("./html")
const rp = require('request-promise')
const moment = require('moment-timezone')


// function get individual event info
function parseEvent($, event) {
	// event needs to be the wrapper JQuery element
	// return a dict with: title, venueId, genre, date, region, price, infolink
	let dateStr = $(event).find('.sidebar_gig-date.day').text() + ' ' + $(event).find('.sidebar_gig-date.month').text() + ' 2019';

	return {
		title: $(event).find('h3').text(),
		venueURL: 'http://www.beat.com.au' + $(event).find('h5').eq(1).find('a').attr('href'),
		venueName: $(event).find('h5').eq(1).text(),
		genre: $(event).attr('class').split(' ').pop(),
		date: moment.utc(dateStr, 'DD MMM YYYY'),
		region: $(event).find('h5').eq(2).text(),
		price: $(event).find('h5').eq(3).text(),
		slug: $(event).find('h3 a').attr('href'),
		infoLink: ('http://www.beat.com.au' + $(event).find('h3 a').attr('href'))
	}
}

// function to get events HTML for date
async function getEvents(date) {
	// date is optional. if not supplied, it will get today's gigs
	// if date is supplied, needs to be in YYYY-MM-DD string format
	let dateString = ''

	if (date === undefined) {
		dateString = ''
	} else {
		dateString = date.format('YYYY-MM-DD');
	};
	const dateURL = 'http://www.beat.com.au/gig-guide/' + dateString;

	let events = [];
	
	return rp(rpOptions(dateURL)).then(function($) {
		const eventDivs = $('.archive_node-summary-wrapper');
		eventDivs.each(function(i, event) {
			events[i] = parseEvent($, event)
		})
		return events
	})
}

async function dayEvents(dates) {
	return Promise.all(
		dates.map(
			async date => await getEvents(date)
			)
		).then(arraysOfEvents => {
	// flatten array of arrays into one array of events.
	return arraysOfEvents.reduce((acc, val) => acc.concat(val))
})
}

module.exports = dayEvents