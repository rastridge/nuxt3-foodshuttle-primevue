// import Axios from 'axios'
// import { handleSuccess, handleError, authHeader } from '@/helpers'
const runtimeConfig = useRuntimeConfig()

export const userService = {
	// login,
	resetRequest,
	resetPassword,
	// reset,
	// getAll,
	// getOne,
	// editOne,
	// addOne,
	// getApps,
	// getAppPerms,
	// deleteOne,
	// changeStatus,
}

/* async function login(username, password) {
	const { data, error } = await useFetch('/users/authenticate', {
		method: 'POST',
		body: { username, password },
		headers: {
			authorization: auth.user.token,
		},
	})
	return data
}
 */
/* 
function login(username, password) {
	const requestOptions = {
		url: `${API}/users/authenticate`,
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		data: { username, password },
	}
	return Axios(requestOptions).then(handleSuccess).catch(handleError)
}
 */
/* function resetRequest(username) {
	const requestOptions = {
		url: `/users/resetrequest`,
		method: 'POST',
		data: { username },
	}
	return Axios(requestOptions).then(handleSuccess).catch(handleError)
}
 */
async function resetRequest(username) {
	const { data, error } = await useFetch('/users/resetrequest', {
		method: 'POST',
		body: { username },
		headers: {
			authorization: auth.user.token,
		},
	})
	return data
}

async function resetPassword(username, password) {
	const { data, error } = await useFetch('/users/resetpassword', {
		method: 'POST',
		body: { username, password },
		headers: {
			authorization: auth.user.token,
		},
	})
	return data
}

/* function resetPassword(user, pass) {
	const requestOptions = {
		url: `/users/resetpassword`,
		method: 'POST',
		data: { user, pass },
	}
	return Axios(requestOptions).then(handleSuccess).catch(handleError)
}

 */
/* 
async function getAll() {
	const { data } = await useFetch('/users/editone', {
		method: 'GET',
		headers: {
			authorization: auth.user.token,
		},
	})
	return data
}

function getOne(id) {
	const requestOptions = {
		url: `/users/` + id,
		method: 'GET',
	}
	return Axios(requestOptions).then(handleSuccess).catch(handleError)
}
function resetPassword(user, pass) {
	const requestOptions = {
		url: `/users/resetpassword`,
		method: 'POST',
		data: { user, pass },
	}
	return Axios(requestOptions).then(handleSuccess).catch(handleError)
}

function resetRequest(username) {
	const requestOptions = {
		url: `/users/resetrequest`,
		method: 'POST',
		data: { username },
	}
	return Axios(requestOptions).then(handleSuccess).catch(handleError)
}

function deleteOne(id) {
	const requestOptions = {
		url: `/users/delete/` + id,
		method: 'GET',
	}
	return Axios(requestOptions).then(handleSuccess).catch(handleError)
}

function editOne(id, username, password, email, perms) {
	const requestOptions = {
		url: `/users/edit`,
		method: 'POST',

		data: { id, username, password, email, perms },
	}
	return Axios(requestOptions).then(handleSuccess).catch(handleError)
}

function addOne(username, password, email) {
	const requestOptions = {
		url: `/users/add`,
		method: 'POST',

		data: { username, password, email },
	}
	return Axios(requestOptions).then(handleSuccess).catch(handleError)
}

function changeStatus(id, status) {
	const requestOptions = {
		url: `/users/status`,
		method: 'POST',

		data: { id, status },
	}
	return Axios(requestOptions).then(handleSuccess).catch(handleError)
}

function getApps() {
	const requestOptions = {
		url: `/users/apps`,
		method: 'GET',
	}
	return Axios(requestOptions).then(handleSuccess).catch(handleError)
}

function getAppPerms() {
	const requestOptions = {
		url: `/users/perms`,
		method: 'POST',

		data: {},
	}
	return Axios(requestOptions).then(handleSuccess).catch(handleError)
}

// NO Authorization Required

function reset(username, email) {
	const requestOptions = {
		url: `/users/reset`,
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		data: { username, email },
	}
	return Axios(requestOptions)
		.catch(handleError)
		.then((user) => {
			return user
		})
}
 */
