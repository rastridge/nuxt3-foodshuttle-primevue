<script setup>
	import { setErrors } from '@formkit/vue'
	import '@formkit/themes/genesis'

	const complete = ref(false)
	const fileinfo = ref('')

	const submitHandler = async (data) => {
		// We need to submit this as a multipart/form-data
		// to do this we use the FormData API.
		const body = new FormData()
		// We can append other data to our form data:
		body.append('name', data.name)
		// Finally, we append the actual File object(s)
		data.license.forEach((fileItem) => {
			body.append('license', fileItem.file)
		})

		// const res = await fetch('http://localhost:8080/images/upload', {
		const res = await fetch('https://media.my-test-site.net/images/upload', {
			// const res = await fetch('https://httpbin.org/post', {
			method: 'POST',
			body: body,
		})

		if (res.ok) {
			complete.value = true
		} else {
			setErrors('licenseForm', ['The server didn’t like our request.'])
		}
	}

	const getFiles = async () => {
		const res = await fetch('https://media.my-test-site.net/files', {
			// const res = await fetch('http://localhost:8080/files', {
			method: 'GET',
		})
		if (res.ok) {
			complete.value = true
			fileinfo.value = await res.json()
		} else {
			setErrors('licenseForm', ['The server didn’t like our request.'])
		}
	}

	const download = async () => {
		// const res = await fetch(
		// 	'https://media.my-test-site.net/files/1676908680063_sharped_1960_Ron_RonJr.jpeg',
		const res = await fetch(
			'http://localhost:8080/files/1676908680063_sharped_1960_Ron_RonJr.jpeg',
			{
				method: 'GET',
			}
		)
		if (res.ok) {
			complete.value = true
		} else {
			setErrors('licenseForm', ['The server didn’t like our request.'])
		}
	}
</script>

<template>
	<button @click="getFiles">Get files</button>
	<button @click="download">Download file</button>
	fileinfo {{ fileinfo }}
	<FormKit
		v-if="!complete"
		id="licenseForm"
		type="form"
		@submit="submitHandler"
	>
		<!-- 		<FormKit
			type="text"
			label="Full name"
			help="Your full name as it appears on your license"
			name="name"
			validation="required"
		/> -->
		<FormKit
			type="file"
			label="Drivers license"
			name="license"
			help="Please add a scan of your driver’s license"
			accept=".jpeg,.jpg,.png,.pdf"
			validation="required"
		/>
	</FormKit>
	<div v-else class="complete">Request complete 👍</div>
</template>
