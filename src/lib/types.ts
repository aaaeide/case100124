export interface Category {
	id: number;
	title: string;
	product_ids: number[];
}

export interface Product {
	id: number;
	title: string;
	image: string;
	description: string;
}
