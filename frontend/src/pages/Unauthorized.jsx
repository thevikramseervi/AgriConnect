import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const Unauthorized = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-8xl mb-8">🚫</div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-8 text-center max-w-md">
          You don't have permission to access this page. Please check your role or contact support.
        </p>
        <Link
          to="/"
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          Go to Home
        </Link>
      </div>
    </Layout>
  );
};

export default Unauthorized;

