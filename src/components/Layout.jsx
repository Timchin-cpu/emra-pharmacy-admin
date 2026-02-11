import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingCart, Tag, Settings, Folder ,Image,LogOut} from 'lucide-react'

export default function Layout() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    navigate('/login')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: '250px', background: '#1f2937', color: 'white', padding: '20px' }}>
        <h2 style={{ marginBottom: '32px' }}>EMRA Admin</h2>
        <nav>
          {[
            { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
            { to: '/products', icon: Package, label: 'Товары' },
            { to: '/orders', icon: ShoppingCart, label: 'Заказы' },
            { to: '/categories', icon: Folder, label: 'Категории' },
            { to: '/banners', icon: Image, label: 'Баннеры' },
            { to: '/promo', icon: Tag, label: 'Промокоды' },
            { to: '/settings', icon: Settings, label: 'Настройки' },
          ].map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                borderRadius: '6px',
                marginBottom: '8px',
                background: isActive ? '#374151' : 'transparent',
                color: 'white',
                textDecoration: 'none'
              })}
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              borderRadius: '6px',
              background: 'transparent',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              marginTop: '20px',
              width: '100%'
            }}
          >
            <LogOut size={20} />
            Выход
          </button>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: '32px', background: '#f3f4f6' }}>
        <Outlet />
      </main>
    </div>
  )
}