import { useState, useEffect } from 'react';
import { customerAPI, productAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';

const CustomerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [otherLocalityProducts, setOtherLocalityProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [activeTab, setActiveTab] = useState('shop');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [prodRes, analyticsRes] = await Promise.all([
        productAPI.getAvailableProducts(),
        customerAPI.getExpenditureAnalytics().catch(() => ({ data: { data: [] } })),
      ]);

      setProducts(prodRes.data.products || []);
      setOtherLocalityProducts(prodRes.data.otherLocalityProducts || []);
      setAnalytics(analyticsRes.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.product._id === product._id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.product._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      setCart(cart.filter(item => item.product._id !== productId));
    } else {
      setCart(cart.map(item =>
        item.product._id === productId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.product._id !== productId));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.product.pricePerUnit * item.quantity), 0);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    const address = prompt('Enter delivery address:');
    if (!address) return;

    const items = cart.map(item => ({
      vendorProductId: item.product._id,
      quantity: item.quantity,
    }));

    try {
      await customerAPI.purchaseFromVendor({ address, items });
      alert('Order placed successfully!');
      setCart([]);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Order failed');
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
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Customer Dashboard</h1>

        {/* Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="flex gap-8">
            <button
              onClick={() => setActiveTab('shop')}
              className={`pb-4 font-medium transition ${
                activeTab === 'shop'
                  ? 'border-b-2 border-green-600 text-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Shop Products
            </button>
            <button
              onClick={() => setActiveTab('cart')}
              className={`pb-4 font-medium transition relative ${
                activeTab === 'cart'
                  ? 'border-b-2 border-green-600 text-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Cart
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-3 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`pb-4 font-medium transition ${
                activeTab === 'analytics'
                  ? 'border-b-2 border-green-600 text-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              My Purchases
            </button>
          </nav>
        </div>

        {/* Shop Tab */}
        {activeTab === 'shop' && (
          <div className="space-y-8">
            {/* Local Products */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Products in Your Area ({user.locality})</h2>
              {products.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No products available in your locality.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
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
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Local</span>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                          <p><span className="font-medium">Price:</span> ₹{product.pricePerUnit}/kg</p>
                          <p><span className="font-medium">Available:</span> {product.quantity} kg</p>
                          <p><span className="font-medium">Category:</span> {product.category || 'N/A'}</p>
                          <p><span className="font-medium">Locality:</span> {product.locality}</p>
                        </div>
                        <button
                          onClick={() => addToCart(product)}
                          className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Other Locality Products */}
            {otherLocalityProducts.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Products from Other Areas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {otherLocalityProducts.map((product) => (
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
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Other</span>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                          <p><span className="font-medium">Price:</span> ₹{product.pricePerUnit}/kg</p>
                          <p><span className="font-medium">Available:</span> {product.quantity} kg</p>
                          <p><span className="font-medium">Category:</span> {product.category || 'N/A'}</p>
                          <p><span className="font-medium">Locality:</span> {product.locality}</p>
                        </div>
                        <button
                          onClick={() => addToCart(product)}
                          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Cart Tab */}
        {activeTab === 'cart' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Your cart is empty. Start shopping!</p>
            ) : (
              <div>
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.product._id} className="flex items-center gap-4 border border-gray-200 rounded-lg p-4">
                      {item.product.imageUrl && (
                        <img 
                          src={`http://localhost:5000${item.product.imageUrl}`} 
                          alt={item.product.name}
                          className="w-24 h-24 object-cover rounded"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                          }}
                        />
                      )}
                      {!item.product.imageUrl && (
                        <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No Image</span>
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800">{item.product.name}</h3>
                        <p className="text-sm text-gray-600">
                          ₹{item.product.pricePerUnit}/kg × {item.quantity} kg = ₹{item.product.pricePerUnit * item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateCartQuantity(item.product._id, item.quantity - 1)}
                            className="bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded transition"
                          >
                            -
                          </button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.product._id, item.quantity + 1)}
                            className="bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded transition"
                            disabled={item.quantity >= item.product.quantity}
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product._id)}
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-6">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-2xl font-bold">Total:</span>
                    <span className="text-2xl font-bold text-green-600">₹{calculateTotal()}</span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Purchase History</h2>
            {analytics.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No purchase history yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Spent</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {analytics.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item._id.day}/{item._id.month}/{item._id.year}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{item.orderCount}</td>
                        <td className="px-6 py-4 whitespace-nowrap">₹{item.totalSpent}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CustomerDashboard;

