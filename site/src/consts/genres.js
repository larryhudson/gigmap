import theme from '../components/theme'
import chroma from 'chroma-js'

const genres = [
{'id': 'jazz-soul-funk-latin-world-music',
'name': 'Jazz, Soul, Funk, Latin & World Music',
'colour': 'red'},
{'id': 'comedy',
'name': 'Comedy',
'colour': 'blue'},
{'id': 'arts-theatre-burlesque-markets', 
'name': 'Arts, Theatre, Burlesque & Markets',
'colour': 'black'},
{'id': 'hip-hop-r-b',
'name': 'Hip Hop & R&B',
'colour': 'fuchsia'},
{'id': 'house-electro-trance-club-nights',
'name': 'House, Electro, Trance & Club Nights',
'colour': 'green'},
{'id': 'indie-rock-pop-metal-punk-covers',
'name': 'Indie, Rock, Pop, Metal, Punk & Covers',
'colour': 'indigo'},
{'id': 'acoustic-country-blues-folk',
'name': 'Acoustic, Country, Blues & Folk',
'colour': 'orange'},
{'id': 'trivia-gaming',
'name': 'Trivia & Gaming',
'colour': 'white'}
]

export function getAllGenreIds() {
	return genres.map(genre => genre.id).sort()
}

export function getGenreName(id) {
	const genre = genres.find(g => g.id === id)
	return genre.name
}

export function getGenreId(name) {
	const genre = genres.find(g => g.name === name)
	return genre.id
}

export function genreColour(id, opacity=1) {
	const genreColour = genres.find(g => g.id === id).colour
	return chroma(theme.colors[genreColour]).brighten(1).alpha(opacity)
}