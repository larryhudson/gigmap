const genres = [
{'id': 'jazz-soul-funk-latin-world-music',
'name': 'Jazz, Soul, Funk, Latin & World Music',
'colour': 'red'},
{'id': 'comedy',
'name': 'Comedy',
'colour': 'blue'},
{'id': 'arts-theatre-burlesque-markets', 
'name': 'Arts, Theatre, Burlesque & Markets',
'colour': 'brown'},
{'id': 'hip-hop-r-b',
'name': 'Hip Hop & R&B',
'colour': 'green'},
{'id': 'house-electro-trance-club-nights',
'name': 'House, Electro, Trance & Club Nights',
'colour': 'yellow'},
{'id': 'indie-rock-pop-metal-punk-covers',
'name': 'Indie, Rock, Pop, Metal, Punk & Covers',
'colour': 'purple'},
{'id': 'acoustic-country-blues-folk',
'name': 'Acoustic, Country, Blues & Folk',
'colour': '#FFF'},
{'id': 'trivia-gaming',
'name': 'Trivia & Gaming',
'colour': 'black'}
]

export default function getGenreName(id) {
	const genre = genres.find(g => g.id === id)
	return genre.name
}

export function getGenreId(name) {
	const genre = genres.find(g => g.name === name)
	return genre.id
}

export function genreColour(id) {
	const genre = genres.find(g => g.id === id)
	return genre.colour
}