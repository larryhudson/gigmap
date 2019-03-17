/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

const path = require(`path`)

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions
  return graphql(`
    {
      allEventsJson {
	    edges {
	      node {
	        slug
          venueURL
	      }
	    }
	  }
    allVenuesJson {
      edges {
        node {
          id
          venueURL
        }
      }
    }
    }
  `).then(result => {
    result.data.allEventsJson.edges.forEach(({ node }) => {
      createPage({
        path: node.slug,
        component: path.resolve(`./src/templates/event.js`),
        context: {
          // Data passed to context is available
          // in page queries as GraphQL variables.
          slug: node.slug,
          venueURL: node.venueURL
        },
      })
    })
    result.data.allVenuesJson.edges.forEach(({ node }) => {
      createPage({
        path: node.id,
        component: path.resolve(`./src/templates/venue.js`),
        context: {
          // Data passed to context is available
          // in page queries as GraphQL variables.
          id: node.id,
          venueURL: node.venueURL
        },
      })
    })
  })
}