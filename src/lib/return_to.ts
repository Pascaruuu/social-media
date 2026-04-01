export function normalize_return_to(value: unknown, fallback = '/profile'): string {
	const raw = typeof value === 'string' ? value.trim() : String(value ?? '').trim()

	if (!raw) return fallback
	if (!raw.startsWith('/')) return fallback
	if (raw.startsWith('//')) return fallback

	return raw
}
