import type { Handle } from '@sveltejs/kit';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { sequence } from '@sveltejs/kit/hooks';

const handleParaglide: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request, locale }) => {
		event.request = request;

		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale)
		});
	});

const handleAuth: Handle = async ({ event, resolve }) => {
	// Auth is now handled client-side with localStorage
	// Server doesn't need to manage auth state
	event.locals.session = null;
	event.locals.user = null;

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range';
		},
	});
};

export const handle: Handle = sequence(handleAuth, handleParaglide);
