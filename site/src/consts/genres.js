const genres = [
{'id': 'jazz-soul-funk-latin-world-music',
'name': 'Jazz, Soul, Funk, Latin & World Music',
'colour': 'red'},
{'id': 'comedy',
'name': 'Comedy',
'colour': 'blue'},
{'id': 'arts-theatre-burlesque-markets', 
'name': 'Arts, Theatre, Burlesque & Markets',
'colour': 'green'},
{'id': 'hip-hop-r-b',
'name': 'Hip Hop & R&B',
'colour': 'violet'},
{'id': 'house-electro-trance-club-nights',
'name': 'House, Electro, Trance & Club Nights',
'colour': 'cyan'},
{'id': 'indie-rock-pop-metal-punk-covers',
'name': 'Indie, Rock, Pop, Metal, Punk & Covers',
'colour': 'yellow'},
{'id': 'acoustic-country-blues-folk',
'name': 'Acoustic, Country, Blues & Folk',
'colour': 'orange'},
{'id': 'trivia-gaming',
'name': 'Trivia & Gaming',
'colour': 'pink'}
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