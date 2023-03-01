<template>
	<div>
		<Head>
			<Title>Images List</Title>
		</Head>
		<common-header title="Images List" />

		<!-- Add Button -->
		<div class="text-center m-5">
			<Button
				class="p-button-sm"
				label="Add image"
				@click="navigateTo('/admin/images/add')"
			>
			</Button>
		</div>

		<span v-if="error" class="text-danger">ERROR: {{ error }}</span>

		<render-list
			:data="images_data"
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
	const app = 'images'
	const { editable, addable, deleteable, statusable, viewable } = getAccess(app)

	//
	// Get all images
	//
	const {
		data: images_data,
		pending,
		error,
		refresh,
	} = await useFetch('/images/getall', {
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
		const { pending, error, refresh } = await useFetch(`/images/${id}`, {
			method: 'DELETE',
			headers: {
				authorization: auth.user.token,
			},
		})
	}

	const changeStatus = async ({ id, status }) => {
		const { pending, error, refresh } = await useFetch(`/images/status`, {
			method: 'POST',
			headers: {
				authorization: auth.user.token,
			},
			body: { id, status },
		})
	}
</script>
