const moment = require('moment-timezone')



const date_str = '18 MAR 2019'

const time = moment("2019-03-17T13:00:00.000Z")
console.log(time.format("DD MM YYYY"))