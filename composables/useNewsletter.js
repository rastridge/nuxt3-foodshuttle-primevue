import { useAuthStore } from '~~/stores/authStore'
const auth = useAuthStore()

export const useAddNewsletter = async (state, send) => {
	const { data, pending, error } = await useFetch('/newsletters/addone', {
		method: 'post',
		body: state,
		headers: {
			authorization: auth.user.token,
		},
	})
	state.newsletter_id = data.value.insertId
	if (send === 'sendNow') {
		const { data, pending, error } = await useFetch('/newsletters/send', {
			method: 'post',
			body: state,
			headers: {
				authorization: auth.user.token,
			},
		})
	}
	navigateTo('/admin/newsletters')
}

export const useEditNewsletter = async (state, send) => {
	const { data, pending, error } = await useFetch('/newsletters/editone', {
		method: 'post',
		body: state,
		headers: {
			authorization: auth.user.token,
		},
	})
	if (send === 'sendNow') {
		const { data, pending, error } = await useFetch('/newsletters/send', {
			method: 'post',
			body: state,
			headers: {
				authorization: auth.user.token,
			},
		})
	}
	navigateTo('/admin/newsletters')
}
