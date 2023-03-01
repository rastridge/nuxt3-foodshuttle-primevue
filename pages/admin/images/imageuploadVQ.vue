<script setup>
	import { QuillEditor } from '@vueup/vue-quill'
	import ImageUploader from 'quill-image-uploader'
	import '@vueup/vue-quill/dist/vue-quill.snow.css'
	import { useAuthStore } from '~~/stores/authStore'
	const auth = useAuthStore()

	definePageMeta({ layout: 'admin' })

	const modules = {
		name: 'imageUploader',
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
	}
</script>

<template>
	<QuillEditor theme="snow" toolbar="full" :modules="modules" />
</template>
