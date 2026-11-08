export type PreferredColorScheme = 'light' | 'dark';
export const themePreferenceCookie = 'snowui_theme';
export const themePreferenceMaxAge = 365 * 24 * 60 * 60;
const changeEvent = 'snowui:color-scheme';

function savedPreference(): { scheme: PreferredColorScheme; expires: number } | null {
	const value = document.cookie.split('; ').find((part) => part.startsWith(`${themePreferenceCookie}=`))?.slice(themePreferenceCookie.length + 1);
	if (!value) return null;
	const [scheme, expiration] = value.split('.');
	const expires = Number(expiration);
	return (scheme === 'light' || scheme === 'dark') && Number.isFinite(expires) && expires > Date.now()
		? { scheme, expires } : null;
}

export function saveColorSchemePreference(scheme: PreferredColorScheme) {
	const expires = Date.now() + themePreferenceMaxAge * 1000;
	document.cookie = `${themePreferenceCookie}=${scheme}.${expires}; Path=/; Max-Age=${themePreferenceMaxAge}; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
	window.dispatchEvent(new CustomEvent(changeEvent));
}

export function observeColorSchemePreference(update: (scheme: PreferredColorScheme) => void) {
	const media = window.matchMedia('(prefers-color-scheme: dark)');
	let timer: ReturnType<typeof setTimeout> | undefined;
	function scheduleExpiration() {
		clearTimeout(timer);
		const preference = savedPreference();
		if (preference) timer = setTimeout(refresh, Math.min(preference.expires - Date.now(), 2_147_483_647));
	}
	function refresh() {
		const preference = savedPreference();
		update(preference?.scheme ?? (media.matches ? 'dark' : 'light'));
		scheduleExpiration();
	}
	function resume() { if (document.visibilityState === 'visible') refresh(); }
	media.addEventListener('change', refresh);
	window.addEventListener(changeEvent, refresh);
	window.addEventListener('focus', refresh);
	document.addEventListener('visibilitychange', resume);
	refresh();
	return () => {
		clearTimeout(timer);
		media.removeEventListener('change', refresh);
		window.removeEventListener(changeEvent, refresh);
		window.removeEventListener('focus', refresh);
		document.removeEventListener('visibilitychange', resume);
	};
}
