import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"

export default ({ data }) => {

  let event;
  let venue;

  if (data.eventsJson) {
    event = data.eventsJson
  } else {
    return (
      <Layout>
        <div>
        <h1>Event not found</h1>
        <p><Link to="/">Go home</Link></p>
        </div>
      </Layout>
      )
  }

  if (data.venuesJson) {
    venue = data.venuesJson
  }
  else {
    return (
      <Layout>
        <div>
        <h1>Venue not found</h1>
        <p>Couldn't find the venue for this gig: {event.slug}</p>
        <p><Link to="/">Go home</Link></p>
        </div>
      </Layout>
      )
  }
  
  return (
    <Layout>
      <div>
        <h1>{event.title}</h1>
        <p>Venue: {venue.name}</p>
        <p>Address: {venue.address}</p>
        <p>VenueURL: {event.venueURL}</p>
        <p><a href={event.infoLink}>More info at Beat's website</a></p>
        {venue.website && <p><a href={venue.website}>{venue.name} website</a></p>}
      </div>
    </Layout>
  )
}

export const query = graphql`
query($slug: String!, $venueURL: String!) {
    eventsJson(slug: { eq: $slug } ) {
      title
      venueName
      infoLink
      venueURL
    }
    venuesJson(venueURL: { eq: $venueURL } ) {
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