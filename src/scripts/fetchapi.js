export default (async function() {
	if (!window.location.pathname.includes("inbox.html")) return // guard clause

	const response = await fetch("https://api.nytimes.com/svc/search/v2/articlesearch.json")
	const pokemon = await response.json()

	localStorage.setItem("pokemon", JSON.stringify(pokemon))

	const HEADLINE = JSON.parse(localStorage.getItem("headline"))

	console.log(HEADLINE)

	
})()
