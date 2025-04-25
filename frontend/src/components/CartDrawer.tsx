import { CartItem as CartItemType } from "../providers/CartContext";
import Button from "./ui/Button";

interface CartItemProps {
    item: CartItemType;
    onIncrease: (id: number) => void;
    onDecrease: (id: number) => void;
}

const CartItem = ({ item, onIncrease, onDecrease }: CartItemProps) => {
    return (
        <div className="flex items-center gap-4 border-b pb-4 mb-4 h-full">
            <div className="flex flex-col">
                <h2 className="font-normal">{item.product.name}</h2>
                <p className="text-gray-800 font-medium mt-2">${item.product.prices[0].amount.toFixed(2)}</p>
                {item.product.attributes.map((attribute) => (
                    <div key={attribute.id} className="mt-2">
                        <p className="text-sm font-semibold">{attribute.name}:</p>
                        <div
                            className="flex gap-2 mt-1 flex-wrap max-w-[200px]"
                            data-testid={`cart-item-attribute-${attribute.name.replace(/\s+/g, '-').toLowerCase()}`}
                        >
                            {attribute.items.map((i) => {
                                const isSelected = item.selectedAttributes[attribute.id] === i.value;
                                const kebabAttrName = attribute.name.replace(/\s+/g, '-').toLowerCase();
                                const kebabOptionName = i.displayValue.replace(/\s+/g, '-').toLowerCase();
                                return (
                                    <button
                                        key={i.id}
                                        className={`px-2 py-1 border ${isSelected ? "bg-black text-white" : "bg-white "}`}
                                        style={attribute.type === "swatch" ? {
                                            backgroundColor: i.value,
                                            width: 16,
                                            height: 16,
                                            borderRadius: 0,
                                            outline: isSelected ? '2px solid #72d48b' : ''
                                        } : {}}
                                        data-testid={
                                            isSelected
                                                ? `cart-item-attribute-${kebabAttrName}-${kebabOptionName}-selected`
                                                : `cart-item-attribute-${kebabAttrName}-${kebabOptionName}`
                                        }
                                    >
                                        {attribute.type === "swatch" ? "" : i.displayValue}
                                    </button>
                                );
                            })}
                        </div>

                    </div>
                ))}

            </div>
            <div className="flex flex-col items-center justify-between">
                <button data-testid='cart-item-amount-increase' onClick={() => onIncrease(item.id)} className="cursor-pointer border px-2">+</button>
                <span className="my-10" data-testid='cart-item-amount'>{item.quantity}</span>
                <button data-testid='cart-item-amount-decrease' onClick={() => onDecrease(item.id)} className="cursor-pointer border px-2">-</button>
            </div>
            <img src={item.product.gallery[0]} alt={item.product.name} className="w-30 h-full object-cover" />
        </div>
    );
};

interface CartDrawerProps {
    items: CartItemType[];
    onIncrease: (id: number) => void;
    onDecrease: (id: number) => void;
    onPlaceOrder: () => void;
    isOpen: boolean;
}

export default function CartDrawer({ items, onIncrease, onDecrease, onPlaceOrder, isOpen }: CartDrawerProps) {
    const total = items.reduce((acc, item) => acc + item.product.prices[0].amount * item.quantity, 0);

    return (
        isOpen ? (
            <div
                data-testid="cart-overlay"
                className="p-4 z-20 absolute top-full right-0 bg-white shadow-lg transform transition-opacity opacity-100 duration-100 max-w-6xl max-h-[500px] overflow-y-auto "
            >
                <h1 className="text-lg mb-4"><b>
                    My Bag,
                </b>
                    {' '}
                    {items.length} items</h1>
                {items.map((item) => (
                    <CartItem key={item.id} item={item} onIncrease={onIncrease} onDecrease={onDecrease} />
                ))}
                <div className="flex justify-between font-semibold my-8">
                    <span>Total</span>
                    <span
                        data-testid='cart-total'
                    >${total.toFixed(2)}</span>
                </div>
                <Button
                    text="PLACE ORDER"
                    onClick={onPlaceOrder}
                    disabled={items.length === 0}
                    className="mb-4"
                />

            </div>
        ) : null
    );
}
