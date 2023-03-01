<template>
	<div>
		<Head>
			<Title>SMS List</Title>
		</Head>
		<common-header title="SMS List" />

		<div class="text-center m-5">
			<Button
				class="p-button-sm"
				label="Add SMS"
				@click="navigateTo('/admin/sms/add')"
			>
			</Button>
		</div>

		<span v-if="error" class="text-danger">ERROR: {{ error }}</span>

		<render-list
			:data="sms_data"
			:app="app"
			:statusable="statusable"
			:editable="editable"
			:deleteable="deleteable"
			:addable="addable"
			:viewable="viewable"
			@changeStatus="changeStatus"
			@deleteItem="deleteItem"
		/>
	</div>
</template>

<script setup>
	import { useAuthStore } from '~~/stores/authStore'
	const auth = useAuthStore()

	definePageMeta({ layout: 'admin' })

	const { getAccess } = useRenderListAccess()
	const app = 'sms'
	const { editable, addable, deleteable, statusable, viewable } = getAccess(app)

	//
	// Get all sms
	//
	const {
		data: sms_data,
		pending,
		error,
		refresh,
	} = await useFetch('/sms/getall', {
		initialCache: false,
		method: 'get',
		headers: {
			authorization: auth.user.token,
		},
	})

	//
	// Renderlist actions
	//
	const deleteItem = async (id) => {
		const { pending, error, refresh } = await useFetch(`/sms/${id}`, {
			method: 'DELETE',
			headers: {
				authorization: auth.user.token,
			},
		})
	}

	const changeStatus = async ({ id, status }) => {
		const { pending, error, refresh } = await useFetch(`/sms/status`, {
			method: 'POST',
			headers: {
				authorization: auth.user.token,
			},
			body: { id, status },
		})
	}
</script>
