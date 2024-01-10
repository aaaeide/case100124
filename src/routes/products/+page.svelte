<script lang="ts">
// on mount, fetch categories from /api/categories
// and set them to $categories
import { onMount } from 'svelte';
import type { Category, Product, Rating } from '$lib/types';

let categories: Category[] = [];
let products: Product[] = [];
let ratings: Rating[] = [];

onMount(async () => {
	// fetch categories
	const res = await fetch('/api/categories');
	categories = await res.json();

	const seen_products = new Set<number>();

	// fetch products for each category
	const promises: Promise<Category>[] = categories.map(async (category) => {
		const res = await fetch(`/api/products?category_id=${category.id}`);
		const categoryProducts = (await res.json()) as Product[];

		categoryProducts.forEach((product) => {
			if (!seen_products.has(product.id)) {
				products = [...products, {...product, rating: -1}];
				seen_products.add(product.id);
			}
		});

		return {
			...category,
			product_ids: categoryProducts.map((product) => product.id)
		};
	});

	categories = await Promise.all(promises);

	// fetch ratings
	const ratingsResponse = await fetch('/api/ratings');
	ratings = await ratingsResponse.json();
	console.log(ratings);
});

$: if (ratings) {
	products = products.map((product) => {
		const rating = getRatingByProductId(product.id);
		return {
			...product,
			rating: rating.rating
		};
	});
}

function getProductById(id: number): Product {
	const product = products.find((product) => product.id === id);
	if (!product) throw new Error(`Product ${id} not found`);
	return product;
}

function getRatingByProductId(id: number): Rating {
	const rating = ratings.find((rating) => rating.productId === id);
	if (!rating) return { productId: id, rating: -1 };
	return rating;
}

</script>


<svelte:head>
	<title>Products page</title>
	<meta name="description" content="Available products" />
</svelte:head>

<h1>Products</h1>

{#each categories as category}
	<h2>{category.title}</h2>
	{#if category.product_ids === undefined || category.product_ids.length === 0}
		<p>No products in this category</p>
	{:else}
	<ul class="product-list">
		{#each category.product_ids as productId}
			<li>
				<img src={getProductById(productId).image} alt="" />
				<h3>
					{getProductById(productId).title}
				</h3>
				<p>
					Rating: {getProductById(productId).rating}
				</p>
			</li>
		{/each}
	</ul>
	{/if}
{/each}

<style>
	.product-list {
		display: flex;
		flex-wrap: wrap;
	}

	.product-list li {
		width: 200px;
		background-color: white;

        flex: 1 0 auto;
        margin-right: 10px;

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		flex-grow: 0;

		margin: 10px;
		padding: 10px;
		border-radius: 10px;

		color: black
		}

	.product-list li img {
		width: 50px;
		height: 50px;
		border-radius: 50%;
	}
</style>