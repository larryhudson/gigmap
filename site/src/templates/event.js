import React from "react"
import { graphql, Link } from "gatsby"
import Layout from "../components/layout"
import {getGenreName} from "../consts/genres"
import moment from "moment"
import SEO from "../components/seo"
import styled from 'styled-components'

const SupportList = styled.ul`
margin-left: 10px;
display: inline;
`

const Support = styled.li`
display: inline;
margin-right: 15px;
`


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

  const date = data.eventsJson.date;
  const dateStr = moment(date).format('DD-MM-YYYY')
  const niceDate = moment(date).format('dddd DD MMMM')
  const genreStr = getGenreName(event.genre)
  
  return (
    <Layout>
    <SEO title={event.title} keywords={[`music`, `melbourne`]} />
      <div>
        <h1>{event.title}</h1>
        <p>Venue: <Link to={'/' + venue.id}>{venue.name}</Link></p>
        <p>Date: <Link to={'/day/' + dateStr}>{niceDate}</Link></p>
        {event.startTime && <p>Time: {event.startTime}</p>}
        {event.price && <p>Price: {event.price}</p>}
        {event.mainArtist && <p>Artist: {event.mainArtist.name}</p>}
        {event.supports && (event.supports.length > 0) && <div>Supports: <SupportList>{event.supports.map(support => (<Support key={'support-'+support.name}>{support.name}</Support>))}</SupportList></div>}
        <p>Genre: {genreStr}</p>
        <p>Address: {venue.address}</p>
        {event.infoLink && (
          <p><a href={event.infoLink.href}>{event.infoLink.text}</a></p>
          )}
        
        {venue.website && <p><a href={venue.website}>{venue.name} website</a></p>}
      </div>
    </Layout>
  )
}

export const query = graphql`
query($slug: String!, $venueURL: String!) {
    eventsJson(slug: { eq: $slug } ) {
      title
      price
      date
      venueName
      infoLink {
        text
        href
      }
      venueURL
      genre
      startTime
      mainArtist {
        name
      }
      supports {
        name
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