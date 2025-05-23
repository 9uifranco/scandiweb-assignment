import { useEffect, useState } from "react";
import { useCart } from "../providers/CartContext";
import { useParams } from "react-router-dom";
import { Product } from "../types";
import { sanitizeHTML } from "../utils/sanitize";
import { parse } from "../utils/parse";
import { ChevronLeft, ChevronRight } from "lucide-react";
import api from "../api/axios";

const GRAPHQL_ENDPOINT = "/graphql"; // Or your actual endpoint URL

export default function ProductPage() {
    const [product, setProduct] = useState<Product | null>(null);
    const [currentImage, setCurrentImage] = useState<string | null>(null);
    const [selectedAttributes, setSelectedAttributes] = useState<{ [key: string]: string }>({});
    const { addToCart, openCartDrawer } = useCart();
    const { id } = useParams();

    const handleAddToCart = (product: Product, selectedAttributes?: { [key: string]: string }) => {
        addToCart(product, selectedAttributes);
        openCartDrawer();
    }

    const disableButton = () => {
        if (!product?.inStock) return true;

        const selectedKeys = Object.keys(selectedAttributes);
        return (
            selectedKeys.length !== product.attributes.length ||
            Object.values(selectedAttributes).some((val) => val === "")
        );
    };

    useEffect(() => {
        const fetchProduct = async () => {
            const query = `
            query GetProductById($id: String!) {
              productById(id: $id) {
                id
                name
                inStock
                description
                gallery
                brand
                category {
                  id
                  name
                }
                prices {
                  amount
                  currency {
                    label
                    symbol
                  }
                }
                attributes {
                  id
                  name
                  type
                  items {
                    id
                    value
                    displayValue
                  }
                }
              }
            }
          `;

            try {
                const response = await api.post(
                    GRAPHQL_ENDPOINT,
                    {
                        query,
                        variables: { id },
                    },
                    {
                        headers: { "Content-Type": "application/json" },
                    }
                );

                const fetchedProduct = response.data.data.productById;

                if (!fetchedProduct) {
                    alert("Product not found");
                    return;
                }

                setProduct(fetchedProduct);
                setCurrentImage(fetchedProduct.gallery[0]);
                setSelectedAttributes(
                    fetchedProduct.attributes.reduce((acc: any, attribute: any) => {
                        acc[attribute.id] = "";
                        return acc;
                    }, {})
                );
            } catch (error) {
                console.error("GraphQL fetch error:", error);
                alert("Failed to fetch product");
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);


    if (!product) return <p>Loading...</p>;

    return (
        <div className="flex flex-col md:flex-row gap-8 p-2 md:p-8">
            {/* Image Gallery */}
            <div className="flex flex-row md:flex-col gap-4 max-h-[400px] overflow-y-auto min-w-30" data-testid="product-gallery">
                {product.gallery.map((image) => (
                    <img
                        key={image}
                        src={image}
                        alt={product.name}
                        className={`w-24 h-24 object-cover cursor-pointer ${currentImage === image ? "border-2 border-green-500" : ""}`}
                        onClick={() => setCurrentImage(image)}
                    />
                ))}
            </div>

            <div className="flex flex-col gap-4 w-full">
                <div className="relative w-full h-[400px]">
                    <img src={currentImage!} alt={product.name} className="w-full h-full object-contain" />

                    {/* Left button */}
                    <button
                        onClick={() => {
                            const currentIndex = product.gallery.indexOf(currentImage!);
                            const prevIndex = (currentIndex - 1 + product.gallery.length) % product.gallery.length;
                            setCurrentImage(product.gallery[prevIndex]);
                        }}
                        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 text-white w-10 h-10 flex items-center justify-center"
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>

                    {/* Right button */}
                    <button
                        onClick={() => {
                            const currentIndex = product.gallery.indexOf(currentImage!);
                            const nextIndex = (currentIndex + 1) % product.gallery.length;
                            setCurrentImage(product.gallery[nextIndex]);
                        }}
                        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 text-white w-10 h-10 flex items-center justify-center"
                    >
                        <ChevronRight className="w-8 h-8" />
                    </button>
                </div>
            </div>

            {/* Product Details */}
            <div className="flex flex-col max-w-lg justify-self-end">
                <h1 className="text-2xl font-bold">{product.name}</h1>

                {/* Attributes */}
                {product.attributes.map((attribute) => (
                    <div
                        key={attribute.id}
                        className="mt-4"
                        data-testid={`product-attribute-${attribute.name.replace(/\s+/g, "-").toLowerCase()}`}
                    >
                        <h3 className="font-semibold">{attribute.name}:</h3>
                        <div className="flex gap-2 mt-2 max-w-screen overflow-x-auto flex-wrap md:flex-nowrap">
                            {attribute.items.map((item) => (
                                <button
                                    key={item.id}
                                    data-testid={`product-attribute-${attribute.name.replace(/\s+/g, "-").toLowerCase()}-${item.value.replace(/\s+/g, "-")}`}
                                    className={`border px-4 py-2 ${selectedAttributes[attribute.id] === item.value ? "bg-black text-white" : ""}`}
                                    onClick={() => setSelectedAttributes({ ...selectedAttributes, [attribute.id]: item.value })}
                                >
                                    {item.displayValue}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}


                {/* Price */}
                <div className="mt-4">
                    <h3 className="font-semibold">PRICE:</h3>
                    <p className="text-xl font-bold">
                        {product.prices[0].currency.symbol}{product.prices[0].amount.toFixed(2)}
                    </p>
                </div>

                {/* Add to Cart Button */}
                <button
                    className={`mt-4 px-6 py-3 text-lg text-white ${disableButton()
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-500 hover:bg-green-600 cursor-pointer'
                        }`}
                    onClick={() => handleAddToCart(product, selectedAttributes)}
                    disabled={disableButton()}
                    data-testid="add-to-cart"
                >
                    {product.inStock ? "ADD TO CART" : "OUT OF STOCK"}
                </button>


                {/* Product Description */}
                <div className="mt-4 text-gray-600" data-testid="product-description"
                // dangerouslySetInnerHTML={{
                //     __html: product.description
                // }}
                >
                    {parse(sanitizeHTML(product.description))}
                </div>


            </div>
        </div>
    );
}
