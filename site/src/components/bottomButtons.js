import React from "react";
import styled from "styled-components";

const BottomButtonsDiv = styled.div`
  display: flex;
  justify-content: space-evenly;
  position: fixed;
  bottom: 0;
  background: white;
  width: 100%;
  padding: 5px;
`;

// resetting styles
const OptionButton = styled.button`
  border: none;
  margin: 0;
  padding: 0;
  width: auto;
  overflow: visible;
  background: transparent;
  color: inherit;
  font: inherit;
  line-height: normal;
  -webkit-font-smoothing: inherit;
  -moz-osx-font-smoothing: inherit;
  -webkit-appearance: none;
  outline: 1px solid black;
  padding: 5px 10px;
  &:active {
    background: lightgray;
  }
`;

export default props => {
  function changeView() {
    props.onChangeView();
  }

  function toggleFilters() {
    props.onToggleFilters();
  }
  return (
    <BottomButtonsDiv>
      <OptionButton onClick={toggleFilters}>Filter by genre</OptionButton>
      <OptionButton onClick={changeView}>Change view</OptionButton>
    </BottomButtonsDiv>
  );
};
