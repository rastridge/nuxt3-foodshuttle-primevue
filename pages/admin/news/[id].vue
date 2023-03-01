<script setup>
	import { useAuthStore } from '~~/stores/authStore'
	import { useAlertStore } from '~~/stores/alertStore'
	const alert = useAlertStore()
	const auth = useAuthStore()

	definePageMeta({ layout: 'admin' })

	//
	// Get news item id
	//
	const route = useRoute()
	const id = ref(route.params.id)

	//
	// News form action
	//
	const onSubmit = async function (state) {
		const { data, pending, error } = await useFetch('/news/editone', {
			method: 'post',
			body: state,
			headers: {
				authorization: auth.user.token,
			},
		})
		if (data.value.message) {
			alert.error(data.value.message)
		} else {
			navigateTo('/admin/news')
		}
	}
</script>

<template>
	<div>
		<Head>
			<Title>Edit News Item {{ id }}</Title>
		</Head>
		<common-header title="Edit News Item" />

		<div v-if="alert.message" :class="`alert ${alert.type}`">
			{{ alert.message }}
		</div>

		<news-form :id="id" @submitted="onSubmit" />
	</div>
</template>
