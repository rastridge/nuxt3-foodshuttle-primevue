<template>
	<div>
		<Head>
			<Title>News Items List</Title>
		</Head>
		<common-header title="News Items List" />

		<!-- Add Button -->
		<div class="text-center m-5">
			<Button
				class="p-button-sm"
				label="Add News Item"
				@click="navigateTo('/admin/news/add')"
			>
			</Button>
		</div>

		<span v-if="error" class="text-danger">ERROR: {{ error }}</span>

		<!--Select year -->
		<div class="text-center m-5">
			<select-year :startyear="startyear" @submitted="onSubmit" class="mb-3" />
			<p class="text-2xl">{{ year }}</p>
		</div>

		<render-list
			:data="filteredData"
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
	// Initialize values for Renderlist and Select Year
	//

	const { getAccess } = useRenderListAccess()
	const app = 'news'
	const { editable, addable, deleteable, statusable, viewable } = getAccess(app)

	const startyear = ref(2020)
	const { $dayjs } = useNuxtApp()
	let year = ref(parseInt($dayjs().format('YYYY')))

	//
	// Get all news
	//
	const {
		data: news,
		pending,
		error,
		refresh,
	} = await useFetch('/news/getall', {
		initialCache: false,
		method: 'get',
		headers: {
			authorization: auth.user.token,
		},
	})
	//
	// Select year action
	//
	const onSubmit = function (value) {
		// console.log('in onSubmit value = ', value)
		year.value = value
	}

	const filteredData = computed(() => {
		return news.value.filter((d) => {
			return parseInt($dayjs(d.dt).format('YYYY')) === year.value
		})
	})

	//
	// Renderlist actions
	//
	const deleteItem = async (id) => {
		const { pending, error, refresh } = await useFetch(`/news/${id}`, {
			method: 'DELETE',
			headers: {
				authorization: auth.user.token,
			},
		})
	}

	const changeStatus = async ({ id, status }) => {
		const { pending, error, refresh } = await useFetch(`/news/status`, {
			method: 'POST',
			headers: {
				authorization: auth.user.token,
			},
			body: { id, status },
		})
	}
</script>
