import { useAlertStore } from '~~/stores/alertStore'
import { useAuthStore } from '~~/stores/authStore'

export default defineNuxtRouteMiddleware((from, to) => {
	const alert = useAlertStore() // this must be inside the function
	const auth = useAuthStore()
	const router = useRouter
	console.log(`IN test2.global.ts to from  fullPath = ${to.path} ${from.path} `)

	alert.clear() // clear alerts during every page change

	// restore authStore from session if page refresh has reset authStore
	if (
		to.path.slice(0, 6) === '/admin' &&
		JSON.parse(sessionStorage.getItem('auth')) &&
		!auth.isLoggedIn
	) {
		console.log('restore authStore after refresh yes')

		auth.user = JSON.parse(sessionStorage.getItem('auth'))
		auth.status = { loggedIn: true }
	}

	console.log(
		'auth.isLoggedIn  to.path.includes(/admin)',
		auth.isLoggedIn,
		to.path.includes('/admin')
	)

	console.log(
		'!auth.isLoggedIn && to.path.includes(/admin)',
		!auth.isLoggedIn && to.path.includes('/admin')
	)

	// dont let unauthorized users access /admin routes
	if (!auth.isLoggedIn && to.path.includes('/admin')) {
		// return navigateTo('/')
		return abortNavigation()
	}

	// /auth/signin and /auth/signup not reachable for already logged in users
	// if (auth.isLoggedIn && to.path === '/loginpage') {
	// 	return navigateTo('/admin')
	// }
})
