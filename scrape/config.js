const moment = require("moment-timezone");

const config = {
  name: "Melbourne",
  centreCoords: [-37.8124, 144.9623],
  timezone: "Australia/Melbourne",
  rootURL: "http://www.beat.com.au",
  datePage: {
    format: "DD-MM-YYYY",
    prefix: "/gig-guide/",
    getUrl: date =>
      config.rootURL +
      config.datePage.prefix +
      moment.tz(date, config.timezone).format(config.datePage.format),
    eventSelector: ".archive_node-summary-wrapper",
    fields: [
      {
        name: "title",
        get: $eventDiv => $eventDiv.find("h3").text()
      },
      {
        name: "venueURL",
        get: $eventDiv =>
          config.rootURL +
          $eventDiv
            .find("h5")
            .eq(1)
            .find("a")
            .attr("href")
      },
      {
        name: "venueName",
        get: $eventDiv =>
          $eventDiv
            .find("h5")
            .eq(1)
            .text()
      },
      {
        name: "genre",
        get: $eventDiv =>
          $eventDiv
            .attr("class")
            .split(" ")
            .pop()
      },
      {
        name: "date",
        get: $eventDiv => 
          moment.tz(
            $eventDiv.find(".sidebar_gig-date.day").text() +
              " " +
              $eventDiv.find(".sidebar_gig-date.month").text() +
              " 2019",
            "DD MMM YYYY",
            config.timezone
          )
      },
      {
        name: "region",
        get: $eventDiv =>
          $eventDiv
            .find("h5")
            .eq(2)
            .text()
      },
      {
        name: "price",
        get: $eventDiv =>
          $eventDiv
            .find("h5")
            .eq(3)
            .text()
      },
      { name: "slug", get: $eventDiv => $eventDiv.find("h3 a").attr("href") }
    ]
  },
  eventPage: {
    getUrl: event => config.rootURL + event.slug,
    fields: [
      {
        name: "startTime",
        get: $ =>
          $(".gigguide_node-summary-detail .date-display-single")
            .eq(0)
            .text()
            .split(" @ ")[1]
      },
      {
        name: "mainArtist",
        get: $ => {
          let mainArtistTag = $(".artist .gigguide_node-summary-detail a").eq(
            0
          );
          return {
            name: mainArtistTag.text(),
            slug: mainArtistTag
              .attr("href")
              .replace("/category/gig-artist/", "")
          };
        }
      },
      {
        name: "supports",
        get: $ => {
          const supportLabel = $(
            'h5.label-inline.gigguide_gigdetail-field-label:contains("Supports:")'
          ).eq(0);
          const afterSupports = $(
            "h5.label-inline.gigguide_gigdetail-field-label"
          );
          const supportTags = supportLabel.nextUntil(afterSupports);
          if (supportTags.length > 0) {
            return supportTags
              .map((index, tag) => {
                const aTag = $(tag).find("a");
                const name = aTag.text();
                const slug = aTag
                  .attr("href")
                  .replace("/category/gig-support/", "");
                return { name, slug };
              })
              .get();
          }
        }
      },
      {
        name: "infoLink",
        get: $ => {
          const infoLinkTag = $(
            ".gigguide_node-summary-detail.buy-tickets-button a"
          ).eq(0);
          if (infoLinkTag.length > 0) {
            return {
              text: infoLinkTag.text(),
              href: infoLinkTag.attr("href")
            };
          }
        }
      }
    ]
  },
  venuePage: {
    fields: [
      {
        name: "name",
        get: $ =>
          $("h1.article_title")
            .eq(0)
            .text()
      },
      {
        name: "address",
        get: $ =>
          $(".gigguide_node-summary-detail")
            .eq(0)
            .text()
      },
      {
        name: "website",
        get: $ =>
          $(".gigguide_gigdetail-details a")
            .eq(0)
            .attr("href")
      }
    ]
  },
  genres: [
    {
      id: "jazz-soul-funk-latin-world-music",
      name: "Jazz, Soul, Funk, Latin & World Music",
      colour: "red"
    },
    { id: "comedy", name: "Comedy", colour: "blue" },
    {
      id: "arts-theatre-burlesque-markets",
      name: "Arts, Theatre, Burlesque & Markets",
      colour: "black"
    },
    { id: "hip-hop-r-b", name: "Hip Hop & R&B", colour: "fuchsia" },
    {
      id: "house-electro-trance-club-nights",
      name: "House, Electro, Trance & Club Nights",
      colour: "green"
    },
    {
      id: "indie-rock-pop-metal-punk-covers",
      name: "Indie, Rock, Pop, Metal, Punk & Covers",
      colour: "indigo"
    },
    {
      id: "acoustic-country-blues-folk",
      name: "Acoustic, Country, Blues & Folk",
      colour: "orange"
    },
    { id: "trivia-gaming", name: "Trivia & Gaming", colour: "white" }
  ]
};

module.exports = config;
