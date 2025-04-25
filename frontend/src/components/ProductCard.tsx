import { ShoppingCart } from "lucide-react";
import { useCart } from "../providers/CartContext";
import { useNavigate } from "react-router-dom";
import { Product } from "../types";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart();

    const navigate = useNavigate();

    return (
        <div
            data-testid={`product-${product.name.replace(/\s+/g, '-').toLowerCase()}`}
            onClick={() => navigate(`/product/${product.id}`)}
            className="relative overflow-hidden p-4 hover:shadow-custom transition duration-300 ease-in-out cursor-pointer group"
        >
            <div className="relative">
                <img
                    src={product.gallery[0]}
                    alt={product.name}
                    className={`w-full h-80 object-cover ${!product.inStock ? "opacity-50" : ""}`}
                />
                {!product.inStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-300/50">
                        <span className="text-gray-700 font-normal text-lg">OUT OF STOCK</span>
                    </div>
                )}

                {product.inStock && (<button
                    className={`absolute -bottom-5 right-4 p-3 bg-green-500 text-white rounded-full
                                hover:bg-green-600 transition duration-300 ease-in-out 
                                opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 cursor-pointer
                                ${!product.inStock ? "cursor-not-allowed" : ""}`}
                    disabled={!product.inStock}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (!!product.inStock) {
                            addToCart(product);
                        }
                    }}
                >
                    <ShoppingCart className="w-5 h-5" />
                </button>)}
            </div>

            <div className="pt-4">
                <p className="text-gray-700">{product.name}</p>
                <p className={`font-semibold ${!product.inStock ? 'text-slate-400' : ''}`}>
                    {product.prices[0].currency.symbol}{product.prices[0].amount.toFixed(2)}
                </p>
            </div>
        </div>
    );
}
