<template>
	<div class="text-center m-5 text-xl">
		<b>Good bye</b>
	</div>
</template>

<script setup>
	import { useAuthStore } from '~~/stores/authStore'
	const auth = useAuthStore()
	auth.logout()
</script>
