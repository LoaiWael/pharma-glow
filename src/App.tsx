import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { LocaleLayout } from '@/components/layout/LocaleLayout'
import { GalleryPage } from '@/pages/GalleryPage'
import { HomePage } from '@/pages/HomePage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ServiceDetailPage } from '@/pages/ServiceDetailPage'
import { ServicesPage } from '@/pages/ServicesPage'

const localeChildren = [
  { index: true, element: <HomePage /> },
  { path: 'gallery', element: <GalleryPage /> },
  { path: 'services', element: <ServicesPage /> },
  { path: 'services/:slug', element: <ServiceDetailPage /> },
  { path: '*', element: <NotFoundPage /> },
]

const router = createBrowserRouter([
  {
    path: '/',
    element: <LocaleLayout forcedLocale="ar" />,
    children: localeChildren,
  },
  { path: '/ar', element: <Navigate to="/" replace /> },
  { path: '/ar/*', element: <Navigate to="/" replace /> },
  {
    path: '/en',
    element: <LocaleLayout forcedLocale="en" />,
    children: localeChildren,
  },
])

const App = () => {
  return <RouterProvider router={router} />
}

export default App
