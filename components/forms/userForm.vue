<template>
	<div>
		<!-- permsArray {{ permsArray }} -->
		<div v-if="!state" class="spinner-border text-primary" role="status">
			<span class="visually-hidden">Loading...</span>
		</div>
		<div v-else class="form-box">
			<form>
				<Button class="p-button-sm mb-2" @click.prevent="submitForm(state)">
					Submit
				</Button>

				<div class="field">
					<label for="admin_user_name">Username</label>
					<InputText
						id="admin_user_name"
						type="text"
						v-model.trim="state.admin_user_name"
					/>
				</div>

				<div class="field">
					<label for="admin_user_email">Email</label>
					<InputText
						id="admin_user_email"
						type="email"
						v-model.trim="state.admin_user_email"
					/>
				</div>

				<div v-if="!addForm" class="form-check">
					<div>
						<input
							id="reset"
							v-model="reset"
							type="checkbox"
							class="form-check-input"
							@input="resetPassword()"
						/>
						<label class="form-check-label" for="reset">Change password</label>
					</div>
				</div>
				<br />

				<div v-if="reset || addForm">
					<div class="field">
						<label for="password">New Password:</label>
						<InputText
							id="password"
							type="password"
							v-model.trim="state.password"
						/>
					</div>

					<!-- 						<label class="col-sm-4 control-label" for="password"
							>New Password:
						</label>
						<div class="col-sm-4">
							<input
								id="password"
								v-model.trim="state.password"
								type="text"
								class="form-control"
							/>
							<span v-if="required" class="error">Password required</span>
						</div>
 -->

					<div class="field">
						<label for="repeatPass">Repeat Password:</label>
						<InputText
							id="repeatPass"
							type="password"
							v-model.trim="state.repeatPass"
						/>
					</div>

					<!-- 

					<div class="form-group">
						<label class="col-sm-4 control-label" for="repeatPass"
							>Repeat Password:
						</label>
						<div class="col-sm-4">
							<input
								id="repeatPass"
								v-model.trim="repeatPass"
								type="password"
								class="form-control"
							/>
							<span v-if="match" class="error">Password must match</span>
						</div>
					</div>
 -->
				</div>
				<div class="grid">
					<div class="col">
						<h3 class="text-center">Admin User Permissions</h3>
						<table
							v-if="apps_data"
							style="
								white-space: nowrap;
								background-color: rgba(255, 255, 255, 0.3);
							"
						>
							<thead>
								<tr>
									<th class="text-center">Application</th>
									<th>Manage</th>
									<th>Create</th>
									<th>View</th>
									<th>No access</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(item, index) in apps_data" :key="item.admin_app_id">
									<td class="text-end">{{ item.admin_app_name }} :</td>
									<td>
										<div class="form-check">
											<input
												class="form-check-input"
												type="radio"
												v-model="state.perms[index].admin_perm"
												value="3"
											/>
										</div>
									</td>
									<td>
										<div class="form-check">
											<input
												class="form-check-input"
												type="radio"
												v-model="state.perms[index].admin_perm"
												value="2"
											/>
										</div>
									</td>
									<td>
										<div class="form-check">
											<input
												class="form-check-input"
												type="radio"
												v-model="state.perms[index].admin_perm"
												value="1"
											/>
										</div>
									</td>
									<td>
										<div class="form-check">
											<input
												class="form-check-input"
												type="radio"
												v-model="state.perms[index].admin_perm"
												value="0"
											/>
										</div>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>

				<div class="m-3">
					<Button class="mb-2" @click.prevent="cancelForm()"> Cancel </Button
					><br />
					<Button @click.prevent="submitForm(state)"> Submit </Button>
				</div>
			</form>
		</div>
	</div>
</template>

