<script lang="ts">
	import Navbar from './navbar.svelte';
	import Footer from './footer.svelte';

	let { children, user = null } = $props<{ children: any; user?: any }>();
</script>

<div class="flex min-h-screen flex-col">
	<Navbar {user} />
	<main class="container mx-auto flex">
		{@render children()}
	</main>
	<Footer />
</div>
