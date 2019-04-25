module.exports = {
  siteMetadata: {
    title: `Gigmap`,
    description: `Find out what's happening in Melbourne this week. Music, comedy, theatre and more`,
    author: `@larryhudsondev`,
  },
  // mapping: {
  //   'EventsJson.venue': 'VenuesJson.venueURL',
  //   'VenuesJson.events': 'EventsJson.slug'
  // },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    `gatsby-transformer-json`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `./src/data`,
      }
    },
    {
    resolve: 'gatsby-plugin-buildtime-timezone',
    options: {
      tz: 'Australia/Melbourne',
      format: 'ddd, DD MMM YYYY hh:mm A',
    },
  },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.app/offline
    // 'gatsby-plugin-offline',
  ],
}
