import { defineNuxtPlugin } from '#app'

import PrimeVue from 'primevue/config'
import AutoComplete from 'primevue/autocomplete'
import Badge from 'primevue/badge'
import Button from 'primevue/button'
import Calendar from 'primevue/calendar'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Dialog from 'primevue/dialog'
import Column from 'primevue/column'
import Editor from 'primevue/editor'
import Image from 'primevue/image'

import InputText from 'primevue/inputtext'
import Menubar from 'primevue/menubar'
import ProgressBar from 'primevue/progressbar'

import Tooltip from 'primevue/tooltip'
import Toolbar from 'primevue/toolbar'
import TreeTable from 'primevue/treetable'
import { useConfirm } from 'primevue/useconfirm'

export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.vueApp.use(PrimeVue, { ripple: true })
	nuxtApp.vueApp.component('AutoComplete', AutoComplete)
	nuxtApp.vueApp.component('Badge', Badge)
	nuxtApp.vueApp.component('Button', Button)
	nuxtApp.vueApp.component('Calendar', Calendar)
	nuxtApp.vueApp.component('Card', Card)
	nuxtApp.vueApp.component('Column', Column)
	nuxtApp.vueApp.component('DataTable', DataTable)
	nuxtApp.vueApp.component('Dialog', Dialog)
	nuxtApp.vueApp.component('Editor', Editor)
	nuxtApp.vueApp.component('Image', Image)
	nuxtApp.vueApp.component('InputText', InputText)
	nuxtApp.vueApp.component('Menubar', Menubar)
	nuxtApp.vueApp.component('ProgressBar', ProgressBar)
	nuxtApp.vueApp.component('Tooltip', Tooltip)
	nuxtApp.vueApp.component('Toolbar', Toolbar)
	nuxtApp.vueApp.component('TreeTable', TreeTable)
	nuxtApp.vueApp.component('useConfirm', useConfirm)

	//other components that you need
})
