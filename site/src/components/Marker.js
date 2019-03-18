import React from 'react';
import {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {navigate} from "gatsby";

const Wrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 18px;
  height: 18px;
  background-color: #000;
  border: 2px solid #fff;
  border-radius: 100%;
  user-select: none;
  transform: translate(-50%, -50%);
  cursor: ${props => (props.onClick ? 'pointer' : 'default')};
  &:hover {
    z-index: 1;
  }
`;

class Marker extends Component {
  handleClick() {
    if (this.props.venueId) {
      navigate(this.props.venueId);
    }
    if (this.props.eventSlug) {
      navigate(this.props.eventSlug);
    }
  }
  render() {
    return <Wrapper
    alt={this.props.text}
    onClick={this.handleClick.bind(this)}
    />
  }
}

Marker.defaultProps = {
  onClick: null,
};

Marker.propTypes = {
  onClick: PropTypes.func,
  text: PropTypes.string.isRequired,
};

export default Marker;
