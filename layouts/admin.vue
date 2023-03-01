<template>
	<header>
		<menu-admin />
	</header>

	<!-- spacer to avoid header -->
	<div class="p-0 mt-3 bg-transparent" style="height: 30px"></div>

	<div class="content">
		<slot />
	</div>
</template>

<script setup>
	import { useAlertStore } from '~~/stores/alertStore'
	const alert = useAlertStore()
	useHead({
		bodyAttrs: { class: 'admin_body_background_color' },
	})
</script>

<style>
	@import '@/assets/css/admin.css';
</style>
