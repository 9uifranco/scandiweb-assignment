<?php

namespace App\GraphQL\Type;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

class OrderType extends ObjectType
{
    public function __construct()
    {
        parent::__construct([
            'name' => 'Order',
            'fields' => [
                'id' => ['type' => Type::nonNull(Type::int())],
                'total' => ['type' => Type::nonNull(Type::float())],
                'created_at' => ['type' => Type::nonNull(Type::string())],
            ],
        ]);
    }
}
