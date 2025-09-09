export const getUsers = (token) => {
	return fetch(`${process.env.REACT_APP_BACKEND_API}/admin/users`, {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	})
		.then((response) => {
			return response.json()
		})
		.catch((err) => console.log(err))
}

export const getAirdrops = (token) => {
	return fetch(`${process.env.REACT_APP_BACKEND_API}/admin/airdrops`, {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	})
		.then((response) => {
			return response.json()
		})
		.catch((err) => console.log(err))
}
