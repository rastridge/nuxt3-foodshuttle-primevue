<template>
	<div class="editor m-1">
		<quill-editor
			contentType="html"
			v-model:content="localfield"
			toolbar="full"
			:modules="modules"
			@textChange="changeState()"
		></quill-editor>
		<!-- <quill-editor
			contentType="html"
			v-model:content="localfield"
			toolbar="full"
			@textChange="changeState()"
		></quill-editor> -->
	</div>
</template>

<script setup>
	import '@formkit/themes/genesis'
	import { QuillEditor } from '@vueup/vue-quill'
	import ImageUploader from 'quill-image-uploader'
	// import BlotFormatter from 'quill-blot-formatter'
	import { useAuthStore } from '~~/stores/authStore'
	const auth = useAuthStore()
	const {
		CLOUD_NAME,
		CLOUD_API_KEY,
		CLOUD_API_SECRET,
		CLOUD_UPLOAD_PRESET,
		CLOUD_API,
	} = useRuntimeConfig()
	//
	// Incoming
	//
	const props = defineProps({
		field: { type: String, required: true },
	})
	const localfield = ref(props.field)

	//
	// outgoing
	//
	const emit = defineEmits(['changeState'])

	const changeState = () => {
		emit('changeState', localfield)
	}

	//
	// quill modules
	//
	const modules = {
		module: ImageUploader,
		options: {
			upload: async (file) => {
				const formData = new FormData()
				// formData.append('photo', file)
				formData.append('file', file)
				formData.append('upload_preset', CLOUD_UPLOAD_PRESET)

				// Upload to cloudinary
				const res = await fetch(`${CLOUD_API}/${CLOUD_NAME}/image/upload`, {
					method: 'POST',
					body: formData,
				})

				/* const res = await fetch('${MY_MEDIA_API}/images/upload', {
					method: 'POST',
					body: formData,
					headers: {
						authorization: auth.user.token,
					},
				}) */

				const data = await res.json()
				return data.url
			},
		},
	}
	/* 		const modules = [
			{
				name: 'blotFormatter',
				module: BlotFormatter,
				blotFormatter: {},
			},
			{
				module: ImageUploader,
				options: {
					upload: async (file) => {
						const formData = new FormData()
						formData.append('photo', file)

						const res = await fetch('/images/upload', {
							method: 'POST',
							body: formData,
							headers: {
								authorization: auth.user.token,
							},
						})
						const data = await res.json()
						return data.url
					},
				},
			},
		] */
</script>

<style scoped></style>
