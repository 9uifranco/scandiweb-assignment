<?php

namespace App\Models;

use App\Database\Database;
use Exception;

class Order extends BaseModel
{
    public static function createOrder($total, $items)
    {
        if (empty($total) || empty($items)) {
            throw new Exception('Total or items are missing');
        }

        $pdo = Database::getInstance();
        $pdo->beginTransaction();

        try {
            $stmt = $pdo->prepare("INSERT INTO orders (total) VALUES (:total)");
            $stmt->bindParam(':total', $total);
            $stmt->execute();

            $orderId = $pdo->lastInsertId();

            $stmt = $pdo->prepare("INSERT INTO order_products (order_id, product_id, quantity, selectedAttributes) 
                                   VALUES (:order_id, :product_id, :quantity, :selectedAttributes)");

            foreach ($items as $item) {
                $stmt->bindParam(':order_id', $orderId);
                $stmt->bindParam(':product_id', $item['productId']);
                $stmt->bindParam(':quantity', $item['quantity']);
                $stmt->bindParam(':selectedAttributes', $item['selectedAttributes']);
                $stmt->execute();
            }

            $pdo->commit();

            return $orderId;
        } catch (Exception $e) {
            $pdo->rollBack();
            throw new Exception('Failed to create order: ' . $e->getMessage());
        }
    }
}
