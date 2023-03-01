<template>
	<div>
		<p>Cloudinary upload</p>
		<upload-widget @uploaded="uploaded" />
		Image
		<div v-if="imageUrl">
			<img :src="imageUrl" />
		</div>
	</div>
</template>

<script setup>
	const imageUrl = ref('')
	const uploaded = (url) => (imageUrl.value = url)
	console.log('IN upload image url: ', imageUrl.value)
</script>
