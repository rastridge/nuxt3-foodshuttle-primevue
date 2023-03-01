<script setup>
	import { useAuthStore } from '~~/stores/authStore'
	import { useAlertStore } from '~~/stores/alertStore'
	const alert = useAlertStore()
	const auth = useAuthStore()

	definePageMeta({ layout: 'admin' })

	//
	// Get account id to edit
	//
	const route = useRoute()
	const id = ref(route.params.id)

	//
	// Accounts form action
	//
	const onSubmit = async function (state) {
		const { data, pending, error } = await useFetch('/accounts/editone', {
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
			<Title>Edit Account {{ id }}</Title>
		</Head>
		<common-header title="Edit account" />

		<div v-if="alert.message" :class="`alert ${alert.type}`">
			{{ alert.message }}
		</div>

		<accounts-form :id="id" @submitted="onSubmit" />
		<div v-if="alert.message" :class="`alert ${alert.type}`">
			{{ alert.message }}
		</div>
	</div>
</template>
