<?php

namespace App\Controller;

use App\GraphQL\Resolvers\OrderResolver;
use GraphQL\GraphQL as GraphQLBase;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Schema;
use GraphQL\Type\SchemaConfig;
use App\GraphQL\Resolvers\ProductResolver;
use App\GraphQL\TypeRegistry;
use RuntimeException;
use Throwable;

class GraphQL
{
    static public function handle()
    {
        try {
            $productResolver = new ProductResolver();
            $orderResolver = new OrderResolver();

            $queryType = new ObjectType([
                'name' => 'Query',
                'fields' => [
                    'productById' => [
                        'type' => Type::nonNull(TypeRegistry::product()),
                        'args' => [
                            'id' => ['type' => Type::nonNull(Type::string())],
                        ],
                        'resolve' => function ($root, $args) use ($productResolver) {
                            $product = $productResolver->getProductById($root, $args);
                            return $product;
                        },
                    ],

                    'productsByCategory' => [
                        'type' => Type::listOf(TypeRegistry::product()),
                        'args' => [
                            'categoryName' => ['type' => Type::string()],
                        ],
                        'resolve' => function ($root, $args) use ($productResolver) {
                            $products = $productResolver->getProductsByCategory($root, $args);
                            return $products;
                        },
                    ],
                ],
            ]);

            $mutationType = new ObjectType([
                'name' => 'Mutation',
                'fields' => [
                    'createOrder' => [
                        'type' => TypeRegistry::order(),
                        'args' => [
                            'total' => ['type' => Type::nonNull(Type::float())],
                            'items' => [
                                'type' => Type::nonNull(Type::listOf(Type::nonNull(TypeRegistry::orderInput())))
                            ],
                        ],
                        'resolve' => function ($root, $args) use ($orderResolver) {
                            $total = $args['total'];
                            $items = $args['items'];

                            $orderId = $orderResolver->createOrder($total, $items);

                            return [
                                'id' => $orderId,
                                'total' => $total,
                            ];
                        },
                    ]
                ],
            ]);

            $schema = new Schema(
                (new SchemaConfig())
                    ->setQuery($queryType)
                    ->setMutation($mutationType)
            );

            $rawInput = file_get_contents('php://input');
            if ($rawInput === false) {
                throw new RuntimeException('Failed to get php://input');
            }

            $input = json_decode($rawInput, true);
            $query = $input['query'];
            $variableValues = $input['variables'] ?? null;

            $rootValue = ['prefix' => 'You said: '];
            $result = GraphQLBase::executeQuery($schema, $query, $rootValue, null, $variableValues);
            $output = $result->toArray();
        } catch (Throwable $e) {
            $output = [
                'error' => [
                    'message' => $e->getMessage(),
                ],
            ];
        }

        header('Content-Type: application/json; charset=UTF-8');
        return json_encode($output);
    }
}
