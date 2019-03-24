import React, { Component, Fragment } from 'react';
import isEmpty from 'lodash.isempty';
import { StaticQuery, graphql } from "gatsby"

// components:
import Marker from '../components/Marker';

// examples:
import GoogleMap from '../components/GoogleMap';

const MELB_CENTER = [-37.8124, 144.9623];

// Return map bounds based on list of places

// Re-center map when resizing the window

// Fit map to its bounds after the api is loaded

class TestMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showingGenres: [],
    };

    this.handleInputChange = this.handleInputChange.bind(this);

  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const genreId = target.name;

    if (value === true) {
    	this.setState(previousState => ({
    	showingGenres: [...previousState.showingGenres, genreId]
		}));
    } else {
    	this.setState(previousState => {
    	const newGenres = previousState.showingGenres.filter(genre => !(genre === genreId))
    	return {
    	showingGenres: newGenres
		}});
    }
  }

  render() {
    const { showingGenres } = this.state;
    const { genres } = this.props;
    return (
      <Fragment>
      <span>Showing genres:</span>
      <ul>
      {showingGenres.map(genre => {
      	return <li>{genre}</li>
      })}
      </ul>
        {genres.map(genre => {
          let genreId = genre.fieldValue;
          let isShowing = (this.state.showingGenres.includes(genreId))
          return (<div>
          <label>
          <input
            name={genreId}
            type="checkbox"
            checked={isShowing}
            onChange={this.handleInputChange} />
          {genre.fieldValue}
          </label>
          </div>)
          })}
      </Fragment>
    );
  }
}

export default TestMap;