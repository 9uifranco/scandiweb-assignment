import { Outlet } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef, useEffect } from "react";
import CartDrawer from "../components/CartDrawer";
import { useCart } from "../providers/CartContext";
import { useCategories } from "../providers/CategoriesContext";

export default function Layout() {
    const cartButtonRef = useRef<HTMLDivElement>(null);
    const cartDrawerRef = useRef<HTMLDivElement>(null);

    const { cart, decreaseQuantity, increaseQuantity, isDrawerOpen, toggleCartDrawer, closeCartDrawer, placeOrder } = useCart();
    const { categories, selectedCategory, setSelectedCategory } = useCategories();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Element;

            if (
                cartButtonRef.current &&
                !cartButtonRef.current.contains(target) &&
                !cartDrawerRef.current?.contains(target)
            ) {
                closeCartDrawer();
            }
        }

        if (isDrawerOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isDrawerOpen, closeCartDrawer]);


    return (
        <div className="mx-auto relative">
            <header className="mx-auto bg-white z-20 sticky top-0">
                <nav className="flex justify-between items-center relative bg-white px-6 max-w-6xl mx-auto min-h-18">
                    <div className="flex space-x-4">
                        {categories.map((category) => {
                            const isActive = selectedCategory?.name === category.name;
                            return (
                                <Link
                                    key={category.name}
                                    to={`/${category.name}`}
                                    className={`text-gray-500 pb-6 pt-6 px-3 hover:text-green-600 ${isActive ? "font-semibold text-green-500 border-b-2 border-green-500" : ""}`}
                                    onClick={() => setSelectedCategory(category)}
                                    data-testid={isActive ? "active-category-link" : "category-link"}
                                >
                                    {category.name.toUpperCase()}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:block">
                        <img src="/a-logo.png" alt="Logo" className="w-10 h-10" />
                    </div>

                    <div className="relative" ref={cartButtonRef}>
                        <button
                            data-testid="cart-btn"
                            onClick={() => {
                                toggleCartDrawer()
                            }}
                            className="cursor-pointer"
                        >
                            <ShoppingCart className="w-6 h-6 text-gray-700" />
                        </button>
                        {cart.length > 0 && (
                            <div className="absolute top-0 right-0 pointer-events-none">
                                <span className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {cart.length}
                                </span>
                            </div>
                        )}
                    </div>
                </nav>
                {/* Cart Drawer */}
                <div className="relative max-w-6xl mx-auto" ref={cartDrawerRef}>
                    <CartDrawer
                        isOpen={isDrawerOpen}
                        items={cart}
                        onIncrease={increaseQuantity}
                        onDecrease={decreaseQuantity}
                        onPlaceOrder={placeOrder}
                    />
                </div>
            </header>


            {/* Backdrop */}

            <div
                className={`fixed inset-0 bg-black z-10 transition-opacity duration-200 ${isDrawerOpen ? 'opacity-30' : 'opacity-0 pointer-events-none'}`}
            ></div>

            <main className="relative p-6 max-w-6xl mx-auto">
                <Outlet />
            </main>
        </div>
    );
}
