<?php

namespace App\Models;

use App\Database\Database;
use PDO;

abstract class BaseModel
{
    protected static string $table;

    public static function getAll(): array
    {
        $db = Database::getInstance();
        $stmt = $db->query("SELECT * FROM " . static::$table);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public static function find($id): ?array
    {
        return static::where('id', $id);
    }

    public static function where(string $column, mixed $value): ?array
    {
        $db = Database::getInstance();
        $stmt = $db->prepare("SELECT * FROM " . static::$table . " WHERE {$column} = :value LIMIT 1");
        $stmt->execute(['value' => $value]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result ?: null;
    }

    public static function create(array $data): bool
    {
        $pdo = Database::getInstance();

        $columns = array_keys($data);
        $placeholders = array_map(fn($col) => ":$col", $columns);

        $quotedColumns = array_map(fn($col) => "`$col`", $columns);

        $sql = "INSERT INTO `" . static::$table . "` (" . implode(', ', $quotedColumns) . ") 
            VALUES (" . implode(', ', $placeholders) . ")";

        $stmt = $pdo->prepare($sql);

        return $stmt->execute($data);
    }
}
