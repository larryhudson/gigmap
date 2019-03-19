import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import { Link } from "gatsby"
import SEO from "../components/seo"

export default ({ data }) => {
  let venue;
  let events;
  if (data.venuesJson) {
    venue = data.venuesJson
  } else {
    return (
      <Layout>
        <div>
        <h1>Venue not found</h1>
        <p><Link to="/">Go home</Link></p>
        </div>
      </Layout>
      )
  }
  if (data.allEventsJson) {
    events = data.allEventsJson.edges
  } else {
    return (
      <Layout>
        <div>
        <h1>Gigs at {venue.name}</h1>
        <p>No events found.</p>
        </div>
      </Layout>
    )
  }
  return (
    <Layout>
    <SEO title={venue.name} keywords={[`music`, `melbourne`]} />
      <div>
        <h1>Gigs at {venue.name}</h1>
        <ul>
        {events.map( ({node: event}) => (
        <li key={event.id}><Link to={'/' + event.slug}>{event.title} on {event.date}</Link></li>
        ))}
        </ul>
        <p>Address: {venue.address}</p>
        {venue.website && <p><a href={venue.website}>{venue.name} website</a></p>}
      </div>
    </Layout>
  )
}

export const query = graphql`
query($venueURL: String!) {
    allEventsJson(filter: { venueURL: { eq: $venueURL } } ) {
      edges {
        node {
          title
          date(formatString: "DD MMMM")
          slug
        }
      }
    }
    venuesJson(venueURL: { eq: $venueURL } ) {
      id
      name
      address
      coords {
        lat
        lng
      }
      website
    }
  }
`