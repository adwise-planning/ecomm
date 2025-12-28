// Simulating a backend service
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// --- Mock Data Generators ---
const generateOrders = () => {
  const statuses = ['Delivered', 'In Transit', 'RTO', 'Pending', 'Lost'];
  const regions = ['Delhi NCR', 'Mumbai', 'Bangalore', 'Kolkata', 'Chennai', 'Pune'];
  
  return Array.from({ length: 100 }, (_, i) => ({
    id: `ORD-${2025000 + i}`,
    date: new Date(2025, 4, 1 + (i % 30)).toISOString().split('T')[0],
    customer: `Customer ${i + 1}`,
    amount: Math.floor(Math.random() * 8000) + 500,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    paymentMode: i % 3 === 0 ? 'COD' : 'Prepaid',
    region: regions[i % regions.length],
    shippingCost: Math.floor(Math.random() * 200) + 50,
    rtoRisk: i % 5 === 0 ? 'High' : 'Low'
  }));
};

const MOCK_ORDERS = generateOrders();

const MOCK_TEAM = [
  { id: 1, name: 'Rahul Sharma', email: 'rahul@brand.com', role: 'L4 - Read Only', status: 'Active' },
  { id: 2, name: 'Priya Patel', email: 'priya@brand.com', role: 'L4 - Read Only', status: 'Invited' },
];

const MOCK_INVOICES = [
  { id: 'INV-001', date: '2025-05-01', amount: 15000, status: 'Paid', plan: 'P1: Fixed' },
  { id: 'INV-002', date: '2025-04-01', amount: 15000, status: 'Paid', plan: 'P1: Fixed' },
];

// --- API Methods ---
export const api = {
  login: async (email, otp) => {
    await delay(1000);
    if (otp === '1234') {
      // Simulate Role based on email
      let role = 'L3'; // Default Client
      if (email.includes('admin')) role = 'L1';
      if (email.includes('view')) role = 'L4';

      return {
        user: {
          id: 'u1',
          name: email.split('@')[0],
          email,
          role,
          company: 'BrandX D2C'
        },
        token: 'mock-jwt-token'
      };
    }
    throw new Error('Invalid OTP. Try 1234.');
  },

  getDashboardMetrics: async (range) => {
    await delay(800);
    const multiplier = range === '7d' ? 0.25 : 1;
    return {
      revenue: { value: 2084286 * multiplier, growth: 8.7 },
      orders: { value: 1400 * multiplier, growth: -4.4 },
      rtoRate: { value: 14.7, growth: -9.1 }, // Negative growth is good for RTO
      roi: { value: 145000 * multiplier },
      chartData: Array.from({ length: 7 }, (_, i) => ({
        name: `Day ${i+1}`,
        revenue: Math.floor(Math.random() * 50000) + 10000,
        rtoRate: Math.floor(Math.random() * 20) + 5
      }))
    };
  },

  getOrders: async (page = 1, limit = 10, sort = null) => {
    await delay(600);
    let data = [...MOCK_ORDERS];
    
    if (sort) {
      data.sort((a, b) => {
        if (a[sort.key] < b[sort.key]) return sort.dir === 'asc' ? -1 : 1;
        if (a[sort.key] > b[sort.key]) return sort.dir === 'asc' ? 1 : -1;
        return 0;
      });
    }

    const start = (page - 1) * limit;
    const end = start + limit;
    
    return {
      data: data.slice(start, end),
      total: data.length,
      totalPages: Math.ceil(data.length / limit)
    };
  },

  getRtoAnalytics: async () => {
    await delay(800);
    return {
      byRegion: [
        { name: 'Delhi NCR', value: 28, risk: 'Critical' },
        { name: 'Mumbai', value: 18, risk: 'Moderate' },
        { name: 'Bangalore', value: 12, risk: 'Low' },
        { name: 'Kolkata', value: 22, risk: 'High' },
        { name: 'Chennai', value: 15, risk: 'Low' },
      ],
      reasons: [
        { name: 'Customer Unavailable', value: 40 },
        { name: 'Address Incomplete', value: 25 },
        { name: 'Refused Delivery', value: 20 },
        { name: 'Fake Order', value: 15 },
      ]
    };
  },

  getRecommendations: async () => {
    await delay(500);
    return [
      { id: 1, title: 'High RTO in Delhi NCR', desc: 'RTO rate is 28%. Enable IVR confirmation for this region.', impact: '₹42,500 savings', severity: 'critical' },
      { id: 2, title: 'Abandoned Cart Spike', desc: '15% increase in drop-offs at payment page.', impact: '₹65,000 revenue', severity: 'high' },
      { id: 3, title: 'Weekend Rush', desc: 'Orders placed on Saturday have 10% higher RTO.', impact: 'Process verification', severity: 'medium' },
    ];
  },

  getIntegrations: async () => {
    await delay(400);
    return [
      { id: 'shopify', name: 'Shopify', status: 'connected', lastSync: '10 mins ago' },
      { id: 'shiprocket', name: 'Shiprocket', status: 'connected', lastSync: '1 hour ago' },
      { id: 'meta', name: 'Meta Ads', status: 'disconnected', lastSync: null },
    ];
  },

  getTeam: async () => {
    await delay(500);
    return [...MOCK_TEAM];
  },

  inviteMember: async (email, name) => {
    await delay(800);
    const newMember = { id: Date.now(), name, email, role: 'L4 - Read Only', status: 'Invited' };
    MOCK_TEAM.push(newMember);
    return newMember;
  },

  getInvoices: async () => {
    await delay(600);
    return MOCK_INVOICES;
  },

  saveSettings: async (data) => {
    await delay(1200);
    // In a real API we'd persist `data`; keep it in the response so callers can inspect
    return { success: true, data };
  }
};