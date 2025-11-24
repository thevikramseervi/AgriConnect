import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-green-600 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="text-2xl font-bold">
              🌾 AgriConnect
            </Link>
            
            {user && (
              <div className="flex items-center gap-6">
                <span className="text-sm">
                  Welcome, <span className="font-semibold">{user.name}</span> ({user.role})
                </span>
                <Link 
                  to={`/${user.role}`}
                  className="hover:bg-green-700 px-4 py-2 rounded transition"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/orders"
                  className="hover:bg-green-700 px-4 py-2 rounded transition"
                >
                  Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;

