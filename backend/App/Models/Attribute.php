<?php

namespace App\Models;

use App\Database\Database;
use PDO;

class Attribute extends BaseModel
{
    protected static string $table = 'attributes';

    public static function getByProductId(string $productId): array
    {
        $db = Database::getInstance();
        $stmt = $db->prepare("SELECT * FROM attributes WHERE product_id = :product_id");
        $stmt->execute(['product_id' => $productId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function forProductId(string $productId): array
    {
        $pdo = Database::getInstance();

        $stmt = $pdo->prepare("SELECT id, name, type, `values` FROM attributes WHERE product_id = ?");
        $stmt->execute([$productId]);

        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $attributes = [];

        foreach ($rows as $row) {
            $values = json_decode($row['values'], true);

            $items = array_map(function ($value, $index) {
                return [
                    'id' => (string) $index,
                    'value' => $value,
                    'displayValue' => $value,
                    '__typename' => 'Attribute',
                ];
            }, $values, array_keys($values));

            $attributes[] = [
                'id' => $row['name'],
                'name' => $row['name'],
                'type' => $row['type'],
                'items' => $items,
                '__typename' => 'AttributeSet',
            ];
        }

        return $attributes;
    }
}
