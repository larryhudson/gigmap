import React from "react";
import styled from "styled-components";
import { getGenreName, genreColour } from "../consts/genres";
import { space } from "styled-system";
import { UnstyledButton } from "./bottomButtons";

const OptionsWindowDiv = styled.div`
  width: 100%;
  position: fixed;
  bottom: 0;
  margin: 0 auto;
  max-width: 960px;
  padding: 20px 10px 30px;
  height: auto;
  background: white;
  z-index: 2;
`;

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
  border: 1px solid lightgray;

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

export default props => {
  const { allGenreIds, showingGenreIds } = props;
  function handleGenreChange(e) {
    props.onGenreChange(e);
  }

  function toggleFilters() {
    props.onToggleFilters();
  }

  function selectAllGenres() {
    props.onSelectAll();
  }
  return (
    <OptionsWindowDiv>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1.25em"
        }}
      >
        <h3 style={{ margin: "auto 0" }}>Filter by category</h3>
        <UnstyledButton onClick={selectAllGenres} style={{ margin: "auto 0" }}>
          Select all
        </UnstyledButton>
        <UnstyledButton onClick={toggleFilters}>X</UnstyledButton>
      </div>
      <CheckboxList>
        {allGenreIds.map(genreId => {
          let isShowing = showingGenreIds
            ? showingGenreIds.includes(genreId)
            : true;
          return (
            <CheckboxContainer
              key={"checkbox-" + genreId}
              ticked={isShowing}
              genreColour={genreColour(genreId, 0.25)}
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
    </OptionsWindowDiv>
  );
};
