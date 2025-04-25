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
            DROP TABLE IF EXISTS Attributes;
            DROP TABLE IF EXISTS Products;
            DROP TABLE IF EXISTS Categories;
            SET FOREIGN_KEY_CHECKS = 1;
        ");
        echo "Tables dropped successfully!\n";
    }

    echo "Creating tables...\n";

    $sql = "
        CREATE TABLE IF NOT EXISTS Categories (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) UNIQUE NOT NULL
        ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

        CREATE TABLE IF NOT EXISTS Products (
            id VARCHAR(255) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            category_id INT NOT NULL,
            brand VARCHAR(255),
            inStock BOOLEAN DEFAULT TRUE,
            gallery JSON NOT NULL,
            prices JSON NOT NULL,
            FOREIGN KEY (category_id) REFERENCES Categories(id) ON DELETE CASCADE
        ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

        CREATE TABLE IF NOT EXISTS Attributes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            product_id VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            type ENUM('text', 'swatch') NOT NULL,
            `values` JSON NOT NULL, -- Fixed by adding backticks around `values`
            FOREIGN KEY (product_id) REFERENCES Products(id) ON DELETE CASCADE
        ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    ";

    $pdo->exec($sql);
    echo "Tables created successfully!\n";
} catch (PDOException $e) {
    die("Error: " . $e->getMessage());
}
