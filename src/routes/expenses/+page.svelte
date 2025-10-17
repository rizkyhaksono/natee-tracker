<script lang="ts">
	import { fade } from 'svelte/transition';
</script>

<div class="container mx-auto px-4 py-8" in:fade={{ duration: 200 }}>
	<div class="mb-12 text-center">
		<h1 class="text-4xl font-extrabold tracking-tight lg:text-5xl">Expenses</h1>
		<p class="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">Expenses page</p>
	</div>
</div>
