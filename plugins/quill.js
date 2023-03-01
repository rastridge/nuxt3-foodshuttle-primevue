import { defineNuxtPlugin } from '#app'
import { QuillEditor } from '@vueup/vue-quill'

import '@vueup/vue-quill/dist/vue-quill.snow.css'

export default defineNuxtPlugin((nuxtapp) => {
	nuxtapp.vueApp.component('QuillEditor', QuillEditor)
})
