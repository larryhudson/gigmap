import React from 'react';
import {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  border: 2px solid #000;
  background-color: ${props => props.isFavourite ? "gold" : props.bg};
  border-radius: 100%;
  user-select: none;
  transform: translate(-50%, -50%);
  cursor: ${props => (props.onClick ? 'pointer' : 'default')};
  &:hover {
    z-index: 1;
  }
`;

class Marker extends Component {
  render() {
    return <Wrapper
    alt={this.props.venue}
    bg={this.props.bg}
    isFavourite={this.props.isFavourite}>
    </Wrapper>
  }
}

Marker.defaultProps = {
  onClick: null,
  bg: 'black'
};

Marker.propTypes = {
  onClick: PropTypes.func,
  venue: PropTypes.string,
};

export default Marker;
