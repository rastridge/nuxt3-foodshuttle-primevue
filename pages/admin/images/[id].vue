<script setup>
	import { useAuthStore } from '~~/stores/authStore'
	import { useAlertStore } from '~~/stores/alertStore'
	const alert = useAlertStore()
	const auth = useAuthStore()

	definePageMeta({ layout: 'admin' })

	//
	// Get images item id
	//
	const route = useRoute()
	const id = ref(route.params.id)

	//
	// images form action
	//
	const onSubmit = async function (state) {
		const { data, pending, error } = await useFetch('/images/editone', {
			method: 'post',
			body: state,
			headers: {
				authorization: auth.user.token,
			},
		})
		if (error.value) {
			alert.error(error.value.message)
		} else {
			navigateTo('/admin/images')
		}
	}
</script>

<template>
	<div>
		<Head>
			<Title>Edit image {{ id }}</Title>
		</Head>
		<common-header title="Edit image" />

		<div v-if="alert.message" :class="`alert ${alert.type}`">
			{{ alert.message }}
		</div>

		<images-form :id="id" @submitted="onSubmit" />
	</div>
</template>
