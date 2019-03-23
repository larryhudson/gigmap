const palx = require('palx')

const palette = palx('#07c')
console.log(palette)

module.exports =  {
  colors: {
  	lightred: palette.red[1],
  	red: palette.red[5],
  	darkred: palette.red[6],
  	lightblue: palette.blue[1],
  	blue: palette.blue[5],
  	darkblue: palette.blue[6],
  	lightgreen: palette.green[1],
  	green: palette.green[5],
  	darkgreen: palette.green[6],
  	lightviolet: palette.violet[1],
  	violet: palette.violet[5],
  	darkviolet: palette.violet[6],
  	lightcyan: palette.cyan[1],
  	cyan: palette.cyan[5],
  	darkcyan: palette.cyan[6],
  	lightyellow: palette.yellow[1],
  	yellow: palette.yellow[5],
  	darkyellow: palette.yellow[6],
  	lightorange: palette.orange[1],
  	orange: palette.orange[5],
  	darkorange: palette.orange[6],
  	lightpink: palette.pink[1],
  	pink: palette.pink[5],
  	darkpink: palette.pink[6],
  	}
}