<template>
	<div class="form-box">
		<FormKit
			type="form"
			:config="{ validationVisibility: 'live' }"
			v-model="state"
			submit-label="Submit"
			@submit="submitForm(state)"
		>
			<FormKit
				label="Page Title"
				name="content_name"
				type="text"
				validation="required"
			/>

			<FormKit
				v-if="peek"
				label="Raw HTML Article"
				name="content_body"
				type="textarea"
				disabled="true"
			/>
			<Button
				label="Toggle raw HTML view"
				class="p-button-secondary mb-1"
				@click="toggle"
			/>

			<!-- 			<div class="editor">
				<quill-editor
					label="Content"
					contentType="html"
					v-model:content="state.content_body"
					toolbar="full"
					:modules="modules"
				></quill-editor>
			</div> -->
			<h4>Content</h4>

			<input-body
				:field="state.content_body"
				@changeState="changeState"
			></input-body>

			<!-- </FormKit> -->
			<FormKit
				label="Order in Menu"
				name="content_order"
				type="number"
				min="0"
				validation="required"
			/>

			<FormKit
				type="datetime-local"
				label="Release Date"
				name="content_release_dt"
				validation="required"
			/>

			<FormKit
				type="datetime-local"
				label="Expire Date"
				name="content_expire_dt"
				validation="required"
			/>
		</FormKit>
		<Button @click.prevent="cancelForm()"> Cancel </Button>
	</div>
	<!-- </div> -->
</template>

<script setup>
	import '@formkit/themes/genesis'
	import { QuillEditor } from '@vueup/vue-quill'
	import ImageUploader from 'quill-image-uploader'
	// import BlotFormatter from 'quill-blot-formatter'
	import { useAuthStore } from '~~/stores/authStore'
	const auth = useAuthStore()

	const { $dayjs } = useNuxtApp()
	//
	// Outgoing
	//
	const emit = defineEmits(['submitted'])
	//
	// Incoming
	//
	const props = defineProps({
		id: { Number, default: 0 },
	})

	//
	// incoming from inputBody component
	//
	const changeState = (field) => {
		state.value.content_body = field
	}
	//
	// raw html view
	//
	const peek = ref(false)
	const toggle = () => {
		peek.value = !peek.value
	}

	//
	// Initialize form
	//
	let state = ref({})
	state.value.content_body = 'Add content here'
	const dt = $dayjs()
	state.value.content_release_dt = dt.format('YYYY-MM-DD HH:mm')
	state.value.content_expire_dt = dt.add(28, 'day').format('YYYY-MM-DD HH:mm')

	//
	// edit if there is an id - add if not
	//
	if (props.id !== 0) {
		// get user with id === props.id
		const {
			data: content_data,
			pending,
			error,
			refresh,
		} = await useFetch(`/content/${props.id}`, {
			key: props.id,
			method: 'get',
			headers: {
				authorization: auth.user.token,
			},
		})

		state.value = content_data.value

		// Adjust for local time and Format for Primevue calendar
		state.value.content_release_dt = $dayjs(
			content_data.value.content_release_dt
		).format('YYYY-MM-DD HH:mm')
		state.value.content_expire_dt = $dayjs(
			content_data.value.content_expire_dt
		).format('YYYY-MM-DD HH:mm')
	}

	//
	// form handlers
	//
	const submitForm = (state) => {
		emit('submitted', state)
	}

	const cancelForm = () => {
		navigateTo('/admin/content') // needs to be / for self register
	}
</script>
