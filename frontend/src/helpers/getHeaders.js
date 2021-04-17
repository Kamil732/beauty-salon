import Cookies from 'js-cookie'

const getCsrfToken = (csrf = false) => {
	const config = {
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'Accept-Language': 'en',
		},
	}

	if (csrf) config.headers['X-CSRFToken'] = Cookies.get('csrftoken')

	return config
}

export default getCsrfToken
