import React from "react";
import styled from "styled-components";
import {Link} from "gatsby"

const BottomButtonsDiv = styled.div`
  display: flex;
  justify-content: space-evenly;
  position: fixed;
  bottom: 0;
  background: white;
  width: 100%;
  padding: 5px;
  max-width: 960px;
  margin: 0 auto;
`;

// resetting styles
const resetButton = `
border: none;
  margin: 0;
  padding: 0;
  width: auto;
  overflow: visible;
  background: transparent;
  cursor: pointer;
  color: inherit;
  font: inherit;
  line-height: normal;
  -webkit-font-smoothing: inherit;
  -moz-osx-font-smoothing: inherit;
  -webkit-appearance: none;
  outline: 1px solid black;
  padding: 15px 15px;
  &:active {
    background: lightgray;
  }
`

export const UnstyledButton = styled.button`
  ${resetButton}
`;

export const UnstyledLink = styled(Link)`
  ${resetButton};
  text-decoration: none;
  padding: 10px;
  color: black;
`



export default props => {
  function changeView() {
    props.onChangeView();
  }

  function toggleFilters() {
    props.onToggleFilters();
  }

  const {currentView} = props;
  const changeButtonText = (currentView === "map") ? "View list" : "View map";
  return (
    <BottomButtonsDiv>
      <UnstyledButton onClick={toggleFilters}>Filter by category</UnstyledButton>
      <UnstyledButton onClick={changeView}>{changeButtonText}</UnstyledButton>
    </BottomButtonsDiv>
  );
};
