import { Routes, Route } from 'react-router-dom';
import Cookies from 'js-cookie';

import Home from './Pages/Home';
import ProtectedRoute from './protectRoute';
import AdminLoginPage from './AdminLoginPage';
import AddProduct from './Pages/AddProduct';
import AdminSideBar from './Pages/AdminSideBar';
import AddSlider from './Banners/AddSlider';
import AdminNavbar from './Pages/AdminNavbar';
import Collections from './Collections/Collections';
import ManageAccount from './Pages/ManageAccount';
import CreateCollections from './Collections/CreateCollections';
import UpdateCollection from './Collections/UpdateCollection';
import SlidersListing from './Banners/SlidersListing';
import ProductListing from './Pages/ProductListing';
import UpdateProduct from './Pages/UpdateProduct';
import Brands from './Brands/Brands';
import VariantDetails from './Pages/VariantDetails';
import VariantEdit from './Pages/VariantEdit';
import Inventory from './Inventory/Inventory';
import NotFound from './Pages/NotFound';
import Discounts from './Discounts/Discounts';
import CreateDiscount from './Discounts/CreateDiscount';
import CreateBrand from './Brands/CreateBrand';
import EditBrand from './Brands/EditBrand';
import VariantsComponent from './Pages/VariantsComponent';
import ReviewList from './Pages/ReviewList';
import EditSlider from './Banners/EditSlider';
import CreateAnnouncement from './AnnouncementBar/CreateAnnouncement';
import Announcements from './AnnouncementBar/Announcements';
import Dummy from './Pages/Dummy';
import EditAnnouncement from './AnnouncementBar/EditAnnouncement';
import CustomersListing from './Customers/CustomersListing';
import Customers from './Customers/Customers';
import OrdersListing from './Orders/OrdersListing';
import OrderDetails from './Orders/OrderDetails';
import BlogsListing from './Blogs/BlogsListing';
import BlogsCreate from './Blogs/BlogsCreate';
import BlogsEdit from './Blogs/BlogEdit';
import Categories from './Categories/Categories';
import CategoriesCreate from './Categories/CategoriesCreate';
import CategoriesEdit from './Categories/CategoryEdit';
import FaqList from './Faqs/FaqList';
import ProductBannerListing from './Banners/ProductBannerListing';
import FaqCreate from './Faqs/FaqCreate';
import FaqEdit from './Faqs/FaqEdit';
import ProductInfo from './Pages/ProductInfo';
import FeaturesT from './Components/FeaturesT';
import Cart from './Pages/Cart';
import PopupListing from './Popup/PopupListing';

import EditDiscount from './Discounts/EditDiscount';
import AddCustomer from './Customers/AddCustomer';
import ResetPassword from './Pages/ResetPassword';

import 'bootstrap/dist/css/bootstrap.css';
import './Pages/Admin.css';

// function App() {
//   const adminToken = process.env.REACT_APP_ADMIN_JWT_TOKEN;
//   const admJwt = Cookies.get(adminToken);

