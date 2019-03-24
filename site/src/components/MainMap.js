import React, { Component, Fragment } from 'react';
import isEmpty from 'lodash.isempty';

// components:
import Marker from '../components/Marker';
import {genreColour, getGenreName} from '../consts/genres';

// examples:
import GoogleMap from '../components/GoogleMap';
import styled from 'styled-components';
import {space} from 'styled-system';

const CheckboxContainer = styled.div`
background: ${props => props.bg ? props.bg : 'lightgray'};

input {
  margin-right: 0.75em;
}

label {
  display: block;
}
${space}
`

const MELB_CENTER = [-37.8124, 144.9623];

// Return map bounds based on list of places
const getMapBounds = (map, maps, events) => {
  const bounds = new maps.LatLngBounds();

  events.forEach((event) => {
    bounds.extend(new maps.LatLng(
      event.node.venue.coords.lat,
      event.node.venue.coords.lng,
    ));
  });
  return bounds;
};

// Re-center map when resizing the window
const bindResizeListener = (map, maps, bounds) => {
  maps.event.addDomListenerOnce(map, 'idle', () => {
    maps.event.addDomListener(window, 'resize', () => {
      map.fitBounds(bounds);
    });
  });
};

// Fit map to its bounds after the api is loaded
const apiIsLoaded = (map, maps, places) => {
  // Get bounds by our places
  const bounds = getMapBounds(map, maps, places);
  // Fit map to bounds
  map.fitBounds(bounds);
  // Bind the resize listener
  bindResizeListener(map, maps, bounds);
};

class MainMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showingGenreIds: this.props.genres.map(genre => genre.fieldValue),
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const genreId = target.name;

    if (value === true) {
      this.setState(previousState => ({
      showingGenreIds: [...previousState.showingGenreIds, genreId]
    }));
    } else {
      this.setState(previousState => {
      const newGenres = previousState.showingGenreIds.filter(genre => !(genre === genreId))
      return {
      showingGenreIds: newGenres
    }});
    }
  }

  render() {
    const { showingGenreIds } = this.state;
    const { genres } = this.props;
    let showingEvents = []
    const showingGenres = genres.filter(genre => showingGenreIds.includes(genre.fieldValue))
    showingGenres.forEach(genre => {
      genre.edges.forEach(event => {
        showingEvents.push(event)
      })
    })
    return (
      <Fragment>
        {!isEmpty(showingGenres) && (
          <GoogleMap
            defaultZoom={10}
            defaultCenter={MELB_CENTER}
            onGoogleApiLoaded={({ map, maps }) => apiIsLoaded(map, maps, showingEvents)}
            yesIWantToUseGoogleMapApiInternals
          >
            {showingEvents.map( ({node: event}) => {
              return <Marker
              key={event.slug}
              text={event.venue.name}
              lat={event.venue.coords.lat}
              lng={event.venue.coords.lng}
              eventSlug={event.slug}
              bg={genreColour(event.genre)}
          />
          })}
          </GoogleMap>
        )}
        {genres.map(genre => {
          let genreId = genre.fieldValue;
          let isShowing = (this.state.showingGenreIds.includes(genreId))
          return (<CheckboxContainer key={'checkbox-' + genreId} bg={genreColour(genre.fieldValue, 0.25)} p={['1','2']}>
                  <label>
                  <input
                    name={genreId}
                    type="checkbox"
                    checked={isShowing}
                    onChange={this.handleInputChange} />
                  {getGenreName(genreId)}
                  </label>
                  </CheckboxContainer>
                )
          }
          )}

      </Fragment>
    );
  }
}

export default MainMap;