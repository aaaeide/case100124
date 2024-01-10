<script lang="ts">
// on mount, fetch categories from /api/categories
// and set them to $categories
import { onMount } from 'svelte';
import type { Category, Product } from '$lib/types';

let categories: Category[] = [];
// map of product id to product
let products: Product[] = [];

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
				products = [...products, product];
				seen_products.add(product.id);
			}
		});

		return {
			...category,
			product_ids: categoryProducts.map((product) => product.id)
		};
	});

	categories = await Promise.all(promises);
});

function getProductById(id: number): Product {
	const product = products.find((product) => product.id === id);
	if (!product) throw new Error(`Product ${id} not found`);
	return product;
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