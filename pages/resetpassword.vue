<template>
	<div>
		<Head>
			<Title>Admin User Request Password Reset</Title>
		</Head>
		<div class="grid">
			<div>
				<h3>Admin User Request Password Reset</h3>

				<div class="grid">
					<div class="col">
						<p>
							In a few moments instructions to reset your password will be sent
							to you at the email address associated with this username
						</p>
						<FormKit
							type="form"
							submit-label="Submit"
							@submit="handleSubmit(state)"
						>
							<FormKit
								label="Username"
								name="username"
								type="text"
								v-model="username"
								validation="required"
							/>
						</FormKit>

						<div class="mb-3">
							<Button class="p-button-danger" @click.prevent="cancelForm()">
								Cancel
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	import '@formkit/themes/genesis'

	import { userService } from '@/services'

	// initialize formkit state
	const username = ref('')

	//
	// form actions
	//
	const cancelForm = () => {
		navigateTo('/loginpage')
	}
	const handleSubmit = function () {
		userService.resetRequest(username.value).then((result) => {
			if (!result.error) {
				navigateTo('/loginpage')
			} else {
				navigateTo('/loginpage')

				// this.submitStatus = 'ERROR'
				// this.error = username.error
			}
		})
	}
</script>
