<template>
	<div>
		username {{ username }}
		<FormKit
			type="form"
			id="password_reset"
			submit-label="Submit"
			@submit="submitHandler"
		>
			<FormKit
				type="password"
				name="password"
				label="Password"
				v-model="password"
				validation="required|length:8"
				validation-visibility="live"
				:validation-messages="{
					matches: 'Must be at leat 8 characters',
				}"
			/>
			<FormKit
				type="password"
				name="password_confirm"
				label="Confirm password"
				v-model="password_confirm"
				validation="required|confirm"
				validation-visibility="live"
				validation-label="Confirmation"
			/>
			<pre wrap>password= {{ password }}</pre>
			<pre wrap>username= {{ username }}</pre>
		</FormKit>
	</div>
</template>

<script setup>
	import { userService } from '@/services/'

	const router = useRouter()
	const navigate = (p) => {
		return navigateTo({
			path: p,
		})
	}

	const password = ref('')
	const password_confirm = ref('')
	const username = ref(route.params.username)

	const submitHandler = () => {
		userService.resetPassword(username.value, password.value)
		navigate('/loginpage')
	}
</script>
