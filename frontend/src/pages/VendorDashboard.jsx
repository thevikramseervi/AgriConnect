import { useState, useEffect } from 'react';
import { vendorAPI, productAPI } from '../services/api';
import Layout from '../components/Layout';

const VendorDashboard = () => {
  const [myProducts, setMyProducts] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [salesAnalytics, setSalesAnalytics] = useState([]);
  const [expenditureAnalytics, setExpenditureAnalytics] = useState([]);
  const [activeTab, setActiveTab] = useState('browse');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [myProdRes, availProdRes, salesRes, expRes] = await Promise.all([
        vendorAPI.getMyProducts(),
        productAPI.getAvailableProducts(),
        vendorAPI.getSalesAnalytics().catch(() => ({ data: { data: [] } })),
        vendorAPI.getExpenditureAnalytics().catch(() => ({ data: { data: [] } })),
      ]);

      console.log('[VENDOR DASHBOARD] Available products response:', availProdRes.data);
      console.log('[VENDOR DASHBOARD] Products count:', availProdRes.data.products?.length || 0);

      setMyProducts(myProdRes.data.vendorProduct || []);
      setAvailableProducts(availProdRes.data.products || []);
      setSalesAnalytics(salesRes.data.data || []);
      setExpenditureAnalytics(expRes.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      console.error('Error details:', error.response?.data);
      setLoading(false);
    }
  };

  const handlePurchase = async (productId) => {
    const quantity = prompt('Enter quantity to purchase (kg):');
    if (quantity && Number(quantity) > 0) {
      try {
        await vendorAPI.purchaseFromFarmer(productId, Number(quantity));
        alert('Purchase successful!');
        fetchData();
      } catch (error) {
        alert(error.response?.data?.message || 'Purchase failed');
      }
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Vendor Dashboard</h1>

        {/* Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="flex gap-8">
            <button
              onClick={() => setActiveTab('browse')}
              className={`pb-4 font-medium transition ${
                activeTab === 'browse'
                  ? 'border-b-2 border-green-600 text-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Browse Products
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`pb-4 font-medium transition ${
                activeTab === 'inventory'
                  ? 'border-b-2 border-green-600 text-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              My Inventory
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`pb-4 font-medium transition ${
                activeTab === 'analytics'
                  ? 'border-b-2 border-green-600 text-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Analytics
            </button>
          </nav>
        </div>

        {/* Browse Products Tab */}
        {activeTab === 'browse' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Available Farmer Products</h2>
            {availableProducts.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No products available at the moment.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableProducts.map((product) => (
                  <div key={product._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
                    {product.imageUrl && (
                      <img 
                        src={`http://localhost:5000${product.imageUrl}`} 
                        alt={product.name}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                        }}
                      />
                    )}
                    {!product.imageUrl && (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">No Image</span>
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <p><span className="font-medium">Price:</span> ₹{product.pricePerUnit}/kg</p>
                        <p><span className="font-medium">Available:</span> {product.quantity} kg</p>
                        <p><span className="font-medium">Category:</span> {product.category || 'N/A'}</p>
                        <p><span className="font-medium">Locality:</span> {product.locality}</p>
                        <p><span className="font-medium">Address:</span> {product.address}</p>
                      </div>
                      <button
                        onClick={() => handlePurchase(product._id)}
                        className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                      >
                        Purchase
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* My Inventory Tab */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">My Inventory</h2>
            {myProducts.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Your inventory is empty. Purchase products from farmers to get started!
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myProducts.map((product) => (
                  <div key={product._id} className="border border-gray-200 rounded-lg overflow-hidden">
                    {product.imageUrl && (
                      <img 
                        src={`http://localhost:5000${product.imageUrl}`} 
                        alt={product.name}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                        }}
                      />
                    )}
                    {!product.imageUrl && (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">No Image</span>
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p><span className="font-medium">Price:</span> ₹{product.pricePerUnit}/kg</p>
                        <p><span className="font-medium">Quantity:</span> {product.quantity} kg</p>
                        <p><span className="font-medium">Category:</span> {product.category || 'N/A'}</p>
                        <p><span className="font-medium">Locality:</span> {product.locality}</p>
                        <p>
                          <span className="font-medium">Status:</span>{' '}
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            product.status === 'available' ? 'bg-green-100 text-green-800' :
                            product.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {product.status}
                          </span>
                        </p>
                        <p className="text-xs text-gray-500">
                          Added: {new Date(product.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* Sales Analytics */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Sales Analytics</h2>
              {salesAnalytics.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No sales data yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity Sold</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {salesAnalytics.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item._id.day}/{item._id.month}/{item._id.year}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{item.totalQuantitySold} kg</td>
                          <td className="px-6 py-4 whitespace-nowrap">₹{item.totalRevenue}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Expenditure Analytics */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Purchase Analytics</h2>
              {expenditureAnalytics.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No purchase data yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity Purchased</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Spent</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {expenditureAnalytics.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item._id.day}/{item._id.month}/{item._id.year}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{item.totalQuantityPurchased} kg</td>
                          <td className="px-6 py-4 whitespace-nowrap">₹{item.totalSpent}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default VendorDashboard;

