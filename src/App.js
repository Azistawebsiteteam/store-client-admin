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
import 'bootstrap/dist/css/bootstrap.css';
import './Pages/Admin.css';
import EditDiscount from './Discounts/EditDiscount';
import AddCustomer from './Customers/AddCustomer';

function App() {
  const adminToken = process.env.REACT_APP_ADMIN_JWT_TOKEN;
  const admJwt = Cookies.get(adminToken);

  return (
    <>
      {admJwt && <AdminNavbar />}
      <Routes>
        <Route path='/features' element={<FeaturesT />} />
        <Route path='/cart' element={<Cart />} />
        <Route
          path='/'
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path='/adminLoginPage' element={<AdminLoginPage />} />
        <Route
          path='/product/create'
          element={
            <ProtectedRoute>
              <AddProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path='/products'
          element={
            <ProtectedRoute>
              <ProductListing />
            </ProtectedRoute>
          }
        />
        <Route
          path='/adminSidebar'
          element={
            <ProtectedRoute>
              <AdminSideBar />
            </ProtectedRoute>
          }
        />
        <Route
          path='/slider/create'
          element={
            <ProtectedRoute>
              <AddSlider />
            </ProtectedRoute>
          }
        />
        <Route
          path='/collections'
          element={
            <ProtectedRoute>
              <Collections />
            </ProtectedRoute>
          }
        />
        <Route
          path='/collections/create'
          element={
            <ProtectedRoute>
              <CreateCollections />
            </ProtectedRoute>
          }
        />
        <Route
          path='/manageAccount'
          element={
            <ProtectedRoute>
              <ManageAccount />
            </ProtectedRoute>
          }
        />
        <Route
          path='/collection/update/:id'
          element={
            <ProtectedRoute>
              <UpdateCollection />
            </ProtectedRoute>
          }
        />
        <Route
          path='/slider'
          element={
            <ProtectedRoute>
              <SlidersListing />
            </ProtectedRoute>
          }
        />
        <Route
          path='/product-banners'
          element={
            <ProtectedRoute>
              <ProductBannerListing />
            </ProtectedRoute>
          }
        />
        <Route path='/edit/slider/:id' element={<EditSlider />} />
        <Route
          path='/product/update/:id'
          element={
            <ProtectedRoute>
              <UpdateProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path='/product/info/:id'
          element={
            <ProtectedRoute>
              <ProductInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path='/variant-details/:id'
          element={
            <ProtectedRoute>
              <VariantDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path='/variantEdit/:id'
          element={
            <ProtectedRoute>
              <VariantEdit />
            </ProtectedRoute>
          }
        />
        <Route path='/inventory' element={<Inventory />} />
        <Route
          path='/discount'
          element={
            <ProtectedRoute>
              <Discounts />
            </ProtectedRoute>
          }
        />
        <Route
          path='/discount/create'
          element={
            <ProtectedRoute>
              <CreateDiscount />
            </ProtectedRoute>
          }
        />
        <Route
          path='/discounts-edit/:id'
          element={
            <ProtectedRoute>
              <EditDiscount />
            </ProtectedRoute>
          }
        />
        <Route
          path='/brands'
          element={
            <ProtectedRoute>
              <Brands />
            </ProtectedRoute>
          }
        />
        <Route
          path='/brands/create'
          element={
            <ProtectedRoute>
              <CreateBrand />
            </ProtectedRoute>
          }
        />
        <Route
          path='/edit-brand/:id'
          element={
            <ProtectedRoute>
              <EditBrand />
            </ProtectedRoute>
          }
        />
        <Route path='/variantsNew' element={<VariantsComponent />} />
        <Route path='/review-list' element={<ReviewList />} />
        <Route path='/announcement/create' element={<CreateAnnouncement />} />
        <Route path='/announcements' element={<Announcements />} />
        <Route path='/announcement/edit/:id' element={<EditAnnouncement />} />
        <Route path='/customers' element={<CustomersListing />} />
        <Route path='/dummy' element={<Dummy />} />
        <Route path='/customer/:id' element={<Customers />} />
        <Route path='add-customer' element={<AddCustomer />} />
        <Route path='/orders' element={<OrdersListing />} />
        <Route path='/orders/:id' element={<OrderDetails />} />
        <Route path='/blogs' element={<BlogsListing />} />
        <Route path='/blogs/create' element={<BlogsCreate />} />
        <Route path='/blogs/edit/:id' element={<BlogsEdit />} />
        <Route path='/faqs' element={<FaqList />} />
        <Route path='/faqs/create' element={<FaqCreate />} />
        <Route path='/edit-faq/:id' element={<FaqEdit />} />
        <Route path='/Categories' element={<Categories />} />
        <Route path='/category/create' element={<CategoriesCreate />} />
        <Route path='/edit-category/:id' element={<CategoriesEdit />} />
        <Route path='/popup' element={<PopupListing />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
