<template>
	<div>
		<Common-header :title="content_data.content_name" />
		<span v-html="content_data.content_body"></span>
	</div>
</template>

<script setup>
	//
	// Get content id parameter
	//
	const route = useRoute()
	const content_id = ref(route.params.id)
	//
	// Get custom page content
	//
	const {
		data: content_data,
		pending,
		error,
		refresh,
	} = await useFetch(`/content/${content_id.value}`, {
		initialCache: false,
		method: 'get',
		headers: {
			authorization: 'not-needed',
		},
	})
	//
	// make any images expand to width of container
	//
	content_data.value.content_body = content_data.value.content_body.replace(
		/img/g,
		'img width="100%"'
	)
</script>

<style>
	@import '~~/assets/css/quill-adjust.css';
</style>
