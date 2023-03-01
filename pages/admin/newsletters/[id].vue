<script setup>
	import Swal from 'sweetalert2'
	import { useAlertStore } from '~~/stores/alertStore'
	const alert = useAlertStore()

	definePageMeta({ layout: 'admin' })

	//
	// Get news item id
	//
	const route = useRoute()
	const id = ref(route.params.id)
	//
	// Newsletters form action
	//
	const onSubmit = async function (state) {
		Swal.fire({
			title: 'What to do?',
			showDenyButton: true,
			showCancelButton: true,
			showConfirmButton: true,
			confirmButtonText: `Send now`,
			denyButtonText: `Send later`,
		}).then((result) => {
			if (result.isConfirmed) {
				useEditNewsletter(state, 'sendNow')
				Swal.fire('Saved and Sent', '', 'success')
			} else if (result.isDenied) {
				useEditNewsletter(state, 'sendLater')
				Swal.fire('Saved', '', 'success')
			} else if (result.isDismissed) {
				// this.submitStatus = ''
			}
		})
	}
</script>

<template>
	<div>
		<Head>
			<Title>Edit Newsletter {{ id }}</Title>
		</Head>
		<common-header title="Edit Newsletter" />

		<div v-if="alert.message" :class="`alert ${alert.type}`">
			{{ alert.message }}
		</div>
		<newsletters-form :id="id" @submitted="onSubmit" />
	</div>
</template>

<style lang="scss" scoped>
	@import 'sweetalert2/src/sweetalert2.scss';
</style>
