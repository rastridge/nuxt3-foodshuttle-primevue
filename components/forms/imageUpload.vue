<script setup>
	import { setErrors } from '@formkit/vue'
	import '@formkit/themes/genesis'

	import { useAuthStore } from '~~/stores/authStore'
	const auth = useAuthStore()
	//
	// outgoing
	//
	const emit = defineEmits(['submitted'])

	// const complete = ref(false)
	const image = ref({})
	////////////////////////////
	///// does work ////////
	///////////////////////////
	//
	// upload action
	//
	const submitHandler = async (data) => {
		const body = new FormData()
		data.photo.forEach((fileItem) => {
			body.append('photo', fileItem.file)
		})

		// const res = await fetch('/images/upload', {
		const res = await fetch('https://media.my-test-site.net/images/upload', {
			method: 'POST',
			headers: {
				authorization: auth.user.token,
			},
			body: body,
		})
		if (res.ok) {
			// complete.value = true
			image.value = await res.json()
			// console.log('before emit image.value = ',  image.value)
			emit('submitted', image.value)
		} else {
			setErrors('photoForm', ['The server didn’t like our request.'])
		}
	}
</script>

<template>
	<!-- <FormKit v-if="!complete" id="photoForm" type="form" @submit="submitHandler"> -->
	<FormKit id="photoForm" type="form" @submit="submitHandler">
		<FormKit
			type="file"
			label="Upload an image"
			name="photo"
			accept=".jpeg,.jpg,.png,.pdf"
			validation="required"
		/>
	</FormKit>
	<!-- 	<div v-else class="complete">
		<div v-if="image">
			Image upload complete 👍 <br />{{ image.url }}
			<Image :src="image.url" width="340" />
		</div>
	</div> -->
</template>
