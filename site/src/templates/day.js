import React from "react"
import { Link, graphql } from 'gatsby'
import Layout from "../components/layout"
import SEO from "../components/seo"
import MainMap from "../components/MainMap"
import {getGenreName, genreColour} from "../consts/genres"
import styled from 'styled-components'
import { space } from 'styled-system'
import GenreEventsList from '../components/GenreEventsList'

function sortById(a,b) {
  if (a.fieldValue < b.fieldValue)
    return -1;
  if (a.fieldValue > b.fieldValue)
    return 1;
  return 0;
}

const CheckboxList = styled.div`
display: flex;
flex-direction: row;
flex-wrap: wrap;
justify-content: space-between;
`

const CheckboxContainer = styled.div`
background: ${props => props.bg ? props.bg : 'lightgray'};
flex-basis: calc(50% - 5px);
margin-bottom: 10px;
padding-top:10px;

input {
  margin-top: 0.75em;
  display: block;
  margin: auto;
}

label {
  display: block;
}
${space}
`

class DayPage extends React.Component {

  constructor(props) {
    super(props)
    if (props.location.state) {
      this.state = {
        showingGenres: this.props.location.state.showingGenres
      }
    } else {
      this.state = {
        showingGenres: this.props.data.eventsByGenre.group
      }
    }

    this.handleGenreChange = this.handleGenreChange.bind(this);
  }

  handleGenreChange(event) {
    const target = event.target;
    const value = target.checked;
    const thisGenreId = target.name;
    const thisGenre = this.props.data.eventsByGenre.group.find(genre => genre.fieldValue === thisGenreId)

    if (value === true) {
      // add genre to state array
      this.setState(previousState => ({
      showingGenres: [...previousState.showingGenres, thisGenre]
    }));
    } else {
      // remove genre from state array
      this.setState(previousState => {
      const otherGenres = previousState.showingGenres.filter(genre => !(genre === thisGenre))
      return {
      showingGenres: otherGenres
    }});
    }
  }

  render() {

  const {data, pageContext} = this.props
  const date = data.allEvents.edges[0].node.date;
  const genres = data.eventsByGenre.group;
  const {showingGenres} = this.state
  if (showingGenres) {
    showingGenres.sort(sortById)
  }
  const nextDate = pageContext.next;
  const prevDate = pageContext.prev;
  // const events = data.allEvents.edges;
  // const MELB_CENTER = [-37.8124, 144.9623];
  return (
  <Layout>
    <SEO title={date} keywords={[`music`, `melbourne`]} />
    <h1>Gigs on {date}</h1>
    {prevDate && (
    <p>Previous: <Link to={"/day/" + prevDate.dateStr} state={{showingGenres: this.state.showingGenres}}>{prevDate.niceDate}</Link></p>
    )}
    {nextDate && (
      <p>Next: <Link to={"/day/" + nextDate.dateStr} state={{showingGenres: this.state.showingGenres}}>{nextDate.niceDate}</Link></p>
    )}
    <div style={{width: '100%', height: 'auto', marginBottom: '2em'}}>
    <MainMap genres={showingGenres} />
    </div>
    <h3 style={{marginBottom: '10px'}}>Filter by genre</h3>
    <CheckboxList>
    {genres.map(genre => {
      let genreId = genre.fieldValue;
      let isShowing = (showingGenres ? showingGenres.includes(genre) : true)
      return (<CheckboxContainer key={'checkbox-' + date + genreId} bg={genreColour(genre.fieldValue, 0.25)} p={['1','2']}>
              <label>
              <input
                name={genreId}
                type="checkbox"
                checked={isShowing}
                onChange={this.handleGenreChange} />
              {getGenreName(genreId)}
              </label>
              </CheckboxContainer>
            )
      }
      )}
    </CheckboxList>
    <GenreEventsList genres={showingGenres} date={date} />
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
    </Layout>
  )}

  }

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
