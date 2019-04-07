import React from "react";
import styled from "styled-components";
import { getGenreName, genreColour } from "../consts/genres";
import { CloseBalloon } from "./Balloon";
import { space } from "styled-system";

const OptionsWindowDiv = styled.div`
  width: 100%;
  position: fixed;
  bottom: 0;
  padding: 20px 10px 30px;
  height: auto;
  background: white;
  z-index: 2;
`;

const OptionsWindow = ({ children }) => {
  return <OptionsWindowDiv>{children}</OptionsWindowDiv>;
};

const CheckboxList = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const CheckboxContainer = styled.div`
  background: ${props => (props.ticked ? props.genreColour : "#ededed")};
  flex-basis: calc(50% - 5px);
  margin-bottom: 10px;
  padding-top: 10px;

  input {
    margin-top: 0.75em;
    display: block;
    margin: auto;
  }

  label {
    display: block;
  }
  ${space}
`;

export default (props) => {
  const { allGenres, showingGenres } = props;
  function handleGenreChange(e) {
      props.onGenreChange(e)
  }

  function toggleFilters() {
      props.onToggleFilters()
  }
  return (
    <OptionsWindow>
      <CloseBalloon onClick={toggleFilters}>X</CloseBalloon>
      <h3 style={{ marginBottom: "0.5em" }}>Filter by genre</h3>
      <CheckboxList>
        {allGenres.map(genre => {
          let genreId = genre.fieldValue;
          let isShowing = showingGenres ? showingGenres.includes(genre) : true;
          return (
            <CheckboxContainer
              key={"checkbox-" + genreId}
              ticked={isShowing}
              genreColour={genreColour(genre.fieldValue, 0.25)}
              p={["1", "2"]}
            >
              <label>
                <input
                  name={genreId}
                  type="checkbox"
                  checked={isShowing}
                  onChange={handleGenreChange}
                />
                {getGenreName(genreId)}
              </label>
            </CheckboxContainer>
          );
        })}
      </CheckboxList>
    </OptionsWindow>
  );
}
