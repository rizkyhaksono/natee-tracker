<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';
	import Footer from '../components/footer.svelte';
	import Header from '../components/header.svelte';

	let { children } = $props();
</script>

<div class="app">
	<Header />
	<ModeWatcher />
	<main>
		{@render children()}
	</main>
	<Footer />
</div>
