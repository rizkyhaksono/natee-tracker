import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
  // Auth is now handled client-side with encrypted localStorage
  return {
    session: null,
    user: null,
  };
};
