const getDaysFromToday = require('./utils/dates')
const config = require('./config')
const moment = require('moment-timezone')

const dates = [ moment.parseZone("2019-04-25T00:00:00.000+10:00"),
moment.parseZone("2019-04-26T00:00:00.000+10:00"),
moment.parseZone("2019-04-27T00:00:00.000+10:00"),
moment.parseZone("2019-04-28T00:00:00.000+10:00"),
moment.parseZone("2019-04-29T00:00:00.000+10:00"),
moment.parseZone("2019-04-30T00:00:00.000+10:00"),
moment.parseZone("2019-05-01T00:00:00.000+10:00") ]

console.log(moment.parseZone("2019-04-25T00:00:00.000+10:00").format('DD-MM-YYYY'))