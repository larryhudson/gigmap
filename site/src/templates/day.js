import React from "react"
import { Link, graphql } from 'gatsby'
import Layout from "../components/layout"
import SEO from "../components/seo"
import MainMap from "../components/MainMap"
import {getGenreName, genreColour} from "../consts/genres"
import styled from 'styled-components'
import { space } from 'styled-system'


const GenreHeading = styled.h3`
background: ${props => props.bg ? props.bg : 'lightgray'};
${space}
`

const EventCard = styled(Link)`
  background: ${props => props.bg ? props.bg : 'lightgray'};
  list-style-type: none;
  flex-basis: calc(50% - 5px);
  font-size: 90%;
  padding: 5px;
  color: black;
  margin-bottom: 10px;
  text-decoration: none;

@media (min-width: 480px) {
  flex-basis: calc(33.33% - 5px);
  padding: 10px;
  font-size: 100%;
}

@media (min-width: 768px) {
  flex-basis: calc(25% - 5px);
}
`

const CardList = styled.div`
display: flex;
flex-direction: row;
flex-wrap: wrap;
justify-content: space-between;
`

const EventTitle = styled.h4`
margin-bottom: 0.5em;
line-height: 1.5;
font-size: 90%;

@media (min-width: 480px) {
  font-size: 100%;
}
`

const EventVenue = styled.span`
`

const DayPage = ({ data, pageContext }) => {
  // const events = data.allEvents.edges;
  const date = data.allEvents.edges[0].node.date;
  const genres = data.eventsByGenre.group;
  const nextDate = pageContext.next;
  const prevDate = pageContext.prev;
  // const MELB_CENTER = [-37.8124, 144.9623];
  return (
  <Layout>
    <SEO title={date} keywords={[`music`, `melbourne`]} />
    <h1>Gigs on {date}</h1>
    {prevDate && (
    <p>Previous: <Link to={"/day/" + prevDate.dateStr}>{prevDate.niceDate}</Link></p>
    )}
    {nextDate && (
      <p>Next: <Link to={"/day/" + nextDate.dateStr}>{nextDate.niceDate}</Link></p>
    )}
    <div style={{width: '100%', height: 'auto', marginBottom: '2em'}}>
    <MainMap genres={genres} />
    </div>
    <h2>{date}</h2>
    {/*<h3>Jump to genre</h3>
    {genres.map( genre => (
      <GenreHeading p={['2','3']} key={'jump-to-' + genre.fieldValue}
      bg={genreColour(genre.fieldValue, 0.1)}>
        <a href={"#" + genre.fieldValue}>
        {getGenreName(genre.fieldValue)} ({genre.totalCount})
        </a>
      </GenreHeading>
    ))}
  */}
    {genres.map( genre => (
      <div key={'genre-events-' + genre.fieldValue}>
      <GenreHeading p={['2','3']} id={genre.fieldValue} bg={genreColour(genre.fieldValue, 0.1)}>{getGenreName(genre.fieldValue)} ({genre.totalCount})</GenreHeading>
      <CardList>
      {genre.edges.map( ({node: event}) => {
        return <EventCard key={event.slug} to={event.slug} color='black' bg={genreColour(event.genre, 0.1)}>
        <EventTitle>{event.mainArtist ? event.mainArtist.name : event.title}</EventTitle>
        <EventVenue>{event.venue.name}</EventVenue><br />
        {event.startTime && event.startTime}<br />
        {event.price && (
          (event.price === '$0.00') ? 'Free' : event.price
        )}
        </EventCard>
        })}
      </CardList>
      </div>
      ))}
  </Layout>
)}

export default DayPage

export const pageQuery = graphql`  
  query($date: String!)  {
  eventsByGenre: allEventsJson(filter: {date: {eq: $date}}) {
    group(field: genre) {
      fieldValue
      totalCount
      edges {
        node {
          slug
          title
          genre
          mainArtist {
            name
          }
          startTime
          supports {
            name
          }
          date(formatString: "dddd DD MMMM")
          price
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
  allEvents: allEventsJson(filter: {date: {eq: $date}}) {
  totalCount
  edges {
      node {
        slug
        title
        genre
        date(formatString: "dddd DD MMMM")
        price
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
