<?php

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/../bootstrap.php';

use App\Database\Database;

try {
    $pdo = Database::getInstance();

    $fresh = in_array('fresh', $argv);

    if ($fresh) {
        echo "Dropping tables...\n";
        $pdo->exec("
            SET FOREIGN_KEY_CHECKS = 0;
            DROP TABLE IF EXISTS order_products;
            DROP TABLE IF EXISTS orders;
            SET FOREIGN_KEY_CHECKS = 1;
        ");
        echo "Tables dropped successfully!\n";
    }

    echo "Creating tables...\n";

    $sql = "
         CREATE TABLE IF NOT EXISTS orders (
            id INT AUTO_INCREMENT PRIMARY KEY,
            total DECIMAL(10, 2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

        CREATE TABLE IF NOT EXISTS order_products (
            id INT AUTO_INCREMENT PRIMARY KEY,
            order_id INT NOT NULL,
            product_id VARCHAR(255) NOT NULL,
            quantity INT NOT NULL,
            selectedAttributes JSON NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    ";

    $pdo->exec($sql);
    echo "Tables created successfully!\n";
} catch (PDOException $e) {
    die("Error: " . $e->getMessage());
}
