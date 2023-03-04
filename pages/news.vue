<template>
	<div>
		<!-- <div class="card"> -->
		<Common-header title="Current News" />
		<div
			class="flex flex-wrap card-container align-items-center justify-content-center"
		>
			<Card
				v-for="item in news"
				:key="item.news_id"
				class="mycard shadow-7 m-2 p-2 cursor-pointer"
			>
				<template #title>
					<!-- Adjust for local time and Format for Primevue calendar -->
					<span class="text-sm">
						{{ $dayjs(item.dt).format('MMM D, YYYY HH:mm a') }} </span
					><br />
					{{ item.news_title }}
				</template>
				<template #subtitle> {{ item.news_synop }} </template>

				<template #footer>
					<a href="#" @click.prevent="openModal(item)">Read More</a>
				</template>
			</Card>
			<!-- </div> -->
		</div>

		<!-- Modal -->
		<Dialog
			v-model:visible="displayModal"
			:breakpoints="{ '960px': '75vw', '640px': '90vw' }"
			:style="{ width: '60vw' }"
		>
			<template #header>
				<div class="my-dialog-header">
					<h3>{{ selectedItem.news_title }}</h3>
				</div></template
			>
			<div
				style="border: solid black thin"
				v-html="selectedItem.news_article"
			></div>

			<template #footer>
				<div class="my-dialog-footer">
					<Button
						label="Return"
						@click="closeModal"
						class="p-button-sm"
						autofocus
					/>
				</div>
			</template>
		</Dialog>
	</div>
</template>

<script setup>
	import Dialog from 'primevue/dialog'
	import Card from 'primevue/card'
	const { $dayjs } = useNuxtApp()
	//
	// Dialog initialization - display news item
	//
	const selectedItem = ref({})
	const displayModal = ref(false)
	const openModal = (item) => {
		displayModal.value = true
		// replace img with img width="100%"
		item.news_article = item.news_article.replace(/img/g, 'img width="100%"')

		selectedItem.value = item
	}
	const closeModal = () => {
		displayModal.value = false
	}
	//
	// Get current news
	//
	const {
		data: news,
		pending,
		error,
		refresh,
	} = await useFetch('/news/getallcurrent', {
		initialCache: false,
		method: 'get',
		headers: {
			authorization: 'not-needed',
		},
	})
</script>

<style>
	@import '~~/assets/css/quill-adjust.css';
	.p-dialog {
		background-color: gray;
	}
	.my-dialog-header {
		width: 100%;
		padding: 1rem;
		border-bottom: solid black thin;
	}
	.my-dialog-footer {
	}

	.mycard {
		min-width: 20rem;
		min-height: 100px;
		border-radius: 1rem;
		background-color: rgba(255, 255, 255, 0.4);
	}

	@media screen and (max-width: 640px) {
		.mycard {
			width: 100%;
		}
	}
	.confirmation-content {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	/* 
	.p-dialog .p-button {
		min-width: 6rem;
	} */
</style>
