<?php

namespace App\GraphQL\Resolvers;

use App\Models\Product;

class ProductResolver
{
    public function getProductById($root, $args)
    {
        $product = Product::getById($args['id']);

        return (object) $product;

        throw new \Exception("Product not found");
    }

    public function getProductsByCategory($_, array $args)
    {
        try {
            $productsArray = Product::getProductsByCategory($_, $args);

            if (empty($productsArray)) {
                throw new \Exception("No products found for this category");
            }

            return array_map(fn($item) => (object) $item, $productsArray);
        } catch (\Throwable $e) {
            throw new \Exception("Error in resolver: " . $e->getMessage());
        }
    }
}
