<script setup>
	import { useAuthStore } from '~~/stores/authStore'
	import { useAlertStore } from '~~/stores/alertStore'
	const alert = useAlertStore()
	const auth = useAuthStore()

	definePageMeta({ layout: 'admin' })
	//
	// Accounts form action
	//
	const onSubmit = async function (state) {
		const { data, pending, error } = await useFetch('/accounts/addone', {
			method: 'post',
			body: state,
			headers: {
				authorization: auth.user.token,
			},
		})
		if (data.value.message) {
			alert.error(data.value.message)
		} else {
			navigateTo('/admin/accounts')
		}
	}
</script>

<template>
	<div>
		<Head>
			<Title>Add Account</Title>
		</Head>
		<common-header title="Add account" />

		<div v-if="alert.message" :class="`alert ${alert.type}`">
			{{ alert.message }}
		</div>

		<accounts-form @submitted="onSubmit" />

		<div v-if="alert.message" :class="`alert ${alert.type}`">
			{{ alert.message }}
		</div>
	</div>
</template>

<style scoped></style>
