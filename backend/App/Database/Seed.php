<?php

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../bootstrap.php';
require_once __DIR__ . '/../Models/Category.php';
require_once __DIR__ . '/../Models/Product.php';
require_once __DIR__ . '/../Models/Attribute.php';
require_once __DIR__ . '/../Database/Database.php';

use App\Models\Category;
use App\Models\Product;
use App\Models\Attribute;
use App\Database\Database;

$jsonData = file_get_contents(__DIR__ . '/../../data.json');
$data = json_decode($jsonData, true);

if (!$data) {
    die("Error: Failed to load JSON data.\n");
}

try {
    $pdo = Database::getInstance();
    $pdo->beginTransaction();

    $data = $data['data'];

    foreach ($data['categories'] as $category) {
        $existingCategory = Category::where('name', $category['name']);

        if (!$existingCategory) {
            Category::create([
                'name' => $category['name']
            ]);
        }
    }

    $categoryIds = [];
    $categoriesInDb = Category::getAll();

    foreach ($categoriesInDb as $cat) {
        $categoryIds[$cat['name']] = $cat['id'];
    }

    if (empty($categoryIds)) {
        die("Error: No categories found after insertion.\n");
    }

    echo "Categories seeded successfully!\n";

    foreach ($data['products'] as $product) {
        if (!isset($categoryIds[$product['category']])) {
            die("Error: Category '{$product['category']}' for product '{$product['name']}' not found.\n");
        }

        $productData = [
            'id' => $product['id'],
            'name' => $product['name'],
            'description' => mb_convert_encoding($product['description'], 'UTF-8', 'auto'),
            'category_id' => $categoryIds[$product['category']],
            'brand' => $product['brand'] ?? null,
            'inStock' => isset($product['inStock']) ? ($product['inStock'] ? 1 : 0) : 1,
            'gallery' => json_encode($product['gallery']),
            'prices' => json_encode($product['prices'])
        ];

        Product::create($productData);
        $productId = $product['id'];

        foreach ($product['attributes'] as $attribute) {
            $attributeValues = [];
            foreach ($attribute['items'] as $item) {
                $attributeValues[] = [
                    'displayValue' => $item['displayValue'],
                    'value' => $item['value'],
                    'id' => $item['id'],
                ];
            }

            Attribute::create([
                'product_id' => $productId,
                'name' => $attribute['name'],
                'type' => $attribute['type'],
                'values' => json_encode($attributeValues),
            ]);
        }
    }

    $pdo->commit();
    echo "Data inserted successfully from JSON!\n";
} catch (PDOException $e) {
    $pdo->rollBack();
    die("Error: " . $e->getMessage());
}
