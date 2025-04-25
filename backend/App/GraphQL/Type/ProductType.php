<?php

namespace App\GraphQL\Type;

use App\GraphQL\TypeRegistry;
use App\Models\Attribute;
use App\Models\Category;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

class ProductType extends ObjectType
{
    public function __construct()
    {
        parent::__construct([
            'name' => 'FlatProduct',
            'fields' => [
                'id' => Type::nonNull(Type::string()),
                'name' => Type::nonNull(Type::string()),
                'inStock' => Type::nonNull(Type::boolean()),
                'brand' => Type::string(),
                'description' => Type::string(),
                'gallery' => [
                    'type' => Type::listOf(Type::string()),
                    'resolve' => function ($product) {
                        $raw = $product->gallery ?? '[]';

                        $decoded = json_decode($raw, true);

                        return is_array($decoded) ? $decoded : [];
                    },
                ],
                'prices' => [
                    'type' => Type::listOf(TypeRegistry::price()),
                    'resolve' => function ($product) {

                        $raw = $product->prices ?? '[]';

                        $decoded = json_decode($raw, true);

                        return is_array($decoded) ? $decoded : [];
                    },
                ],
                'attributes' => [
                    'type' => Type::listOf(TypeRegistry::attribute()),
                    'resolve' => function ($product) {
                        return Attribute::forProductId($product->id);
                    }
                ],
                'category' => [
                    'type' => TypeRegistry::category(),
                    'resolve' => function ($product) {
                        return Category::find($product->category_id);
                    },
                ],
            ],
        ]);
    }
}
