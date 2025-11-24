import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-green-600 mb-4">🌾 AgriConnect</h1>
          <p className="text-2xl text-gray-700 mb-8">
            Connecting Farmers, Vendors, and Customers
          </p>
          {!isAuthenticated ? (
            <div className="flex gap-4 justify-center">
              <Link
                to="/login"
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-white text-green-600 border-2 border-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition"
              >
                Register
              </Link>
            </div>
          ) : (
            <Link
              to={`/${user.role}`}
              className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Go to Dashboard
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-5xl mb-4">👨‍🌾</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">For Farmers</h3>
            <p className="text-gray-600">
              List your produce, set your prices, and connect directly with vendors. 
              Track your sales and grow your business.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-5xl mb-4">🏪</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">For Vendors</h3>
            <p className="text-gray-600">
              Purchase directly from farmers at competitive prices. 
              Manage your inventory and sell to customers.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-5xl mb-4">🛒</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">For Customers</h3>
            <p className="text-gray-600">
              Buy fresh produce from local vendors. 
              Get the best prices and quality products delivered to your door.
            </p>
          </div>
        </div>

        <div className="mt-16 max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            How It Works
          </h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                1
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">Register Your Account</h4>
                <p className="text-gray-600">
                  Choose your role (Farmer, Vendor, or Customer) and create your account.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                2
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">Buy or Sell Products</h4>
                <p className="text-gray-600">
                  Farmers list products, Vendors purchase from farmers, Customers buy from vendors.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                3
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">Track & Manage</h4>
                <p className="text-gray-600">
                  Monitor your orders, track analytics, and manage your business efficiently.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

