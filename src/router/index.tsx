import { createBrowserRouter, Navigate } from 'react-router-dom'
import { RootLayout } from '@/layout/RootLayout'
import AccountPage from '@/pages/AccountPage'
import BodyCarePage from '@/pages/BodyCarePage'
import CartPage from '@/pages/CartPage'
import { HomePage } from '@/pages/HomePage'
import OffersPage from '@/pages/OffersPage'
import OrdersPage from '@/pages/OrdersPage'
import ProductDetailsPage from '@/pages/ProductDetailsPage'
import ProductsPage from '@/pages/ProductsPage'
import ReviewsPage from '@/pages/ReviewsPage'
import SkinCarePage from '@/pages/SkinCarePage'
import WishlistPage from '@/pages/WishlistPage'

const localeChildren = [
  { index: true, element: <HomePage /> },
  { path: 'products', element: <ProductsPage /> },
  { path: 'products/:id', element: <ProductDetailsPage /> },
  { path: 'offers', element: <OffersPage /> },
  { path: 'skincare', element: <SkinCarePage /> },
  { path: 'bodycare', element: <BodyCarePage /> },
  { path: 'reviews', element: <ReviewsPage /> },
  { path: 'wishlist', element: <WishlistPage /> },
  { path: 'cart', element: <CartPage /> },
  { path: 'account', element: <AccountPage /> },
  { path: 'orders', element: <OrdersPage /> },
]

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout forcedLocale="ar" />,
    children: localeChildren,
  },
  { path: '/ar', element: <Navigate to="/" replace /> },
  { path: '/ar/*', element: <Navigate to="/" replace /> },
  {
    path: '/en',
    element: <RootLayout forcedLocale="en" />,
    children: localeChildren,
  },
])
