import { useAuthStore } from '~~/stores/authStore'

export const accountService = {
	getAll,
	getMemberTypes, // authorization
	/* 	getOne,
	addOne,
	editOne,
	deleteOne,
	changeStatus,
	getMemberAdminTypes,
*/
}

async function getAll() {
	const auth = useAuthStore()
	const { data, pending, error, refresh } = await useFetch('/accounts/getall', {
		method: 'get',
		headers: {
			authorization: auth.user.token,
		},
	})
	return data
}

async function getMemberTypes() {
	const auth = useAuthStore()
	const { data } = await useFetch('/accounts/membertypes', {
		method: 'get',
		headers: {
			authorization: 'not-needed',
		},
	})
	return data
}
