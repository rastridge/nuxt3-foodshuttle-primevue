<script setup>
	import Swal from 'sweetalert2'
	import { useAlertStore } from '~~/stores/alertStore'
	const alert = useAlertStore()

	definePageMeta({ layout: 'admin' })

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
				useAddSMS(state, 'sendNow')
				Swal.fire('Saved and Sent', '', 'success')
			} else if (result.isDenied) {
				useAddSMS(state, 'sendLater')
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
			<Title>Add SMS</Title>
		</Head>
		<common-header title="Add SMS" />

		<div v-if="alert.message" :class="`alert ${alert.type}`">
			{{ alert.message }}
		</div>

		<sms-form @submitted="onSubmit" />

		<div v-if="alert.message" :class="`alert ${alert.type}`">
			{{ alert.message }}
		</div>
	</div>
</template>

<style lang="scss" scoped>
	@import 'sweetalert2/src/sweetalert2.scss';
</style>