//   return (
//     <>
//       {admJwt && <AdminNavbar />}
//       <Routes>
//         <Route path='/features' element={<FeaturesT />} />
//         <Route path='/cart' element={<Cart />} />
//         <Route
//           path='/'
//           element={
//             <ProtectedRoute>
//               <Home />
//             </ProtectedRoute>
//           }
//         />
//         <Route path='/adminLoginPage' element={<AdminLoginPage />} />
//         <Route
//           path='/product/create'
//           element={
//             <ProtectedRoute>
//               <AddProduct />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path='/products'
//           element={
//             <ProtectedRoute>
//               <ProductListing />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path='/adminSidebar'
//           element={
//             <ProtectedRoute>
//               <AdminSideBar />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path='/slider/create'
//           element={
//             <ProtectedRoute>
//               <AddSlider />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path='/collections'
//           element={
//             <ProtectedRoute>
//               <Collections />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path='/collections/create'
//           element={
//             <ProtectedRoute>
//               <CreateCollections />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path='/manageAccount'
//           element={
//             <ProtectedRoute>
//               <ManageAccount />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path='/collection/update/:id'
//           element={
//             <ProtectedRoute>
//               <UpdateCollection />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path='/slider'
//           element={
//             <ProtectedRoute>
//               <SlidersListing />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path='/product-banners'
//           element={
//             <ProtectedRoute>
//               <ProductBannerListing />
//             </ProtectedRoute>
//           }
//         />
//         <Route path='/edit/slider/:id' element={<EditSlider />} />
//         <Route
//           path='/product/update/:id'
//           element={
//             <ProtectedRoute>
//               <UpdateProduct />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path='/product/info/:id'
//           element={
//             <ProtectedRoute>
//               <ProductInfo />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path='/variant-details/:id'
//           element={
//             <ProtectedRoute>
//               <VariantDetails />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path='/variantEdit/:id'
//           element={
//             <ProtectedRoute>
//               <VariantEdit />
//             </ProtectedRoute>
//           }
//         />
//         <Route path='/inventory' element={<Inventory />} />
//         <Route
//           path='/discount'
//           element={
//             <ProtectedRoute>
//               <Discounts />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path='/discount/create'
//           element={
//             <ProtectedRoute>
//               <CreateDiscount />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path='/discounts-edit/:id'
//           element={
//             <ProtectedRoute>
//               <EditDiscount />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path='/brands'
//           element={
//             <ProtectedRoute>
//               <Brands />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path='/brands/create'
//           element={
//             <ProtectedRoute>
//               <CreateBrand />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path='/edit-brand/:id'
//           element={
//             <ProtectedRoute>
//               <EditBrand />
//             </ProtectedRoute>
//           }
//         />
//         <Route path='/variantsNew' element={<VariantsComponent />} />
//         <Route path='/review-list' element={<ReviewList />} />
//         <Route path='/announcement/create' element={<CreateAnnouncement />} />
//         <Route path='/announcements' element={<Announcements />} />
//         <Route path='/announcement/edit/:id' element={<EditAnnouncement />} />
//         <Route path='/customers' element={<CustomersListing />} />
//         <Route path='/dummy' element={<Dummy />} />
//         <Route path='/customer/:id' element={<Customers />} />
//         <Route path='add-customer' element={<AddCustomer />} />
//         <Route path='/orders' element={<OrdersListing />} />
//         <Route path='/orders/:id' element={<OrderDetails />} />
//         <Route path='/blogs' element={<BlogsListing />} />
//         <Route path='/blogs/create' element={<BlogsCreate />} />
//         <Route path='/blogs/edit/:id' element={<BlogsEdit />} />
//         <Route path='/faqs' element={<FaqList />} />
//         <Route path='/faqs/create' element={<FaqCreate />} />
//         <Route path='/edit-faq/:id' element={<FaqEdit />} />
//         <Route path='/Categories' element={<Categories />} />
//         <Route path='/category/create' element={<CategoriesCreate />} />
//         <Route path='/edit-category/:id' element={<CategoriesEdit />} />
//         <Route path='/popup' element={<PopupListing />} />
//         <Route path='/reset-password' element={<ResetPawword />} />
//         <Route path='*' element={<NotFound />} />
//       </Routes>
//     </>
//   );
// }

// export default App;

