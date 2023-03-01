<template>
	<div class="register">
		<common-header title="Register" />
		<div v-if="alert.message" :class="`alert ${alert.type}`">
			{{ alert.message }}
		</div>

		<accounts-self-form @submitted="handleSubmit" />
		<div v-if="alert.message" :class="`alert ${alert.type}`">
			{{ alert.message }}
		</div>

		<!-- Modal -->
		<Dialog
			header="Register"
			v-model:visible="displayModal"
			:breakpoints="{ '960px': '75vw', '640px': '90vw' }"
			:style="{ width: '50vw' }"
		>
			<p>
				Registering is an expression of interest in being informed of Food
				Shuttle of WNY activities and does not imply any commitment. Give us a
				try and see if we're right for you.
			</p>
			<template #footer>
				<Button
					label="Return"
					@click="closeModal"
					class="p-button-sm"
					autofocus
				/>
			</template>
		</Dialog>
	</div>
</template>

<script setup>
	import Dialog from 'primevue/dialog'
	import { useAlertStore } from '~~/stores/alertStore'
	const alert = useAlertStore()
	const { $dayjs } = useNuxtApp()

	const displayModal = ref(false)
	const openModal = (item) => {
		displayModal.value = true
		selectedItem.value = item
	}
	const closeModal = () => {
		displayModal.value = false
	}

	const state = reactive({
		account_email: '',
		member_firstname: '',
		member_lastname: '',
		member_year: $dayjs().format('YYYY'),
		account_addr_street: '',
		account_addr_street_ext: '',
		account_addr_city: '',
		account_addr_state: '',
		account_addr_country: '',
		account_addr_postal: '',
		account_addr_phone: '',
		member_show_phone: '1',
		member_show_addr: '1',
		newsletter_recipient: '1',
		mail_recipient: '0',
		sms_recipient: '1',
		member_type_id: '9',
		member_type2_id: '',
		member_admin_type_id: '0',
		member_admin_type2_id: '0',

		human: '',
	})

	const handleSubmit = async function (state) {
		const { data, pending, error } = await useFetch('/accounts/addone', {
			method: 'post',
			body: state,
			headers: {
				authorization: 'not-needed',
			},
		})
		console.log('in handlesubmit data.value.message = ', data.value.message)
		if (data.value.message) {
			alert.error(data.value.message)
		} else {
			navigateTo('/')
		}
	}
</script>
