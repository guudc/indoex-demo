export const sendVerification = (token, user) => {

	return fetch(`${process.env.REACT_APP_BACKEND_API}/sendVerification`, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify(user)
	})
		.then((response) => {
			return response.json()
		})
		.catch((err) => console.log(err))
}
export const activate = (token, user) => {

	return fetch(`${process.env.REACT_APP_BACKEND_API}/activate`, {

		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify(user)
	})
		.then((response) => {
			return response.json()
		})
		.catch((err) => console.log(err))
}
export const submitAirdrop = (token, airdrop) => {

	return fetch(`${process.env.REACT_APP_BACKEND_API}/submit-airdrop`, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify(airdrop)
	})
		.then((response) => {
			return response.json()
		})
		.catch((err) => console.log(err))
}

export const updateMyAirdrop = (id, token, airdrop) => {

	return fetch(`${process.env.REACT_APP_BACKEND_API}/update/airdrop/${id}`, {
		method: 'PUT',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify(airdrop)
	})
		.then((response) => {
			return response.json()
		})
		.catch((err) => console.log(err))
}
export const deleteMyAirdrop = (id, token) => {

	return fetch(`${process.env.REACT_APP_BACKEND_API}/delete/airdrop/${id}`, {
		method: 'DELETE',
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

export const getMyAirdrops = (token) => {

	return fetch(`${process.env.REACT_APP_BACKEND_API}/my-airdrops`, {
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

export const getUserDetails = (token) => {

	return fetch(`${process.env.REACT_APP_BACKEND_API}/me`, {
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
export const updatePassword = (token, password) => {

	return fetch(`${process.env.REACT_APP_BACKEND_API}/updatePassword`, {
		method: 'PUT',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify(password)
	})
		.then((response) => {
			return response.json()
		})
		.catch((err) => console.log(err))
}
