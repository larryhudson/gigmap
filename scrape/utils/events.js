const rpOptions = require("./html")
const rp = require('request-promise')
const moment = require('moment-timezone')


async function parseEventPages(events) {
	// venueURLs is a list of strings
	return Promise.all(
		eventsMap = events.map(
			async event => await parseEventPage(event)
			)
		)
}

async function parseEventPage(event) {
	// because we're updating the whole event, we need all the info
	// so we can return it all.
	// html is the html of the venue page

	const eventOptions = rpOptions('http://www.beat.com.au/' + event.slug);

	return rp(eventOptions).then(async ($) => {
		// need to get: start time, artists and supports, ticket / info link.
		const startTime = $('.gigguide_node-summary-detail .date-display-single').eq(0).text().split(' @ ')[1];
		// artists:
		const mainArtistTag = $('.artist .gigguide_node-summary-detail a').eq(0)
		const mainArtist = {name: mainArtistTag.text(),
							slug: mainArtistTag.attr('href').replace('/category/gig-artist/', '')}

		// support artists: 
		const supportLabel = $('h5.label-inline.gigguide_gigdetail-field-label:contains("Supports:")').eq(0)
		const afterSupports = $('h5.label-inline.gigguide_gigdetail-field-label')

		const supportTags = supportLabel.nextUntil(afterSupports)
		let supports = undefined;
		const supportsMap = supportTags.map((index, tag) => {
			const aTag = $(tag).find('a')
			const name = aTag.text()
			const slug = aTag.attr('href').replace('/category/gig-support/', '')
			return {name, slug}
		}).get()

		if (supportsMap.length > 0) {
			supports = supportsMap
		}

		// info link:
		const infoLinkTag = $('.gigguide_node-summary-detail.buy-tickets-button a').eq(0)
		const infoLink = {text: infoLinkTag.text(),
						  href: infoLinkTag.attr('href')}
		const scraped = true
		return {
			...event,
			startTime,
			mainArtist,
			supports,
			infoLink,
			scraped,
			}
		})
	   .catch(function (err) {
	    // API call failed...
	    	console.log(err)
	        return event;
		});
}

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
		beatLink: ('http://www.beat.com.au' + $(event).find('h3 a').attr('href'))
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
		dateString = date
	}
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

module.exports = {dayEvents, parseEventPages, parseEventPage}