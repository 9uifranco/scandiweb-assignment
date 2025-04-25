<?php

namespace App\GraphQL;

use App\GraphQL\Type\AttributeItemType;
use App\GraphQL\Type\AttributeType;
use App\GraphQL\Type\CategoryType;
use App\GraphQL\Type\CurrencyType;
use App\GraphQL\Type\OrderInputType;
use App\GraphQL\Type\OrderType;
use App\GraphQL\Type\PriceType;
use App\GraphQL\Type\ProductType;

class TypeRegistry
{
    private static $product;
    private static $attribute;
    private static $attributeItem;
    private static $price;
    private static $currency;
    private static $category;
    private static $order;
    private static $orderInput;

    public static function product()
    {
        return self::$product ??= new ProductType();
    }

    public static function category()
    {
        return self::$category ??= new CategoryType();
    }

    public static function attribute()
    {
        return self::$attribute ??= new AttributeType();
    }

    public static function attributeItem()
    {
        return self::$attributeItem ??= new AttributeItemType();
    }

    public static function price()
    {
        return self::$price ??= new PriceType();
    }

    public static function currency()
    {
        return self::$currency ??= new CurrencyType();
    }

    public static function order()
    {
        return self::$order ??= new OrderType();
    }

    public static function orderInput()
    {
        return self::$orderInput ??= new OrderInputType();
    }
}
