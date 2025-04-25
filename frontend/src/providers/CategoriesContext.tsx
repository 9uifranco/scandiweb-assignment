import { createContext, useContext, useState, useEffect } from "react";
import { Category } from "../types";
import { data } from "../mock";

interface CategoriesContextType {
    categories: Category[];
    selectedCategory: Category | null;
    setSelectedCategory: (category: Category) => void;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export function CategoriesProvider({ children }: { children: React.ReactNode }) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const mockCategories = data.data.categories;

            if (!mockCategories) {
                alert("Categories not found");
                return;
            }

            setCategories([...mockCategories]);
            setSelectedCategory(mockCategories[0]);
        };

        fetchCategories();
    }, []);

    return (
        <CategoriesContext.Provider value={{ categories, selectedCategory, setSelectedCategory }}>
            {children}
        </CategoriesContext.Provider>
    );
}

export function useCategories() {
    const context = useContext(CategoriesContext);
    if (!context) {
        throw new Error("useCategories must be used within a CategoriesProvider");
    }
    return context;
}
