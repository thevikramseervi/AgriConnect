import { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';
import Layout from '../components/Layout';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getMyOrders();
      setOrders(response.data.orders || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await orderAPI.getOrderDetails(orderId);
      setOrderDetails(response.data);
      setSelectedOrder(orderId);
    } catch (error) {
      console.error('Error fetching order details:', error);
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
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <p className="text-gray-500 text-center">No orders yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Orders List */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">Order History</h2>
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    onClick={() => fetchOrderDetails(order._id)}
                    className={`border rounded-lg p-4 cursor-pointer transition ${
                      selectedOrder === order._id
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-green-400'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-800">Order #{order._id.slice(-6)}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p><span className="font-medium">Total:</span> ₹{order.totalAmount}</p>
                      <p><span className="font-medium">Locality:</span> {order.locality}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Details */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">Order Details</h2>
              {!orderDetails ? (
                <p className="text-gray-500 text-center py-8">
                  Select an order to view details
                </p>
              ) : (
                <div>
                  <div className="mb-6 pb-6 border-b">
                    <h3 className="font-semibold text-lg mb-2">Order Information</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><span className="font-medium">Order ID:</span> {orderDetails.order._id}</p>
                      <p><span className="font-medium">Date:</span> {new Date(orderDetails.order.createdAt).toLocaleString()}</p>
                      <p><span className="font-medium">Status:</span> 
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                          orderDetails.order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          orderDetails.order.status === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {orderDetails.order.status}
                        </span>
                      </p>
                      <p><span className="font-medium">Locality:</span> {orderDetails.order.locality}</p>
                      <p><span className="font-medium">Address:</span> {orderDetails.order.address}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-4">Items</h3>
                    {orderDetails.items && orderDetails.items.length > 0 ? (
                      <div className="space-y-3">
                        {orderDetails.items.map((item, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-3">
                            <div className="flex justify-between items-start">
                              <div className="text-sm">
                                <p className="font-medium text-gray-800">Item #{index + 1}</p>
                                <p className="text-gray-600">Quantity: {item.quantity} kg</p>
                                <p className="text-gray-600">Price: ₹{item.pricePerUnit}/kg</p>
                              </div>
                              <p className="font-semibold text-green-600">₹{item.subTotal}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No items found</p>
                    )}
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total Amount:</span>
                      <span className="text-2xl font-bold text-green-600">
                        ₹{orderDetails.order.totalAmount}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Orders;

