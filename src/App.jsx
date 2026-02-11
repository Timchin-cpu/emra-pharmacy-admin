import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Orders from './pages/Orders'
import Categories from './pages/Categories'
// import PromoCodes from './pages/PromoCodes'
// import Settings from './pages/Settings'
import Layout from './components/Layout'
import Banners from './pages/Banners'

function App() {
  const token = localStorage.getItem('adminToken')

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          {token ? (
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="orders" element={<Orders />} />
              <Route path="categories" element={<Categories />} />
              <Route path="banners" element={<Banners />} />
              {/* <Route path="promo" element={<PromoCodes />} /> */}
              {/* <Route path="settings" element={<Settings />} /> */}
            </Route>
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </>
  )
}

export default App