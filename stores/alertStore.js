import { defineStore } from 'pinia'
export const useAlertStore = defineStore('alert', {
	state: () => ({
		type: null,
		message: null,
	}),
	getters: {
		messages: (state) => state.message,
		types: (state) => state.type,
	},

	actions: {
		set(message) {
			this.type = 'alert-set'
			this.message = message
		},
		success(message) {
			this.type = 'alert-success'
			this.message = message
		},
		attempt(message) {
			this.type = 'alert-info'
			this.message = message
		},
		error(message) {
			this.type = 'alert-danger'
			this.message = message
		},
		clear() {
			this.type = null
			this.message = null
		},
	},
})
