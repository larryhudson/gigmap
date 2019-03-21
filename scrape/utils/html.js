const cheerio = require("cheerio")

function rpOptions(url) {
	return {
	    uri: url,
	    transform: function (body) {
	        return cheerio.load(body);
	    }
	};
}

module.exports = rpOptions