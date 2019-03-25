import styled from 'styled-components'
import moment from 'moment-timezone'
import React from 'react'
import { Link, useStaticQuery, graphql } from 'gatsby'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md'


const FlexContainer = styled.div`
display: flex;
justify-content: space-between;
margin-bottom: 1em;
`

const FlexItem = styled.div`
width: auto;
`

const PrevDate = styled(FlexItem)`
text-align: left;
`

const CurrentDate = styled(FlexItem)`
text-align: center;
font-weight: bold;
`

const NextDate = styled(FlexItem)`
text-align: right;
`

const DateLink = styled(Link)`
background: lightgray;
padding: 0.5em 1em;
color: black;
text-decoration: none;
`

const arrowStyle = `
width: 1em;
height: 1em;
position: relative;
top: 0.125em;
`

const RightArrow = styled(MdKeyboardArrowRight)`${arrowStyle}`

const LeftArrow = styled(MdKeyboardArrowLeft)`${arrowStyle}`


function dStr(date) {
	return moment(date).format('dddd DD MMMM')
}

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

function DayNav({prevDate, date, nextDate}) {
  const {dates} = useStaticQuery(graphql`
    query getToday {
      dates: allEventsJson {
	    group(field: date) {
	      fieldValue
	    }
	  }
    }
  `)
  const today = dates.group[0].fieldValue
  return (
  	<FlexContainer>
	    <PrevDate>
	    {prevDate && (<DateLink to={dPath(prevDate, today)}><LeftArrow />{dayStr(prevDate)}</DateLink>)}
	    </PrevDate>
	    <CurrentDate>
	    {dStr(date)}
	    </CurrentDate>
	    <NextDate>
	    {nextDate && (<DateLink to={dPath(nextDate)}>{dayStr(nextDate)}<RightArrow /></DateLink>)}
	    </NextDate>
    </FlexContainer>
  );
}

export default DayNav