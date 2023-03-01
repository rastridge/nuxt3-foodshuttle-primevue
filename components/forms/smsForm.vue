<template>
	<div class="form-box">
		<p v-if="id">
			Current version of this SMS was sent {{ sms_opened_cnt }} times
		</p>
		<FormKit
			type="form"
			v-model="state"
			submit-label="Submit"
			@submit="submitForm(state)"
		>
			<FormKit
				type="select"
				label="Recipient Group"
				placeholder="Select Recipient Group"
				name="sms_recipient_type_id"
				:options="newsletterRecipientTypeOptions"
				validation="required"
			/>

			<FormKit
				label="SMS subject"
				name="sms_subject"
				type="text"
				validation="required"
			/>
			<FormKit
				label="SMS message"
				name="sms_body_text"
				type="text"
				validation="required"
			/>
		</FormKit>
		<Button class="m-1" @click.prevent="cancelForm()"> Cancel </Button>
	</div>
</template>

<script setup>
	import '@formkit/themes/genesis'

	import { useAuthStore } from '~~/stores/authStore'
	const auth = useAuthStore()
	//
	// Incoming id
	//
	const props = defineProps({
		id: { Number, default: 0 },
	})
	//
	// Outgoing form data
	//
	const emit = defineEmits(['submitted'])

	//
	// Formkit initial Add state
	//
	let state = ref({})
	state.value.sms_recipient_type_id = 13
	state.value.admin_user_id = auth.user.admin_user_id

	/* 	let state = reactive({
		sms_recipient_type_id: 13,
		sms_id: '',
		admin_user_id: auth.user.admin_user_id,
		sms_subject: '',
		sms_body_text: '',
	}) */

	//
	//
	//
	const sms_opened_cnt = ref(0)
	//
	// Editing if there is an id - Adding if not
	//
	if (props.id !== 0) {
		//
		// get sms data for id
		//
		const {
			data: sms_data,
			pending,
			error,
			refresh,
		} = await useFetch(`/sms/${props.id}`, {
			method: 'get',
			headers: {
				authorization: auth.user.token,
			},
		})

		//
		// assign existing data to Edit form
		//
		state.value = sms_data.value
		// additional
		state.admin_user_id = auth.user.admin_user_id

		/* 		state.newsletter_recipient_type_id = ''
		state.sms_id = props.id
		state.id = props.id
		state.newsletter_subject = sms_data.value.newsletter_subject
		state.newsletter_body_html = sms_data.value.newsletter_body_html
		state.newsletter_body_text = sms_data.value.newsletter_body_text
 */
		sms_opened_cnt.value = sms_data.value.sms_recp_cnt
	}
	//
	// form handlers
	//
	const submitForm = (state) => {
		emit('submitted', state)
	}

	const cancelForm = () => {
		navigateTo('/admin/sms')
	}
	//
	// get newletter recipient types for Dropdown
	//
	const { data: newsletterRecipientTypes } = await useFetch(
		'/newsletters/newsletterrecipienttypes',
		{
			method: 'get',
			headers: {
				authorization: auth.user.token,
			},
		}
	)
	//
	// convert for Formkit "label" "value"
	//
	const setNewsletterRecipientTypeOptions = (nltypes) => {
		let result = []
		nltypes.map((old) => {
			let n = {}
			n.label = old.newsletter_recipient_type
			n.value = old.newsletter_recipient_type_id
			result.push(n)
		})
		return result
	}
	const newsletterRecipientTypeOptions = setNewsletterRecipientTypeOptions(
		newsletterRecipientTypes.value
	)
</script>
