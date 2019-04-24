const getDaysFromToday = require('./utils/dates')
const config = require('./config')
const moment = require('moment-timezone')

console.log(moment.utc("25 APR 2019", "DD MMM YYYY"))