import { createContext, useContext, useEffect, useState } from "react";
import { Product } from "../types";
import { v4 as uuidv4 } from 'uuid';
import api from "../api/axios";

export type CartItem = {
    id: number;
    product: Product;
    quantity: number;
    selectedAttributes: { [key: string]: string };
    onSelectAttribute?: (attribute: string, value: string) => void;
};


type CartContextType = {
    cart: CartItem[];
    addToCart: (product: Product, selectedAttributes?: { [key: string]: string }) => void;
    removeFromCart: (id: number) => void;
    increaseQuantity: (id: number) => void;
    decreaseQuantity: (id: number) => void;
    isDrawerOpen: boolean;
    openCartDrawer: () => void;
    closeCartDrawer: () => void;
    toggleCartDrawer: () => void;
    placeOrder: () => void;
};

const GRAPHQL_ENDPOINT = "/graphql";

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>(() => {
        const storedCart = localStorage.getItem("cart");
        return storedCart ? JSON.parse(storedCart) : [];
    });

    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

    function openCartDrawer() {
        setIsDrawerOpen(true);
    }

    function closeCartDrawer() {
        setIsDrawerOpen(false);
    }

    function toggleCartDrawer() {
        setIsDrawerOpen((prev) => !prev);
    }

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const placeOrder = async () => {
        const total = cart.reduce((sum, item) => {
            const price = item.product.prices[0]?.amount || 0;
            return sum + price * item.quantity;
        }, 0);

        const items = cart.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            selectedAttributes: JSON.stringify(item.selectedAttributes),
        }));

        const mutation = `
            mutation CreateOrder($total: Float!, $items: [OrderInput!]!) {
                createOrder(total: $total, items: $items) {
                    id
                }
            }
        `;

        try {
            const response = await api.post(GRAPHQL_ENDPOINT, {
                query: mutation,
                variables: {
                    total: parseFloat(total.toFixed(2)),
                    items,
                },
            }, {
                headers: {
                    "Content-Type": "application/json",
                }
            });

            const data = response.data;

            if (data.errors) {
                console.error("GraphQL Error:", data.errors);
                return;
            }

            console.log("Order placed! ID:", data.data.createOrder.id);
            setCart([]);
            localStorage.removeItem("cart");
        } catch (error) {
            console.error("Error placing order:", error);
        }
    };


    function addToCart(product: Product, selectedAttributes: { [key: string]: string } = {}) {
        if (Object.keys(selectedAttributes).length === 0) {
            selectedAttributes = product.attributes.reduce((acc, attribute) => {
                if (attribute.items.length > 0) {
                    acc[attribute.id] = attribute.items[0].value;
                }
                return acc;
            }, {} as { [key: string]: string });
        }

        setCart((prevCart) => {
            const exists = prevCart.find((item) =>
                item.product.id === product.id &&
                JSON.stringify(item.selectedAttributes) === JSON.stringify(selectedAttributes)
            );

            if (exists) {
                return prevCart.map((item) =>
                    item.product.id === product.id &&
                        JSON.stringify(item.selectedAttributes) === JSON.stringify(selectedAttributes)
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            const uuid = parseInt(uuidv4().replace(/-/g, "").slice(0, 10), 16);
            return [...prevCart, { id: uuid, product, quantity: 1, selectedAttributes }];
        });
    }

    function removeFromCart(id: number) {
        setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    }

    function increaseQuantity(id: number) {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === id ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    }

    function decreaseQuantity(id: number) {
        setCart((prevCart) =>
            prevCart
                .map((item) =>
                    item.id === id ? { ...item, quantity: item.quantity - 1 } : item
                )
                .filter((item) => item.quantity > 0)
        );
    }

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                increaseQuantity,
                decreaseQuantity,
                isDrawerOpen,
                openCartDrawer,
                closeCartDrawer,
                toggleCartDrawer,
                placeOrder
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
