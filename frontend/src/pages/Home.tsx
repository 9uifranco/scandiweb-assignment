import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { useCategories } from "../providers/CategoriesContext";
import { Product } from "../types";
import api from "../api/axios";

const GRAPHQL_ENDPOINT = "/graphql";

export default function Home() {
    const { selectedCategory } = useCategories();
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchProductsFromCategory = async () => {
            if (!selectedCategory) return;

            const categoryName = selectedCategory.name === 'all' ? null : selectedCategory.name;

            const query = `
            query GetProductsByCategory($categoryName: String) {
                productsByCategory(categoryName: $categoryName) {
                    id
                    name
                    inStock
                    description
                    gallery
                    brand
                    prices {
                        amount
                        currency {
                            label
                            symbol
                        }
                    }
                    attributes {
                        id
                        name
                        type
                        items {
                            id
                            value
                            displayValue
                        }
                    }
                }
            }`;

            try {
                const response = await api.post(
                    GRAPHQL_ENDPOINT,
                    {
                        query,
                        variables: { categoryName }
                    },
                    {
                        headers: { "Content-Type": "application/json" },
                    }
                );

                const fetchedProducts = response.data?.data?.productsByCategory;

                if (!fetchedProducts) {
                    alert("No products found for this category");
                    return;
                }

                setProducts(fetchedProducts);
            } catch (error) {
                console.error("GraphQL fetch error:", error);
                alert("Failed to fetch products");
            }
        };

        fetchProductsFromCategory();
    }, [selectedCategory]);

    return (
        <>
            <h1 className="text-3xl font-normal mt-8 capitalize">
                {selectedCategory?.name}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </>
    );
}
