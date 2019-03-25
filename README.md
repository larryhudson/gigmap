# Gigmap
This is a Gatsby app that scrapes [Beat Magazine](https://www.beat.com.au/gig-guide/)'s weekly gig guide.

I've got it hosted at Netlify. [You can see it here](https://gigmap.netlify.com).

It rebuilds every hour.

To do:
- ~Get more info for each event. At the moment it only scrapes the day pages, but if I scrape each event page, it'll be able to get ticket links, artists and support artists and start times. But I can't ask Beat Mag for 500 events at a time, so it needs to be a bit more clever.~ Done. It scrapes 25 unscraped events on each build. This was a bit trickier than I thought it would be - it meant hosting the events.json and venues.json files in an Amazon S3 bucket and reading and writing to it on each build. But it seems to be working well now.
- Make the map easier to use. Instead of just linking to event pages, little info windows should overlay the map. Maybe just venue name and event name
- ~Should be able to filter what you want to see on the map, and have each category be colour coded.~ This is done now, and it means I've learned a lot about React state and props. The category filter controls what markers are on the map and what the events list shows below the filters. Still to do: different shapes for accessibility (people who can't differentiate between colours).
- ~The home page should have today's events. At the moment it just has a list of days and a map of all the venues that have an event this week. Solution: Get rid of pages/index.js template file and get first date's path to be index.~ This is done! Makes it a little more complicated to do next/prev links, but it's working for now.
- I'd also like to make the app more reusable and extendable. Eg: Declaring all the Beat Magazine-specific stuff in a constants file, then trying to replace that data with some aggregator site from Sydney. Should be an interesting experiment.
- Fix date parsing bug. MomentJS doesn't like the format that I'm giving to it, so it needs to be in ISO format or something. I think it's causing a bug on Firefox.
- Look into history / state management. At the moment if I have 3 genres ticked, and I click over to the next day, it selects all 8 categories. Likewise, if I have 3 ticked and look at an event, then come back, it has all the categories ticked.
- Fix title tag rendering - need to format date into nice string again.
