import React from "react"
import { Link, graphql } from 'gatsby'

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"
import GoogleMap from "../components/GoogleMap"
import Marker from "../components/Marker"

const IndexPage = ({ data }) => {
  const events = data.allEventsJson.edges;
  const date = data.allEventsJson.edges[0].node.date;
  const venues = events.map(({node: event}) => {
    return event.venue
  })
  const mapVenues = venues.filter(venue => venue.coords)
  const MELB_CENTER = [-37.8124, 144.9623];
  return (
  <Layout>
    <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
    <h1>Gigs on {date}</h1>
    <p>The map below doesn't work yet.</p>
    <p>But you can click on the links in the list below the map.</p>
    <div style={{width: '100%', height: '600px'}}>
    <GoogleMap
      defaultZoom={12}
      defaultCenter={MELB_CENTER}
      yesIWantToUseGoogleMapApiInternals
    >
    {mapVenues.map( venue => (
      <Marker
                key={venue.venueURL}
                text={venue.name}
                lat={venue.coords.lat}
                lng={venue.coords.lng}
                venueURL={venue.venueURL}
      />  
      ))}
    </GoogleMap>
    </div>
    <h2>Gigs on today</h2>
    <ul>
    {events.map( ({node: event}) => (
      <li key={event.id}><Link to={event.slug}>{event.title} at {event.venue.name}</Link></li>
      ))}
    </ul>
  </Layout>
)}

export default IndexPage

export const pageQuery = graphql`  
  query($date: String!)  {
  allEventsJson(filter: {date: {eq: $date}}) {
    edges {
      node {
        slug
        title
        date(formatString: "DD MMMM")
        venue {
          name
          venueURL
          address
          coords {
            lat
            lng
          }
        }
        
      }
    }
  }
}
`
