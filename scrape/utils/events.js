const rpOptions = require("./html");
const rp = require("request-promise");
const moment = require("moment-timezone");
const config = require("../config");

async function parseEventPages(events) {
  // venueURLs is a list of strings
  return Promise.all(
    (eventsMap = events.map(async event => await parseEventPage(event)))
  );
}

async function parseEventPage(event) {
  // because we're updating the whole event, we need all the info
  // so we can return it all.

  const eventPageUrl = config.eventPage.getUrl(event);

  const eventOptions = rpOptions(eventPageUrl);

  return rp(eventOptions)
    .then(async $ => {
      try {
        let newData = {};
        config.eventPage.fields.forEach(field => {
          if (field.get($)) {
            newData[field.name] = field.get($);
          }
        });

        return {
          ...event,
          ...newData,
          scraped: true
        };
      } catch (err) {
        // if there's a cheerio error, we just return the event with scraped = true so
        // it doesn't get scraped again. could try to be more resilient? keep the data that we can find?
        return {
          ...event,
          scraped: true
        };
      }
    })
    .catch(function(err) {
      // API call failed...
      console.log(err);
      return {
        ...event,
        scraped: true
      };
    });
}

// function get individual event info
function parseEvent($eventDiv) {
  // event needs to be the wrapper JQuery element
  // return a dict with: title, venueId, genre, date, region, price, infolink
  let eventObj = {}

  config.datePage.fields.forEach(field => {
    if (field.get($eventDiv)) {
      eventObj[field.name] = field.get($eventDiv)
    }
  })

  return eventObj
}

// function to get events HTML for date
async function getEvents(date=new Date()) {
  // date is optional. if not supplied, it will get today's gigs
  const dateURL = config.datePage.getUrl(date);

  let events = [];

  return rp(rpOptions(dateURL)).then(function($) {
    const eventDivs = $(config.datePage.eventSelector);
    eventDivs.each(function(i, event) {
      events[i] = parseEvent($(event));
    });
    return events;
  });
}

async function dayEvents(dates) {
  return Promise.all(dates.map(async date => await getEvents(date))).then(
    arraysOfEvents => {
      // flatten array of arrays into one array of events.
      return arraysOfEvents.reduce((acc, val) => acc.concat(val));
    }
  );
}

module.exports = { dayEvents, parseEventPages, parseEventPage, getEvents };
