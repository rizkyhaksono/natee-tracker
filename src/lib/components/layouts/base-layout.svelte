<script lang="ts">
	import Navbar from './navbar.svelte';
	import Footer from './footer.svelte';

	let { children } = $props<{ children: any }>();
</script>

<div class="flex min-h-screen flex-col">
	<Navbar />
	<main class="container mx-auto flex">
		{@render children()}
	</main>
	<Footer />
</div>
