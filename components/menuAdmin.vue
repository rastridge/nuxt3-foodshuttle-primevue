<template>
	<!-- <div v-if="alert.message" :class="`alert ${alert.type}`">
		{{ alert.message }}
	</div>
	<div v-else> -->
	<nav class="fixed-top">
		<Menubar :model="items" class="p-menubar"> </Menubar>
	</nav>
	<!-- </div> -->
</template>

<script setup>
	import Menubar from 'primevue/menubar'
	// import { useAlertStore } from '~~/stores/alertStore'
	import { useAuthStore } from '~~/stores/authStore'
	// const alert = useAlertStore()
	const auth = useAuthStore()

	const checkPerm = (app) => {
		// const user = JSON.parse(sessionStorage.getItem('auth'))
		const user = auth.user
		const temp = user.perms
		const perms = temp.find(function (u) {
			return u.admin_app_name === app
		})
		return perms.admin_perm
	}

	const items = ref([
		{
			label: 'Admin Home',
			icon: 'pi pi-fw pi-bookmark',
			to: '/admin',
			visible: () => checkPerm('accounts') > 0,
		},
		{
			label: 'Accounts',
			icon: 'pi pi-fw pi-bookmark',
			to: '/admin/accounts',
			visible: () => checkPerm('accounts') > 0,
		},
		{
			label: 'Users',
			icon: 'pi pi-fw pi-user',
			to: '/admin/users',
			visible: () => checkPerm('users') > 0,
		},
		{
			label: 'News',
			icon: 'pi pi-fw pi-bookmark',
			to: '/admin/news',
			visible: () => checkPerm('news') > 0,
		},
		{
			label: 'Newsletters',
			icon: 'pi pi-fw pi-bookmark',
			to: '/admin/newsletters',
			visible: () => checkPerm('newsletters') > 0,
		},
		{
			label: 'Custom pages',
			icon: 'pi pi-fw pi-bookmark',
			to: '/admin/content',
			visible: () => checkPerm('content') > 0,
		},
		{
			label: 'Images',
			icon: 'pi pi-fw pi-bookmark',
			to: '/admin/images',
			visible: () => checkPerm('images') > 0,
		},
		{
			label: 'SMS',
			icon: 'pi pi-fw pi-bookmark',
			to: '/admin/sms',
			visible: () => checkPerm('sms') > 0,
		},
		{
			label: 'Logout',
			icon: 'pi pi-fw pi-power-off',
			to: '/logout',
		},
	])
</script>

<style>
	.p-menubar {
		justify-content: center;
	}
</style>