function App() {
  const adminToken = process.env.REACT_APP_ADMIN_JWT_TOKEN;
  const admJwt = Cookies.get(adminToken);

  return (
    <>
      {/* Render AdminNavbar only if JWT exists */}
      {admJwt && <AdminNavbar />}

      <Routes>
        {/* Unprotected Routes */}
        <Route path='/adminLoginPage' element={<AdminLoginPage />} />

        {/* Protected Routes */}
        <Route path='/' element={<ProtectedRoute element={Home} />} />
        <Route
          path='/reset-password'
          element={<ProtectedRoute element={ResetPassword} />}
        />
        <Route
          path='/product/create'
          element={<ProtectedRoute element={AddProduct} />}
        />
        <Route
          path='/products'
          element={<ProtectedRoute element={ProductListing} />}
        />
        <Route
          path='/adminSidebar'
          element={<ProtectedRoute element={AdminSideBar} />}
        />
        <Route
          path='/slider/create'
          element={<ProtectedRoute element={AddSlider} />}
        />
        <Route
          path='/product-banners'
          element={<ProtectedRoute element={ProductBannerListing} />}
        />
        <Route
          path='/collections'
          element={<ProtectedRoute element={Collections} />}
        />
        <Route
          path='/collections/create'
          element={<ProtectedRoute element={CreateCollections} />}
        />
        <Route
          path='/manageAccount'
          element={<ProtectedRoute element={ManageAccount} />}
        />
        <Route
          path='/collection/update/:id'
          element={<ProtectedRoute element={UpdateCollection} />}
        />
        <Route
          path='/slider'
          element={<ProtectedRoute element={SlidersListing} />}
        />
        <Route
          path='/edit/slider/:id'
          element={<ProtectedRoute element={EditSlider} />}
        />
        <Route
          path='/product/update/:id'
          element={<ProtectedRoute element={UpdateProduct} />}
        />
        <Route
          path='/product/info/:id'
          element={<ProtectedRoute element={ProductInfo} />}
        />
        <Route
          path='/variant-details/:id'
          element={<ProtectedRoute element={VariantDetails} />}
        />
        <Route
          path='/variantEdit/:id'
          element={<ProtectedRoute element={VariantEdit} />}
        />
        <Route
          path='/inventory'
          element={<ProtectedRoute element={Inventory} />}
        />
        <Route
          path='/discount'
          element={<ProtectedRoute element={Discounts} />}
        />
        <Route
          path='/discount/create'
          element={<ProtectedRoute element={CreateDiscount} />}
        />
        <Route
          path='/discounts-edit/:id'
          element={<ProtectedRoute element={EditDiscount} />}
        />
        <Route path='/brands' element={<ProtectedRoute element={Brands} />} />
        <Route
          path='/brands/create'
          element={<ProtectedRoute element={CreateBrand} />}
        />
        <Route
          path='/edit-brand/:id'
          element={<ProtectedRoute element={EditBrand} />}
        />
        <Route
          path='/variantsNew'
          element={<ProtectedRoute element={VariantsComponent} />}
        />
        <Route
          path='/review-list'
          element={<ProtectedRoute element={ReviewList} />}
        />
        <Route
          path='/announcement/create'
          element={<ProtectedRoute element={CreateAnnouncement} />}
        />
        <Route
          path='/announcements'
          element={<ProtectedRoute element={Announcements} />}
        />
        <Route
          path='/announcement/edit/:id'
          element={<ProtectedRoute element={EditAnnouncement} />}
        />
        <Route
          path='/customers'
          element={<ProtectedRoute element={CustomersListing} />}
        />

        <Route
          path='/customer/:id'
          element={<ProtectedRoute element={Customers} />}
        />
        <Route
          path='/add-customer'
          element={<ProtectedRoute element={AddCustomer} />}
        />
        <Route
          path='/orders'
          element={<ProtectedRoute element={OrdersListing} />}
        />
        <Route
          path='/orders/:id'
          element={<ProtectedRoute element={OrderDetails} />}
        />
        <Route
          path='/blogs'
          element={<ProtectedRoute element={BlogsListing} />}
        />
        <Route
          path='/blogs/create'
          element={<ProtectedRoute element={BlogsCreate} />}
        />
        <Route
          path='/blogs/edit/:id'
          element={<ProtectedRoute element={BlogsEdit} />}
        />
        <Route path='/faqs' element={<ProtectedRoute element={FaqList} />} />
        <Route
          path='/faqs/create'
          element={<ProtectedRoute element={FaqCreate} />}
        />
        <Route
          path='/edit-faq/:id'
          element={<ProtectedRoute element={FaqEdit} />}
        />
        <Route
          path='/Categories'
          element={<ProtectedRoute element={Categories} />}
        />
        <Route
          path='/category/create'
          element={<ProtectedRoute element={CategoriesCreate} />}
        />
        <Route
          path='/edit-category/:id'
          element={<ProtectedRoute element={CategoriesEdit} />}
        />
        <Route
          path='/popup'
          element={<ProtectedRoute element={PopupListing} />}
        />
        <Route
          path='/features'
          element={<ProtectedRoute element={FeaturesT} />}
        />
        <Route path='/cart' element={<ProtectedRoute element={Cart} />} />
        <Route path='/dummy' element={<ProtectedRoute element={Dummy} />} />
        {/* Fallback NotFound Route */}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
