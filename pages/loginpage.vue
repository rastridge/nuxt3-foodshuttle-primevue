<template>
	<div id="loginpage">
		<div class="grid">
			<div class="col">
				<div class="form-box">
					<div v-if="alert.message" :class="`alert ${alert.type}`">
						{{ alert.message }}
					</div>

					<div v-if="!auth.isLoggedIn">
						<h3 class="headline">Login Admin User</h3>

						<FormKit
							type="form"
							submit_label="Loginin"
							@submit="handleSubmit"
							#default="{ state }"
						>
							<FormKit
								type="text"
								name="username"
								label="Username"
								validate="required|length:5"
							>
							</FormKit>
							<FormKit
								type="password"
								name="password"
								label="Password"
								validate="required|length:5"
							>
							</FormKit>
							<!-- <FormKit type="submit" label="Login"> </FormKit> -->
						</FormKit>

						<div class="center-content">
							<br />
							<nuxt-link to="/resetpassword" active-class="active"
								><a>Forgot password?</a></nuxt-link
							>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import '@formkit/themes/genesis'

	import { useAuthStore } from '~~/stores/authStore'
	import { useAlertStore } from '~~/stores/alertStore'
	const auth = useAuthStore()
	const alert = useAlertStore() // used in template
	definePageMeta({ layout: 'default' })

	const username = ref('')
	const password = ref('')
	const submitted = ref(false)

	const handleSubmit = async (state) => {
		submitted.value = true
		if (state.username && state.password) {
			auth.login(state.username, state.password) // pinia auth store
		}
	}
</script>
