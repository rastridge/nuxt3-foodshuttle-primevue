import { defineStore } from 'pinia'
import { useAlertStore } from '~~/stores/alertStore'

export const useAuthStore = defineStore('auth', {
	state: () => ({ status: { loggedIn: false }, user: {} }),
	getters: {
		loggingIn: (state) => state.status.loggingIn,
		isLoggedIn: (state) => state.status.loggedIn,
		// getToken: (state) => state.status.user.token,
		getUser: (state) => state.status.user,
	},

	actions: {
		navigate(p) {
			const router = useRouter()
			return navigateTo({
				path: p,
			})
		},

		async login(username, password) {
			this.loginRequest(username, password)
		},

		logout() {
			const alert = useAlertStore()
			alert.clear()
			this.status = { loggedIn: false }
			this.user = {}
			sessionStorage.removeItem('auth')
			// this.navigate('/')
			navigateTo('/')
		},

		async loginRequest(username, password) {
			const alert = useAlertStore()
			this.status = { loggedIn: false }
			alert.attempt('Logging in . . .')
			const user = await $fetch('/users/authenticate', {
				headers: {
					authorization: 'not-needed',
				},
				method: 'POST',
				body: { username, password },
			})
			if (user.match) {
				this.user = user

				// console.log('IN Actions userService.login user is true')
				this.loginSuccess(user)
			} else {
				this.loginFailure()
			}
		},
		loginSuccess(user) {
			this.status = { loggedIn: true }
			this.user = user
			sessionStorage.removeItem('auth')
			sessionStorage.setItem('auth', JSON.stringify(user))
			// this.navigate('/admin')
			navigateTo('/admin')
			const alert = useAlertStore()
			alert.success('Login successful')
		},
		loginFailure() {
			this.status = { loggedIn: false }
			this.user = {}
			const alert = useAlertStore()
			alert.error('Login failed - try again')
			// this.navigate('/loginpage')
			navigateTo('/loginpage')
		},
	},
})
