import cookie from 'js-cookie'

// Set in Cookie
export const setCookie = (key, value) => {
	if (window !== 'undefiend') {
		cookie.set(key, value, {
			// 1 Day
			expires: 1
		})
	}
}
// remove from cookie
export const removeCookie = (key) => {
	if (window !== 'undefined') {
		cookie.remove(key, {
			expires: 1
		})
	}
}

// Get from cookie such as stored token
// Will be useful when we need to make request to server with token
export const getCookie = (key) => {
	if (window !== 'undefined') {
		return cookie.get(key)
	}
}

// Set in localstorage
export const setLocalStorage = (key, value) => {
	if (window !== 'undefined') {
		localStorage.setItem(key, JSON.stringify(value))
	}
}

// Remove from localstorage
export const removeLocalStorage = (key) => {
	if (window !== 'undefined') {
		localStorage.removeItem(key)
	}
}

// Auth enticate user by passing data to cookie and localstorage during signin
// export const authenticate = (response, next) => {
//     console.log('AUTHENTICATE HELPER ON SIGNIN RESPONSE', response);
//     setCookie('token', response.data.token);
//     setLocalStorage('user', response.data.user);
//     next();
// };

// Access user info from localstorage
export const isAuth = () => {
	if (window !== 'undefined') {
		const cookieChecked = getCookie('token')
		if (cookieChecked) {
			if (localStorage.getItem('user')) {
				return JSON.parse(localStorage.getItem('user'))
			} else {
				return false
			}
		}
	}
}

// export const signout = next => {
//     removeCookie('token');
//     removeLocalStorage('user');
//     next();
// };

export const authenticate = (data, next) => {
	if (typeof window !== 'undefined') {
		localStorage.setItem('jwt', JSON.stringify(data))
		next()
	}
}

export const signout = (next) => {
	if (typeof window !== 'undefined') {
		localStorage.removeItem('jwt')
		next()
		return fetch(`${process.env.REACT_APP_BACKEND_API}/logout`, {
			method: 'GET'
		})
			.then((response) => {
				console.log('signout', response)
			})
			.catch((err) => console.log(err))
	}
}

export const isAuthenticated = () => {
	if (typeof window == 'undefined') {
		return false
	}

	if (localStorage.getItem('jwt')) {
		
	
	return JSON.parse(localStorage.getItem('jwt'))
	} else {
		return false
	}


}
