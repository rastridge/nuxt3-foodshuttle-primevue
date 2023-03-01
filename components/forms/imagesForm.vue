<template>
	<div class="form-box">
		<image-upload />
		<FormKit
			type="form"
			:config="{ validationVisibility: 'live' }"
			v-model="state"
			submit-label="Submit"
			@submit="submitForm(state)"
		>
			<FormKit
				label="Image Title"
				name="title"
				type="text"
				validation="required"
			/>

			<FormKit label="Alt Tag" name="alt" type="text" />

			<div v-if="state.url">
				<Image :src="state.url" width="340" />
			</div>

			<!-- <ImageUpload v-else @submitted="onImageSubmit" /> -->
			<upload-widget v-else @uploaded="onImageSubmit" />

			<FormKit
				type="text"
				label="URL"
				name="url"
				disabled="true"
				validation="required"
			/>

			<FormKit
				type="text"
				label="Description"
				name="description"
				validation="required"
			/>
			<FormKit
				type="select"
				label="Should image appear in gallery?"
				name="gallery"
				:options="[
					{ label: 'Yes', value: 1 },
					{ label: 'No', value: 0 },
				]"
			/>
		</FormKit>
		<Button @click.prevent="cancelForm()"> Cancel </Button>
	</div>
	<!-- </div> -->
</template>

<script setup>
	import '@formkit/themes/genesis'

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
	// Initialize form
	//
	/* 	let state = reactive({
		image_id: '',
		id: '',
		title: '',
		alt: '',
		url: '',
		description: '',
		gallery: false,
	})
	*/
	let state = ref([])
	state.value.gallery = 0
	//
	// edit if there is an id - add if not
	//
	if (props.id !== 0) {
		// get user with id === props.id
		const {
			data: image_data,
			pending,
			error,
			refresh,
		} = await useFetch(`/images/${props.id}`, {
			method: 'get',
			headers: {
				authorization: auth.user.token,
			},
		})
		state.value = image_data.value

		/* 		state.image_id = props.id
		state.id = props.id
		state.title = image_data.value.title
		state.alt = image_data.value.alt
		state.url = image_data.value.url
		state.description = image_data.value.description
		state.gallery = image_data.value.gallery
		state.url = image_data.value.url */
	}

	//
	// form handlers
	//
	/* 	const onImageSubmit = (image) => {
		console.log('after emit image.url = ', image.url)
		state.value.url = image.url
	}	 */
	const onImageSubmit = (url) => {
		// console.log('after emit url = ', url)
		state.value.url = url
	}

	const submitForm = (state) => {
		emit('submitted', state)
	}

	const cancelForm = () => {
		navigateTo('/admin/images')
	}
</script>
