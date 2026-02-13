import { useEffect, useState } from 'react';
import { ShoppingCart, DollarSign, Package, Users } from 'lucide-react';
import Card from '../components/ui/Card';
import { dashboardAPI } from '../services/api';
import './Dashboard.css';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { data } = await dashboardAPI.getStats();
      setStats(data.data);
    } catch (error) {
      console.error(error);
    }
  };
// ва
  return (
    <div className="dashboard-page">
      <h1>Dashboard</h1>
      <p className="page-subtitle">Welcome back! Here's your overview.</p>
      
      <div className="metrics-grid">
        <div className="metric-card">
          <ShoppingCart size={24} className="metric-icon" />
          <div>
            <p className="metric-label">Total Orders</p>
            <p className="metric-value">{stats?.totalOrders || '0'}</p>
          </div>
        </div>
        <div className="metric-card">
          <DollarSign size={24} className="metric-icon" />
          <div>
            <p className="metric-label">Revenue</p>
            <p className="metric-value">₽{stats?.revenue || '0'}</p>
          </div>
        </div>
        <div className="metric-card">
          <Package size={24} className="metric-icon" />
          <div>
            <p className="metric-label">Products</p>
            <p className="metric-value">{stats?.products || '0'}</p>
          </div>
        </div>
        <div className="metric-card">
          <Users size={24} className="metric-icon" />
          <div>
            <p className="metric-label">Users</p>
            <p className="metric-value">{stats?.users || '0'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 



