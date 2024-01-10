import { API_URL } from '$env/static/private';

export async function GET(): Promise<Response> {
	const headers: HeadersInit = new Headers();
	headers.set('accept', 'application/json');

	const response = await fetch(`${API_URL}/ratings`, {
		method: 'GET',
		headers: headers
	});

	const json = await response.json();

	return new Response(JSON.stringify(json), {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	});
}
