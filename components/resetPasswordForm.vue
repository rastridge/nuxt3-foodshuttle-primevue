<template>
	<div class="grid">
		<div class="col">
			<p>
				In a few moments instructions to reset your password will be sent to you
				at the email address associated with this username
			</p>
			<FormKit
				type="form"
				:config="{ validationVisibility: 'live' }"
				v-model="state"
				submit-label="Submit"
				@submit="submitForm(state)"
			>
				<FormKit
					label="Username"
					name="username"
					type="text"
					validation="required"
					v-model="state.username"
				/>
				<details>
					<summary>Form data</summary>
					<pre>{{ state }}</pre>
				</details>
			</FormKit>

			<div class="mb-3">
				<button class="p-button-danger" @click.prevent="cancelForm()">
					Cancel
				</button>
			</div>
		</div>
	</div>
</template>

<script setup>
	const emit = defineEmits(['submitted'])
	const router = useRouter()
	const navigate = (p) => {
		return navigateTo({
			path: p,
		})
	}

	// initialize formkit state
	const state = reactive({
		username: '',
	})

	// form handlers
	const submitForm = (state) => {
		// emit('submitted', state)
	}

	const cancelForm = () => {
		navigate('/loginpage')
	}
</script>

<style>
	.formkit-inner {
		background-color: rgba(255, 255, 255, 0.3);
	}
	[data-complete] .formkit-inner {
		border-color: rgb(0, 255, 0);
		box-shadow: 0 0 0 1px green;
	}
	[data-invalid] .formkit-inner {
		border-color: red;
		box-shadow: 0 0 0 1px red;
	}

	[data-complete] .formkit-inner::after {
		content: '✅';
		display: block;
		padding: 0.5em;
	}
</style>
