<script lang="ts">
	import { pomodoroStore } from '$lib/stores/pomodoroStore';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Play, Pause, RotateCcw } from '@lucide/svelte';

	function formatTime(minutes: number, seconds: number) {
		return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
	}
</script>

<div class="container mx-auto max-w-2xl space-y-6 px-4 py-6">
	<h1 class="text-center text-2xl font-bold">Pomodoro Timer</h1>

	<Card.Root>
		<Card.Content class="p-6 sm:p-8">
			<div class="text-center">
				<div class="mb-4 text-sm font-medium text-muted-foreground">
					{$pomodoroStore.isBreak ? 'Break Time' : 'Focus Time'}
				</div>
				<div class="mb-6 text-6xl font-bold tabular-nums sm:text-7xl">
					{formatTime($pomodoroStore.minutes, $pomodoroStore.seconds)}
				</div>
				<div class="mb-4 text-sm text-muted-foreground">
					Sessions Completed: {$pomodoroStore.sessionsCompleted}
				</div>
				<div class="flex justify-center gap-2">
					{#if !$pomodoroStore.isRunning}
						<Button onclick={() => pomodoroStore.start()}>
							<Play class="mr-2 h-4 w-4" />
							Start
						</Button>
					{:else}
						<Button onclick={() => pomodoroStore.pause()}>
							<Pause class="mr-2 h-4 w-4" />
							Pause
						</Button>
					{/if}
					<Button variant="outline" onclick={() => pomodoroStore.reset()}>
						<RotateCcw class="mr-2 h-4 w-4" />
						Reset
					</Button>
				</div>
			</div>
		</Card.Content>
	</Card.Root>
</div>
