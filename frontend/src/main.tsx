import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './providers/CartContext.tsx'
import { CategoriesProvider } from './providers/CategoriesContext.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <CategoriesProvider>
                <CartProvider>
                    <App />
                </CartProvider>
            </CategoriesProvider>
        </BrowserRouter>
    </StrictMode>,
)
