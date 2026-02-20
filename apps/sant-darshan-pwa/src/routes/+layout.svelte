<script lang="ts">
	import "../app.css";
	import { onMount } from "svelte";
	import { initUserStore } from "$lib/stores/user";
	import ToastContainer from "$lib/components/ui/ToastContainer.svelte";
	import BottomNavigation from "$lib/components/ui/BottomNavigation.svelte";
	import ReloadPrompt from "$lib/components/ReloadPrompt.svelte";

	let { children } = $props();

	onMount(() => {
		// Initialize Dexie stores on app boot
		initUserStore();
	});
</script>

<!-- Mobile-Only App Shell -->
<div class="app-container bg-surface text-gray-900 dark:text-white relative">
	<ToastContainer />

	<!-- Scrollable Content Area -->
	<main
		class="absolute inset-0 pb-[calc(64px+env(safe-area-inset-bottom))] overflow-y-auto overscroll-y-none"
	>
		{@render children()}
	</main>

	<!-- Global Navigation -->
	<BottomNavigation />
</div>
