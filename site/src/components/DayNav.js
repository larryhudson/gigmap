import styled from 'styled-components'
import moment from 'moment-timezone'
import React from 'react'
import { Link, useStaticQuery, graphql } from 'gatsby'


const FlexContainer = styled.div`
display: flex;
justify-content: space-between;
margin-bottom: 0.25em;
`

const FlexItem = styled.div`
width: auto;

a {
	background: ${props => props.isCurrent ? 'gold' : 'lightgray' };
}
`

// const PrevDate = styled(FlexItem)`
// text-align: left;
// `

// const CurrentDate = styled(FlexItem)`
// text-align: center;
// font-weight: bold;
// `

// const NextDate = styled(FlexItem)`
// text-align: right;
// `

const DateLink = styled(Link)`
padding: 0.25em 0.5em;
color: black;
text-decoration: none;
`

// const arrowStyle = `
// width: 1em;
// height: 1em;
// position: relative;
// top: 0.125em;
// `

// const RightArrow = styled(MdKeyboardArrowRight)`${arrowStyle}`

// const LeftArrow = styled(MdKeyboardArrowLeft)`${arrowStyle}`


// function dStr(date) {
// 	return moment(date).format('dddd DD MMMM')
// }

function dayStr(date) {
	return moment(date).format('ddd')
}

function dPath(date, today) {
	if (date === today) {
		return '/'
	} else {
		return '/day/' + moment(date).format('DD-MM-YYYY')
	}
}

function DayNav({showingGenreIds, current}) {
  const dateQuery = useStaticQuery(graphql`
	{
      dates: allEventsJson {
	    group(field: date) {
	      fieldValue
	    }
	  }
    }
  `)
  const today = dateQuery.dates.group[0].fieldValue
  const dates = dateQuery.dates.group

  return (
  	<FlexContainer>
		{dates.map(({fieldValue: date}) => {
			return <FlexItem key={dPath(date, today)} isCurrent={(date === current)}>
				<DateLink to={dPath(date, today) }>{dayStr(date)}</DateLink>
			</FlexItem>
		})}
    </FlexContainer>
  );
}

export default DayNav