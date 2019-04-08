import PropTypes from "prop-types"
import React from "react"
import {getGenreName, genreColour} from "../consts/genres"
import styled from 'styled-components'
import { space } from 'styled-system'
import { Link } from 'gatsby'

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

const GenreHeading = styled.h3`
background: ${props => props.bg ? props.bg : 'lightgray'};
margin-bottom: 10px;
${space}
`

class GenreEventsList extends React.Component {
	
  render() {

	  const {genres, date} = this.props
	  return (
	  	<div style={{marginTop: "10px"}}>
	      {genres.map( genre => (
	      <div key={'genre-events-' + date + genre.fieldValue}>
	      <GenreHeading p={['2','3']} id={genre.fieldValue} bg={genreColour(genre.fieldValue, 0.25)}>{getGenreName(genre.fieldValue)} ({genre.totalCount})</GenreHeading>
	      <CardList>
	      {genre.edges.map( ({node: event}) => {
		        return <EventCard key={event.slug} to={event.slug} color='black' bg={genreColour(event.genre, 0.25)}>
		        <EventTitle>{event.title}</EventTitle>
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
	  </div>
	  )
	}
}

GenreEventsList.propTypes = {
  genres: PropTypes.array,
  date: PropTypes.string
}

GenreEventsList.defaultProps = {
  genres: [],
  date: '',
}

export default GenreEventsList
