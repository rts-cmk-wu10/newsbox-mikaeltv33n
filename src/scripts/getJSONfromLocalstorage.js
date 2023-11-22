function getJSONfromLocalStorage(key) {
	const OBJECT = localStorage.getItem(key)
		? JSON.parse(localStorage.getItem(key))
		: null
	return OBJECT
}

export default getJSONfromLocalStorage
