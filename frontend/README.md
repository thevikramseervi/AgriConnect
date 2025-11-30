# AgriConnect Frontend

A modern React-based frontend for the AgriConnect platform, connecting farmers, vendors, and customers in an agricultural marketplace.

## Features

### For Farmers 👨‍🌾
- Create and manage product listings
- Upload product images
- Set prices and quantities
- Track sales analytics
- Monitor inventory status

### For Vendors 🏪
- Browse and purchase products from farmers
- Manage inventory
- Track sales and purchase analytics
- Sell to customers

### For Customers 🛒
- Browse products from local and other vendors
- Shopping cart functionality
- Place orders
- Track purchase history

## Tech Stack

- **React 19** - UI Framework
- **Vite** - Build tool and dev server
- **React Router v7** - Client-side routing
- **Tailwind CSS v4** - Styling
- **Axios** - HTTP client
- **Recharts** - Analytics charts

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend server running on `http://localhost:5000`

### Installation

1. Clone the repository and navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure the API base URL in `.env` if needed (default: `http://localhost:5000/api`)

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── assets/           # Static assets
│   ├── components/       # Reusable components
│   │   ├── Layout.jsx
│   │   └── ProtectedRoute.jsx
│   ├── contexts/         # React contexts
│   │   └── AuthContext.jsx
│   ├── pages/           # Page components
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── FarmerDashboard.jsx
│   │   ├── VendorDashboard.jsx
│   │   ├── CustomerDashboard.jsx
│   │   ├── Orders.jsx
│   │   └── Unauthorized.jsx
│   ├── services/        # API services
│   │   └── api.js
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── public/              # Static assets
└── package.json
```

## Authentication

The application uses JWT-based authentication:
- Tokens are stored in localStorage
- Protected routes require authentication
- Role-based access control for different user types

## API Integration

All API calls are handled through the `services/api.js` module:
- Automatic token injection for authenticated requests
- Error handling
- Organized by feature (auth, farmer, vendor, customer, products, orders)

## Styling

The application uses Tailwind CSS v4 for styling:
- Utility-first CSS framework
- Responsive design
- Custom color scheme based on green theme
- Consistent component styling

## Key Features Implementation

### Authentication Flow
1. User registers/logs in
2. JWT token received and stored
3. User redirected to role-specific dashboard

### Role-Based Dashboards
- **Farmer**: Product management, sales analytics
- **Vendor**: Browse farmers' products, manage inventory, dual analytics
- **Customer**: Shopping cart, browse products, purchase history

### Shopping Cart (Customer)
- Add/remove items
- Quantity management
- Real-time total calculation
- Checkout with address

### Analytics
- Date-based sales/purchase tracking
- Revenue/expenditure calculations
- Tabular data presentation

## Contributing

1. Make sure the backend is running
2. Follow the existing code style
3. Test all user flows before committing
4. Update documentation as needed

## License

ISC
