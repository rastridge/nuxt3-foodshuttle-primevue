<script setup>
	import { useAuthStore } from '~~/stores/authStore'
	import { useAlertStore } from '~~/stores/alertStore'
	const alert = useAlertStore()
	const auth = useAuthStore()

	definePageMeta({ layout: 'admin' })

	//
	// Images form actions
	//
	const onSubmit = async function (state) {
		const { data, pending, error } = await useFetch('/images/addone', {
			method: 'post',
			body: state,
			headers: {
				authorization: auth.user.token,
			},
		})
		if (data.value.message) {
			alert.error(data.value.message)
		} else {
			navigateTo('/admin/images')
		}
	}
</script>

<template>
	<div>
		<Head>
			<Title>Add Image</Title>
		</Head>
		<common-header title="Add Image" />

		<div v-if="alert.message" :class="`alert ${alert.type}`">
			{{ alert.message }}
		</div>

		<images-form @submitted="onSubmit" />

		<div v-if="alert.message" :class="`alert ${alert.type}`">
			{{ alert.message }}
		</div>
	</div>
</template>
