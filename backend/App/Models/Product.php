<?php

namespace App\Models;

use App\Database\Database;
use PDO;

class Product extends BaseModel
{
    protected static string $table = 'products';

    public static function getById(string $id): ?array
    {
        $db = Database::getInstance();
        $stmt = $db->prepare("SELECT * FROM products WHERE id = :id");
        $stmt->execute(['id' => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public static function getProductsByCategory($_, array $args): ?array
    {
        try {
            $db = Database::getInstance();

            if (empty($args['categoryName'])) {
                $stmt = $db->query("SELECT * FROM products");
                $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

                if ($products === false) {
                    throw new \Exception("Failed to fetch all products.");
                }

                return $products ?: [];
            }

            $stmt = $db->prepare("SELECT id FROM categories WHERE name = :category_name");
            $stmt->execute(['category_name' => $args['categoryName']]);
            $category = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$category) {
                throw new \Exception("Category not found.");
            }

            $stmt = $db->prepare("SELECT * FROM products WHERE category_id = :category_id");
            $stmt->execute(['category_id' => $category['id']]);
            $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if ($products === false) {
                throw new \Exception("Failed to fetch products by category.");
            }

            return $products ?: [];
        } catch (\PDOException $e) {
            error_log("Database error in getProductsByCategory: " . $e->getMessage());
            throw new \Exception("Failed to fetch products.");
        }
    }

    public function getAttributes(): array
    {
        $pdo = Database::getInstance();

        $stmt = $pdo->prepare("SELECT * FROM attributes WHERE product_id = :product_id");
        $stmt->execute(['product_id' => $this['id']]);
        $attributes = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($attributes as &$attr) {
            $attr['items'] = json_decode($attr['values'], true);
            unset($attr['values']);
        }

        return $attributes;
    }
}
