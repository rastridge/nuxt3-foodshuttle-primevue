<template>
	<header>
		<menu-standard />
	</header>

	<!-- spacer -->
	<div class="p-0 mt-3 bg-transparent" style="height: 30px"></div>

	<div class="content">
		<slot />
	</div>
	<footer>
		<footer />
	</footer>
</template>

<script setup>
	useHead({
		bodyAttrs: { class: 'body_background_color' },
	})
</script>

<style>
	@import '@/assets/css/main.css';
</style>
