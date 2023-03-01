<template>
	<div class="container py-4">
		<div class="grid">
			<div class="h-100 p-5 text-center text-white bg-dark rounded-5">
				<p>statusMessage <br />{{ error.statusMessage }}</p>
				<p>statusCode <br />{{ error.statusCode }}</p>
				<button class="p-button-sm" @click="handleError">Clear errors</button>
			</div>
		</div>
	</div>
</template>

<script setup>
	defineProps(['error'])
	const handleError = () => clearError({ redirect: '/' })
</script>
