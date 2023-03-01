<template>
	<div>
		<h5>Default</h5>
		<p>{{ value1 }}</p>
		<Editor v-model="value1" editorStyle="height: 320px" />
	</div>
</template>

<script setup>
	import Editor from 'primevue/editor'
	const value1 = ref(
		'<div>Welcome to PrimeVue <b>Editor</b></div><div><br></div>'
	)
</script>
