<script setup>
	import { useAuthStore } from '~~/stores/authStore'
	import { useAlertStore } from '~~/stores/alertStore'
	const alert = useAlertStore()
	const auth = useAuthStore()

	definePageMeta({ layout: 'admin' })

	//
	// Users form action
	//
	const onSubmit = async function (state) {
		const { data, error } = await useFetch('/users/addone', {
			method: 'post',
			body: state,
			headers: {
				authorization: auth.user.token,
			},
		})
		if (data.value.message) {
			alert.error(data.value.message)
		} else {
			navigateTo('/admin/users')
		}
	}
</script>

<template>
	<div>
		<Head>
			<Title>Add User</Title>
		</Head>
		<common-header title="Add User" />

		<div v-if="alert.message" :class="`alert ${alert.type}`">
			{{ alert.message }}
		</div>
		<user-form @submitted="onSubmit" />
		<div v-if="alert.message" :class="`alert ${alert.type}`">
			{{ alert.message }}
		</div>
	</div>
</template>

<style scoped></style>
