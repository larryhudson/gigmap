import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import { Link } from "gatsby"
import GoogleMap from "../components/GoogleMap"
import Marker from "../components/Marker"

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
      <div>
        <h1>Gigs at {venue.name}</h1>
        {events.map( ({node: event}) => (
        <li key={event.id}><Link to={'/' + event.slug}>{event.title} on {event.date}</Link></li>
        ))}
        <div style={{width: '600px', height: '80%'}}>
        <GoogleMap
          defaultZoom={12}
          defaultCenter={venue.coords}
          yesIWantToUseGoogleMapApiInternals
        >
          <Marker
                    key={venue.id}
                    text={venue.name}
                    lat={venue.coords.lat}
                    lng={venue.coords.lng}
                    venueId={venue.id}
          />  
        </GoogleMap>
        </div>
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