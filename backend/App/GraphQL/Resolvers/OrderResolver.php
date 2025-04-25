<?php

namespace App\GraphQL\Resolvers;

use App\Models\Order;
use Exception;

class OrderResolver
{
    public function createOrder($total, $items)
    {
        try {
            $orderId = Order::createOrder($total, $items);
            return $orderId;
        } catch (Exception $e) {
            throw new Exception('Failed to create order: ' . $e->getMessage());
        }
    }
}
