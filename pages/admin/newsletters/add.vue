<script setup>
	import Swal from 'sweetalert2'
	import { useAlertStore } from '~~/stores/alertStore'
	const alert = useAlertStore()

	definePageMeta({ layout: 'admin' })

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
				useAddNewsletter(state, 'sendNow')
				Swal.fire('Saved and Sent', '', 'success')
			} else if (result.isDenied) {
				useAddNewsletter(state, 'sendLater')
				Swal.fire('Saved', '', 'success')
			} else if (result.isDismissed) {
				// this.submitStatus = ''
			}
		})
	}

	// const { onSendSave } = useSendSave()
	// onSendSave(state.value, useAddNewsletter())
</script>

<template>
	<div>
		<Head>
			<Title>Add Newsletter</Title>
		</Head>
		<common-header title="Add Newsletter" />

		<div v-if="alert.message" :class="`alert ${alert.type}`">
			{{ alert.message }}
		</div>

		<newsletters-form @submitted="onSubmit" />
		<!-- <newsletters-form @submitted="onSendSave" /> -->

		<div v-if="alert.message" :class="`alert ${alert.type}`">
			{{ alert.message }}
		</div>
	</div>
</template>

<style lang="scss" scoped>
	@import 'sweetalert2/src/sweetalert2.scss';
</style>
