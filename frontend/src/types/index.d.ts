/* Product Type */

export type Product = {
    id: string;
    name: string;
    inStock: boolean;
    gallery: string[];
    description: string;
    category: string;
    attributes: AttributeSet[];
    prices: Price[];
    brand: string;
    __typename: string;
};

type AttributeSet = {
    id: string;
    name: string;
    type: string;
    items: Attribute[];
    __typename: string;
};

type Attribute = {
    id: string;
    displayValue: string;
    value: string;
    __typename: string;
};

type Price = {
    amount: number;
    currency: Currency;
    __typename: string;
};

type Currency = {
    label: string;
    symbol: string;
    __typename: string;
};

/* Category */

export type Category = {
    'name': string;
    '__typename': string;
}