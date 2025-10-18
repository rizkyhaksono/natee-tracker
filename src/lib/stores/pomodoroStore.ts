import { writable } from 'svelte/store';
import { getAuthHeaders } from '$lib/auth/helpers';

interface PomodoroState {
	isRunning: boolean;
	isBreak: boolean;
	minutes: number;
	seconds: number;
	workDuration: number;
	breakDuration: number;
	sessionsCompleted: number;
	lastReset: string | null;
}

const defaultState: PomodoroState = {
	isRunning: false,
	isBreak: false,
	minutes: 25,
	seconds: 0,
	workDuration: 25,
	breakDuration: 5,
	sessionsCompleted: 0,
	lastReset: null,
};

const createPomodoroStore = () => {
	const { subscribe, set, update } = writable<PomodoroState>(defaultState);
	let timer: ReturnType<typeof setInterval> | null = null;

	const clearTimer = () => {
		if (timer) {
			clearInterval(timer);
			timer = null;
		}
	};

	const saveSession = async (sessionsCompleted: number, workDuration: number, breakDuration: number) => {
		try {
			await fetch('/api/pomodoro', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					...getAuthHeaders(),
				},
				body: JSON.stringify({
					focus_minutes: workDuration,
					break_minutes: breakDuration,
					completed_sessions: sessionsCompleted,
				}),
			});
		} catch (error) {
			console.error('Error saving pomodoro session:', error);
		}
	};

	const tick = () => {
		update((state) => {
			if (state.seconds === 0) {
				if (state.minutes === 0) {
					// Timer completed
					clearTimer();
					const isBreak = !state.isBreak;
					const newSessionsCompleted = isBreak ? state.sessionsCompleted + 1 : state.sessionsCompleted;

					// Save session to backend when work session completes
					if (isBreak) {
						saveSession(newSessionsCompleted, state.workDuration, state.breakDuration);
					}

					return {
						...state,
						isRunning: false,
						isBreak,
						minutes: isBreak ? state.breakDuration : state.workDuration,
						seconds: 0,
						sessionsCompleted: newSessionsCompleted,
						lastReset: new Date().toISOString(),
					};
				} else {
					return { ...state, minutes: state.minutes - 1, seconds: 59 };
				}
			} else {
				return { ...state, seconds: state.seconds - 1 };
			}
		});
	};

	return {
		subscribe,
		start: () => {
			update((state) => {
				if (state.isRunning) return state;
				timer = setInterval(tick, 1000);
				return { ...state, isRunning: true };
			});
		},
		pause: () => {
			clearTimer();
			update((state) => ({ ...state, isRunning: false }));
		},
		reset: () => {
			clearTimer();
			set(defaultState);
		},
		setWorkDuration: (minutes: number) => {
			update((state) => ({
				...state,
				workDuration: minutes,
				minutes: state.isBreak ? state.minutes : minutes,
			}));
		},
		setBreakDuration: (minutes: number) => {
			update((state) => ({
				...state,
				breakDuration: minutes,
				minutes: state.isBreak ? minutes : state.minutes,
			}));
		},
	};
};

export const pomodoroStore = createPomodoroStore();
