<template>
	<div>
		<!-- <div class="card"> -->
		<Common-header :title="content_data.content_name" />
		<span v-html="content_data.content_body"></span>
	</div>
</template>

<script setup>
	//
	// Get content item id
	//
	const route = useRoute()
	const content_id = ref(route.params.id)
	console.log('route.params.id = ', content_id.value)
	//
	// Get custom page
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
	// make image respond to width
	content_data.value.content_body = content_data.value.content_body.replace(
		/img/g,
		'img width="100%"'
	)
</script>
