import React from "react"
import { graphql } from 'gatsby'
import Layout from "../components/layout"
import SEO from "../components/seo"
import MainMap from "../components/MainMap"
import { getGenreName, genreColour } from "../consts/genres"
import styled from 'styled-components'
import { space } from 'styled-system'
import GenreEventsList from '../components/GenreEventsList'
import DayNav from '../components/DayNav'
import moment from 'moment-timezone'
import Header from '../components/header'
import{CloseBalloon} from '../components/Balloon'

function sortById(a, b) {
  if (a.fieldValue < b.fieldValue)
    return -1;
  if (a.fieldValue > b.fieldValue)
    return 1;
  return 0;
}

const MyContainer = styled.div`
display: flex;
flex-flow: column;
height: 100%;
`

const Top = styled.div`
flex: 0 1 auto;
`
// The above is shorthand for:
  // flex-grow: 0,
  // flex-shrink: 1,
  // flex-basis: auto

const Main = styled.div`
flex: 1 1 auto;
`

const Foot = styled.div`
display: flex;
justify-content: space-evenly;
position: fixed;
bottom: 0;
background: white;
width: 100%;
padding: 5px;
`

const CheckboxList = styled.div`
display: flex;
flex-direction: row;
flex-wrap: wrap;
justify-content: space-between;
`

const OptionsWindowDiv = styled.div`
width: 100%;
position: fixed;
bottom: 0;
padding: 20px 10px 30px;
height: auto;
background: white;
z-index: 2;
`

const OptionButton = styled.button`
outline: 1px solid black;
padding: 5px 10px;
&:active {
  background: lightgray;
}
`

const OptionsWindow = ({children}) => {
  return <OptionsWindowDiv>
    {children}
  </OptionsWindowDiv>
}

const CheckboxContainer = styled.div`
background: ${props => props.ticked ? props.genreColour : '#ededed'};
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
    // if (props.location.state) {
    //   this.state = {
    //     showingGenres: this.props.location.state.showingGenres
    //   }
    // } else {
    //   this.state = {
    //     showingGenres: this.props.data.eventsByGenre.group
    //   }
    // }

    this.state = {
      showingGenres: this.props.data.eventsByGenre.group,
      showingOptions: null,
      view: 'map'
    }

    this.handleGenreChange = this.handleGenreChange.bind(this);
    this.toggleOptions =this.toggleOptions.bind(this);
    this.changeView = this.changeView.bind(this);
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
        }
      });
    }
  }

  toggleOptions() {
    const {showingOptions} = this.state
    if (showingOptions === null) {
      this.setState({showingOptions: 'genres'})
    } else {
      this.setState({showingOptions: null})
    } 
  }

  changeView() {
    const {view} = this.state
    if (view === 'map') {
      this.setState({view: 'list'})
    } else {
      this.setState({view: 'map'})
    }
  }

  render() {
    const { data, pageContext } = this.props;
    const genres = data.eventsByGenre.group;
    const { showingGenres, showingOptions, view } = this.state
    if (showingGenres) {
      showingGenres.sort(sortById)
    }
    const { date } = pageContext
    const showFilters = (showingOptions === 'genres')
    const showingMap = (view === 'map')
    const showingList = (view === 'list')
    // const events = data.allEvents.edges;
    // const MELB_CENTER = [-37.8124, 144.9623];
    return (
      <Layout>
        <MyContainer>
        <Top>
        <Header title={moment(date).format('dddd DD MMMM')}></Header>
        <SEO title={moment(date).format('dddd DD MMMM')} keywords={[`music`, `melbourne`]} />
        <DayNav current={date} />
        </Top>
        <Main>
        <MainMap genres={showingGenres} showing={showingMap} />
        {showingList && <GenreEventsList genres={showingGenres} date={date} />}
        </Main>
        <Foot>
        <OptionButton onClick={this.toggleOptions}>Filter by genre</OptionButton>
        <OptionButton onClick={this.changeView}>Change view</OptionButton>
        </Foot>
        {showFilters && (<OptionsWindow>
        <CloseBalloon onClick={this.toggleOptions}>
          X
        </CloseBalloon>
          <h3 style={{ marginBottom: '0.5em' }}>Filter by genre</h3>
          <CheckboxList>
            {genres.map(genre => {
              let genreId = genre.fieldValue;
              let isShowing = (showingGenres ? showingGenres.includes(genre) : true)
              return (<CheckboxContainer key={'checkbox-' + date + genreId} ticked={isShowing} genreColour={genreColour(genre.fieldValue, 0.25)} p={['1', '2']}>
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
        </OptionsWindow>)}
        </MyContainer>

        {/* <GenreEventsList genres={showingGenres} date={date} /> */}
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
    )
  }

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
