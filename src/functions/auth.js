export const login = (user) => {
	return fetch(`${process.env.REACT_APP_BACKEND_API}/login`, {

		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(user)
	})
		.then((response) => {
			return response.json()
		})
		.catch((err) => {
			console.log(err)
		})
}
export const changePassword = (user) => {
	return fetch(`${process.env.REACT_APP_BACKEND_API}/sendResetPasswordCode`, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(user)
	})
		.then((response) => {
			return response.json()
		})
		.catch((err) => {
			console.log(err)
		})
}
