import { useAuthStore } from '~~/stores/authStore'
const auth = useAuthStore()

export const useAddSMS = async (state, send) => {
	const { data, pending, error } = await useFetch('/sms/addone', {
		method: 'post',
		body: state,
		headers: {
			authorization: auth.user.token,
		},
	})
	state.sms_id = data.value.insertId
	if (send === 'sendNow') {
		const { data, pending, error } = await useFetch('/sms/send', {
			method: 'post',
			body: state,
			headers: {
				authorization: auth.user.token,
			},
		})
	}
	navigateTo('/admin/sms')
}

export const useEditSMS = async (state, send) => {
	const { data, pending, error } = await useFetch('/sms/editone', {
		method: 'post',
		body: state,
		headers: {
			authorization: auth.user.token,
		},
	})
	if (send === 'sendNow') {
		const { data, pending, error } = await useFetch('/sms/send', {
			method: 'post',
			body: state,
			headers: {
				authorization: auth.user.token,
			},
		})
	}
	navigateTo('/admin/sms')
}
