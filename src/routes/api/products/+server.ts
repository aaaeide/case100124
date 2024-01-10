import { API_URL } from '$env/static/private';

export async function GET(req: Request): Promise<Response> {
	const url = req.url;
	// @ts-expect-error - TS doesn't get what's going on here for some reason
	const query = new URLSearchParams(url.search);
	const category_id = query.get('category_id');

	const headers: HeadersInit = new Headers();
	headers.set('accept', 'application/json');

	if (category_id === null) {
		// fetch all products
		const response = await fetch(`${API_URL}/products`, {
			method: 'GET',
			headers: headers
		});

		const json = await response.json();

		return new Response(JSON.stringify(json), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	// fetch products by category
	const response = await fetch(`${API_URL}/product_categories/${category_id}/products`, {
		method: 'GET',
		headers: headers
	});

	const json = await response.json();

	return new Response(JSON.stringify(json), {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	});
}
