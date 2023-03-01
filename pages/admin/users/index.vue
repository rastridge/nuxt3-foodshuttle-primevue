<template>
	<div>
		<Head>
			<Title>Admin Users List</Title>
		</Head>
		<common-header title="Users List" />

		<div class="text-center m-5">
			<Button
				class="p-button-sm"
				label="Add account"
				@click="navigateTo('/admin/users/add')"
			>
			</Button>
		</div>

		<render-list
			:data="users"
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

	//
	// Initialize values for Renderlist
	//
	const { getAccess } = useRenderListAccess()
	const app = 'users'
	const { editable, addable, deleteable, statusable, viewable } = getAccess(app)

	//
	// Get all users
	//
	const {
		data: users,
		pending,
		error,
		refresh,
	} = await useFetch('/users/getall', {
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
		const { pending, error, refresh } = await useFetch(`/users/${id}`, {
			method: 'delete',
			headers: {
				authorization: auth.user.token,
			},
		})
	}

	const changeStatus = async ({ id, status }) => {
		const { pending, error, refresh } = await useFetch(`/users/status`, {
			method: 'POST',
			headers: {
				authorization: auth.user.token,
			},
			body: { id, status },
		})
	}
</script>
