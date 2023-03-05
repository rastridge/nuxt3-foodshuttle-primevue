<template>
	<div class="form-box">
		<FormKit
			type="form"
			v-model="state"
			submit-label="Submit"
			@submit="submitForm(state)"
		>
			<h4>* required</h4>
			<FormKit
				label="First Name *"
				name="member_firstname"
				type="text"
				validation="required"
				v-model="state.member_firstname"
			/>
			<FormKit
				label="Last Name *"
				name="member_lastname"
				type="text"
				validation="required"
				v-model="state.member_lastname"
			/>
			<FormKit
				type="email"
				label="Email address *"
				name="account_email"
				validation="required|email"
				v-model="state.account_email"
			/>
			<FormKit
				type="number"
				label="Year joined"
				name="year_joined"
				v-model="state.member_year"
				step="1"
			/>
			<FormKit
				type="text"
				label="Street address *"
				name="account_addr_street"
				validation="required"
				v-model="state.account_addr_street"
			/>
			<FormKit
				type="text"
				label="Street Ext"
				name="account_addr_street_ext"
				v-model="state.account_addr_street_ext"
			/>
			<FormKit
				type="text"
				label="City *"
				name="account_addr_city"
				validation="required"
				v-model="state.account_addr_city"
			/>
			<FormKit
				type="text"
				label="State *"
				name="account_addr_state"
				validation="required"
				v-model="state.account_addr_state"
			/>
			<FormKit
				type="text"
				label="Country *"
				name="account_addr_country"
				validation="required"
				v-model="state.account_addr_country"
			/>
			<FormKit
				type="text"
				label="Postal Code *"
				name="account_addr_postal"
				validation="required | matches:/^[0-9]{5}$/"
				v-model="state.account_addr_postal"
			/>
			<FormKit
				type="tel"
				label="Phone number *"
				name="account_addr_phone"
				placeholder="1-###-###-####"
				v-model="state.account_addr_phone"
				validation="required | matches:/^[1]{1}-[0-9]{3}-[0-9]{3}-[0-9]{4}$/"
				:validation-messages="{
					matches: 'Phone number must be in the format 1-###-###-####',
				}"
			/>
			<FormKit
				type="select"
				label="Show phone?"
				name="member_show_phone"
				v-model="state.member_show_phone"
				:options="[
					{ label: 'Yes', value: 1 },
					{ label: 'No', value: 0 },
				]"
			/>
			<FormKit
				type="select"
				label="Show address?"
				name="member_show_addr"
				v-model="state.member_show_addr"
				:options="[
					{ label: 'Yes', value: 1 },
					{ label: 'No', value: 0 },
				]"
			/>
			<FormKit
				type="select"
				label="Receive newsletter?"
				name="newsletter_recipient"
				v-model="state.newsletter_recipient"
				:options="[
					{ label: 'Yes', value: 1 },
					{ label: 'No', value: 0 },
				]"
			/>
			<FormKit
				type="select"
				label="Receive US Mail?"
				name="mail_recipient"
				v-model="state.mail_recipient"
				:options="[
					{ label: 'Yes', value: 1 },
					{ label: 'No', value: 0 },
				]"
			/>
			<FormKit
				type="select"
				label="Receive SMS messages?"
				name="sms_recipient"
				v-model="state.sms_recipient"
				:options="[
					{ label: 'Yes', value: 1 },
					{ label: 'No', value: 0 },
				]"
			/>
		</FormKit>

		<div class="mb-3">
			<Button @click.prevent="cancelForm()"> Cancel </Button>
		</div>
	</div>
</template>

<script setup>
	import '@formkit/themes/genesis'
	const { $dayjs } = useNuxtApp()
	//
	// outgoing
	//
	const emit = defineEmits(['submitted'])
	//
	// initialize form
	//
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
		member_admin_type2_id: '',

		// human: '',
	})
	//
	// form handlers
	//
	const submitForm = (state) => {
		emit('submitted', state)
	}

	const cancelForm = () => {
		navigateTo('/')
	}
</script>
