<script setup>
	import Swal from 'sweetalert2'
	import { useAlertStore } from '~~/stores/alertStore'
	const alert = useAlertStore()

	definePageMeta({ layout: 'admin' })

	//
	// Get SMS id
	//
	const route = useRoute()
	const id = ref(route.params.id)
	//
	// SMS form action
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
				// composable
				useEditSMS(state, 'sendNow')
				Swal.fire('Saved and Sent', '', 'success')
			} else if (result.isDenied) {
				useEditSMS(state, 'sendLater')
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
			<Title>Edit SMS {{ id }}</Title>
		</Head>
		<common-header title="Edit SMS" />

		<div v-if="alert.message" :class="`alert ${alert.type}`">
			{{ alert.message }}
		</div>
		<sms-form :id="id" @submitted="onSubmit" />
	</div>
</template>

<style lang="scss" scoped>
	@import 'sweetalert2/src/sweetalert2.scss';
</style>