<script setup>
	import { useAuthStore } from '~~/stores/authStore'
	const auth = useAuthStore()
	//
	// Incoming
	//
	const props = defineProps({
		id: { Number, default: 0 },
	})

	//
	// outgoing
	//
	const emit = defineEmits(['submitted'])

	//
	// Initialize form
	//
	// get init perms
	const { data: initperms } = await useFetch('/users/initperms', {
		method: 'get',
		headers: {
			authorization: auth.user.token,
		},
	})

	const permsArray = ref([])
	initperms.value.forEach((i) => {
		permsArray.value.push({
			admin_perm_id: 0,
			admin_app_id: i.admin_app_id,
			admin_app_name: i.admin_app_name,
			admin_perm: 0,
			admin_user_id: 0,
		})
	})

	let state = reactive({
		admin_user_id: '',
		admin_user_name: '',
		admin_user_email: '',
		admin_user_pass: '',
		password: '',
		perms: permsArray.value,
		/* 		perms: [
				{
					admin_perm_id: 0,
					admin_app_id: 1,
					admin_app_name: 'settings',
					admin_perm: 3,
					admin_user_id: 0,
				},
				{
					admin_perm_id: 0,
					admin_app_id: 2,
					admin_app_name: 'sponsors',
					admin_perm: 3,
					admin_user_id: 0,
				},
				{
					admin_perm_id: 0,
					admin_app_id: 3,
					admin_app_name: 'videos',
					admin_perm: 3,
					admin_user_id: 0,
				},
				{
					admin_perm_id: 0,
					admin_app_id: 4,
					admin_app_name: 'news',
					admin_perm: 3,
					admin_user_id: 0,
				},
				{
					admin_perm_id: 0,
					admin_app_id: 5,
					admin_app_name: 'newsletters',
					admin_perm: 3,
					admin_user_id: 0,
				},
				{
					admin_perm_id: 0,
					admin_app_id: 6,
					admin_app_name: 'sms',
					admin_perm: 3,
					admin_user_id: 0,
				},
				{
					admin_perm_id: 0,
					admin_app_id: 8,
					admin_app_name: 'users',
					admin_perm: 3,
					admin_user_id: 0,
				},
				{
					admin_perm_id: 0,
					admin_app_id: 11,
					admin_app_name: 'content',
					admin_perm: 3,
					admin_user_id: 0,
				},
				{
					admin_perm_id: 0,
					admin_app_id: 12,
					admin_app_name: 'accounts',
					admin_perm: 3,
					admin_user_id: 0,
				},
				{
					admin_perm_id: 0,
					admin_app_id: 19,
					admin_app_name: 'contributions',
					admin_perm: 3,
					admin_user_id: 0,
				},
				{
					admin_perm_id: 0,
					admin_app_id: 21,
					admin_app_name: 'filemanager',
					admin_perm: 3,
					admin_user_id: 0,
				},
				{
					admin_perm_id: 0,
					admin_app_id: 26,
					admin_app_name: 'archive',
					admin_perm: 3,
					admin_user_id: 0,
				},
				{
					admin_perm_id: 0,
					admin_app_id: 29,
					admin_app_name: 'payments',
					admin_perm: 3,
					admin_user_id: 0,
				},
				{
					admin_perm_id: 0,
					admin_app_id: 31,
					admin_app_name: 'newsletters_archive',
					admin_perm: 3,
					admin_user_id: 0,
				},
				{
					admin_perm_id: 0,
					admin_app_id: 32,
					admin_app_name: 'images',
					admin_perm: 3,
					admin_user_id: 0,
				},
			],
	 */
	})

	//
	// password input
	//
	const reset = ref(false)
	const repeatPass = ref('')
	const resetPassword = () => {
		reset.value = !reset
		if (reset.value) {
			state.password = ''
			repeatPass.value = ''
		}
	}
	const match = computed(() => state.password !== repeatPass.value)
	const required = computed(() => state.password === '')
	const username_required = computed(() => state.admin_user_name === '')
	const email_required = computed(() => state.admin_user_email === '')
	const addForm = props.id === 0

	// get app namefor access inputs
	const { data: apps_data } = await useFetch(`/users/getapps`, {
		method: 'get',
		headers: {
			authorization: auth.user.token,
		},
	})

	// initlaize form ////////////////////////////
	// get users id if editing
	// add is zero  edit is non zero
	if (props.id !== 0) {
		// get user data
		const { data: form_data } = await useFetch(`/users/${props.id}`, {
			method: 'get',
			headers: {
				authorization: auth.user.token,
			},
		})
		// console.log('form_data= ', form_data)

		// init from existing values if editing

		state = form_data.value
		/* 		state.admin_user_id = form_data.value.admin_user_id
		state.admin_user_name = form_data.value.admin_user_name
		state.admin_user_email = form_data.value.admin_user_email
		state.admin_user_pass = form_data.value.admin_user_pass
		state.perms = form_data.value.perms */

		state.password = ''
	}
	//
	// form handlers
	//
	const submitForm = (state) => {
		console.log('in submitForm state = ', state)
		emit('submitted', state)
	}
	const cancelForm = () => {
		navigateTo('/admin/users')
	}
</script>

<style>
	.field * {
		display: block;
	}
</style>
