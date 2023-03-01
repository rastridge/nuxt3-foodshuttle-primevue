<template>
	<div class="container">
		<Galleria
			:value="imageArray"
			containerStyle="max-width: 640px"
			:showThumbnails="false"
			:showIndicators="false"
			:circular="true"
			:autoPlay="true"
			:transitionInterval="3000"
		>
			<template #item="slotProps">
				<img :src="slotProps.item.itemImageSrc" :alt="slotProps.item.alt" />
			</template>
			<template #thumbnail="slotProps">
				<img
					:src="slotProps.item.thumbnailImageSrc"
					:alt="slotProps.item.alt"
				/>
			</template>
			<template #caption="{ item }">
				<h4 style="margin-bottom: 1rem">{{ item.title }}</h4>
			</template>
		</Galleria>
	</div>
</template>

<script setup>
	import Galleria from 'primevue/galleria'

	//
	// Get gallery photos
	//
	const imageArray = ref([])

	const {
		data: images,
		pending,
		error,
		refresh,
	} = await useFetch('/images/getgallery', {
		headers: {
			authorization: 'not-needed',
		},
	})

	images.value.forEach((i) => {
		imageArray.value.push({
			itemImageSrc: i.url,
			alt: i.alt,
			title: i.title,
		})
	})
</script>

<style>
	.container {
		margin: 0 auto;
		min-height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		text-align: center;
		max-width: 1180px;
	}

	.container img {
		display: block;
		height: auto;
		max-width: 100%;
		object-fit: contain;
		margin-top: 4rem;
	}
</style>
