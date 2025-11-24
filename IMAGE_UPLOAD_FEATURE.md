# Image Upload Feature Documentation

## Overview
Farmers can now upload images of their products when creating or editing product listings. These images are displayed throughout the platform for vendors and customers to view.

## Features Implemented

### 1. Backend Changes

#### Database Schema
- **FarmerProduct Model**: Added `imageUrl` field (String, optional)
- **VendorProduct Model**: Added `imageUrl` field (String, optional)
  - Images are automatically copied from farmer products when vendors purchase

#### File Upload Middleware
- **Location**: `backend/middleware/uploadMiddleware.js`
- **Technology**: Multer
- **Storage**: Local filesystem (`backend/uploads/products/`)
- **File Restrictions**:
  - Accepted formats: JPEG, JPG, PNG, GIF, WEBP
  - Maximum size: 5MB
- **Naming Convention**: `originalname-timestamp-randomstring.ext`

#### API Endpoints
- `POST /api/farmer/product` - Create product with optional image
- `PUT /api/farmer/updateProduct/:productId` - Update product with optional new image
  - Old images are automatically deleted when replaced
- `DELETE /api/farmer/deleteProduct/:productId` - Deletes associated image file
- `GET /uploads/products/:filename` - Static file serving for images

#### Controllers
- **farmerController.js**: Updated to handle file uploads and deletions
- Image files are cleaned up when products are deleted or images are replaced

### 2. Frontend Changes

#### Farmer Dashboard
- **Image Upload Field**: File input with image preview
- **Image Preview**: Shows selected image before upload or existing image when editing
- **Product Cards**: Display product images with fallback for missing images

#### Vendor Dashboard
- **Browse Products**: Shows farmer product images
- **Inventory**: Displays images inherited from farmer products

#### Customer Dashboard
- **Shop Products**: Shows product images with category badges
- **Shopping Cart**: Shows product thumbnails in cart items

### 3. Features

#### Image Management
- Upload image when creating a product (optional)
- Replace image when editing a product (optional)
- Automatic deletion of old images when replaced
- Automatic deletion of images when products are deleted
- Image preview before upload
- Fallback placeholder for products without images

#### Image Inheritance
When a vendor purchases from a farmer, the product image is automatically copied to the vendor's inventory.

#### Error Handling
- Invalid file types are rejected
- File size limit enforced (5MB)
- Fallback images displayed when image fails to load
- Graceful error handling if image files are missing

## Technical Details

### File Structure
```
backend/
├── middleware/
│   └── uploadMiddleware.js          # Multer configuration
├── uploads/
│   └── products/
│       ├── .gitkeep                 # Directory tracking
│       └── [uploaded images]        # Actual images (gitignored)
├── models/
│   ├── farmerProduct.js             # Updated with imageUrl
│   └── vendorProduct.js             # Updated with imageUrl
├── controllers/
│   └── farmerController.js          # Updated for image handling
└── services/
    └── purchaseService.js           # Updated to copy imageUrl
```

### Frontend API Integration
```javascript
// Updated farmerAPI in api.js
createProduct: (data) => {
  const config = data instanceof FormData 
    ? { headers: { 'Content-Type': 'multipart/form-data' } }
    : {};
  return api.post('/farmer/product', data, config);
}
```

### Image URL Format
- Stored in database: `/uploads/products/filename.ext`
- Accessed via: `http://localhost:5000/uploads/products/filename.ext`
- Frontend displays: `<img src={`http://localhost:5000${product.imageUrl}`} />`

## Usage

### For Farmers
1. Go to Farmer Dashboard
2. Click "+ Add Product"
3. Fill in product details
4. Click "Choose File" under "Product Image"
5. Select an image (max 5MB, formats: jpg, png, gif, webp)
6. Preview appears below the file input
7. Click "Add Product" to save

### Editing Products
1. Click "Edit" on any product card
2. Current image preview is displayed (if exists)
3. Select a new image to replace the old one
4. Click "Update Product"

### For Vendors
- Product images from farmers are automatically displayed in "Browse Products"
- When you purchase from a farmer, the image is copied to your inventory

### For Customers
- View product images when browsing
- See product thumbnails in the shopping cart

## Security Considerations

1. **File Type Validation**: Only image files are accepted
2. **File Size Limit**: 5MB maximum to prevent abuse
3. **Unique Filenames**: Prevents filename collisions
4. **File Cleanup**: Orphaned images are deleted when products are removed
5. **Static File Serving**: Direct access via URL (consider adding authentication in production)

## Future Enhancements

1. **Cloud Storage**: Migrate to AWS S3 or Cloudinary for better scalability
2. **Image Optimization**: Automatic resizing and compression
3. **Multiple Images**: Support for product image galleries
4. **Image Validation**: Server-side image dimension and quality checks
5. **CDN Integration**: Faster image delivery
6. **Authentication**: Protect image URLs with token-based access

## Deployment Notes

1. Ensure the `uploads/products/` directory exists and has write permissions
2. For production, consider using environment variables for upload paths
3. Implement proper backup strategy for uploaded images
4. Consider implementing image CDN for better performance
5. Add rate limiting for upload endpoints to prevent abuse

## Testing

### Manual Testing Checklist
- [ ] Create product with image
- [ ] Create product without image
- [ ] Edit product and add image
- [ ] Edit product and replace image (old image should be deleted)
- [ ] Delete product (image should be deleted)
- [ ] Vendor purchases from farmer (image should be inherited)
- [ ] Images display in farmer dashboard
- [ ] Images display in vendor browse/inventory
- [ ] Images display in customer shop/cart
- [ ] Invalid file type is rejected
- [ ] File size limit is enforced

## Dependencies Added
- **multer**: `^1.4.5-lts.1` - Middleware for handling multipart/form-data

## Version
- Initial Release: v1.0.0
- Date: November 23, 2025


