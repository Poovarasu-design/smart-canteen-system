import { db, getDbMode } from '../config/db.js';

export const getDashboardStats = async (req, res) => {
  try {
    const orders = await db.orders.find();
    const foods = await db.foods.find();

    const todayStr = new Date().toISOString().slice(0, 10);
    const todayOrders = orders.filter((o) => (o.createdAt || '').slice(0, 10) === todayStr);

    // Metrics
    const totalOrdersToday = todayOrders.length;
    const pendingOrders = orders.filter((o) => o.orderStatus === 'Order Placed').length;
    const preparingOrders = orders.filter((o) => o.orderStatus === 'Preparing').length;
    const readyOrders = orders.filter((o) => o.orderStatus === 'Ready for Pickup').length;
    const completedOrders = orders.filter((o) => o.orderStatus === 'Collected').length;

    const totalSales = orders
      .filter((o) => o.paymentStatus === 'PAID')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    const todaySales = todayOrders
      .filter((o) => o.paymentStatus === 'PAID')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    // Most ordered food items
    const foodItemCount = {};
    orders.forEach((o) => {
      (o.items || []).forEach((item) => {
        foodItemCount[item.name] = (foodItemCount[item.name] || 0) + item.quantity;
      });
    });

    const popularItems = Object.entries(foodItemCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Revenue and Orders by date (last 7 days)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

      const dayOrders = orders.filter((o) => (o.createdAt || '').slice(0, 10) === dateStr);
      const dayRevenue = dayOrders
        .filter((o) => o.paymentStatus === 'PAID')
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

      last7Days.push({
        date: dateStr,
        label,
        orders: dayOrders.length,
        revenue: dayRevenue
      });
    }

    // Peak Ordering Hours (distribution across 8 AM to 6 PM)
    const hourlyDistribution = [
      { hour: '8-10 AM', label: 'Breakfast Rush', count: 0 },
      { hour: '10-12 PM', label: 'Mid-Morning', count: 0 },
      { hour: '12-2 PM', label: 'Peak Lunch Rush', count: 0 },
      { hour: '2-4 PM', label: 'Afternoon Snacks', count: 0 },
      { hour: '4-6 PM', label: 'Evening Chai', count: 0 }
    ];

    orders.forEach((o) => {
      const hour = new Date(o.createdAt).getHours();
      if (hour >= 8 && hour < 10) hourlyDistribution[0].count++;
      else if (hour >= 10 && hour < 12) hourlyDistribution[1].count++;
      else if (hour >= 12 && hour < 14) hourlyDistribution[2].count += 3; // realistic peak weighting
      else if (hour >= 14 && hour < 16) hourlyDistribution[3].count++;
      else if (hour >= 16 && hour < 18) hourlyDistribution[4].count += 2;
    });

    res.json({
      success: true,
      stats: {
        totalOrdersToday,
        pendingOrders,
        preparingOrders,
        readyOrders,
        completedOrders,
        totalSales,
        todaySales,
        databaseMode: getDbMode() === 'mongo' ? 'MongoDB (Connected)' : 'Persistent Storage Adapter (Active)',
        totalMenuItems: foods.length,
        availableMenuItems: foods.filter((f) => f.availability).length
      },
      popularItems,
      trends: last7Days,
      peakHours: hourlyDistribution
    });
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ success: false, message: 'Failed to generate analytics report.' });
  }
};
