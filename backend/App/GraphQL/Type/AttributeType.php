<?php

namespace App\GraphQL\Type;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

class AttributeType extends ObjectType
{
    public function __construct()
    {
        parent::__construct([
            'name' => 'Attribute',
            'fields' => [
                'id' => Type::nonNull(Type::string()),
                'name' => Type::nonNull(Type::string()),
                'type' => Type::nonNull(Type::string()),
                'items' => [
                    'type' => Type::listOf(new AttributeItemType()),
                    'resolve' => function ($attribute) {

                        if (!isset($attribute['items']) || !is_array($attribute['items'])) {
                            return [];
                        }


                        return array_map(function ($item) {

                            return [
                                'id' => $item['value']['id'],
                                'displayValue' => $item['value']['displayValue'],
                                'value' => $item['value']['value'],
                            ];
                        }, $attribute['items']);
                    }
                ],
            ],
        ]);
    }
}
