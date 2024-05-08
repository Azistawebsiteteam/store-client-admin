import { Routes, Route } from 'react-router-dom'
import Cookies from 'js-cookie';

import Home from './Pages/Home'
import ProtectedRoute from './protectRoute'
import AdminLoginPage from './AdminLoginPage'

import AddProduct from './Pages/AddProduct';



import AdminSideBar from './Pages/AdminSideBar';
import AddSlider from './Pages/AddSlider'
import AdminNavbar from './Pages/AdminNavbar';

import Collections from './Collections/Collections';
import ManageAccount from './Pages/ManageAccount';
import CreateCollections from './Collections/CreateCollections'
import UpdateCollection from './Collections/UpdateCollection';

import SlidersListing from './Pages/SlidersListing';
import ProductListing from './Pages/ProductListing';
import UpdateProduct from './Pages/UpdateProduct';
import Brands from './Pages/Brands';


import 'bootstrap/dist/css/bootstrap.css';
import './Pages/Admin.css';
import VariantDetails from './Pages/VariantDetails';
import VariantEdit from './Pages/VariantEdit';
import Orders from './Pages/Orders';
import Inventory from './Pages/Inventory';
import NotFound from './Pages/NotFound';
import Discounts from './Discounts/Discounts';
import CreateDiscount from './Discounts/CreateDiscount';
import CreateBrand from './Pages/CreateBrand';
import EditBrand from './Pages/EditBrand';
import VariantsComponent from './Pages/VariantsComponent';



function App() {

  const adminToken = process.env.REACT_APP_ADMIN_JWT_TOKEN
  const admJwt = Cookies.get(adminToken)


  return (
    <>
      {admJwt && <AdminNavbar />}
      <Routes>
        <Route path='/' element={<ProtectedRoute ><Home /></ProtectedRoute>} />
        <Route path="/adminLoginPage" element={<AdminLoginPage />} />
        <Route path="/product/create" element={<ProtectedRoute ><AddProduct /></ProtectedRoute>} />
        <Route path='/products' element={<ProtectedRoute ><ProductListing /></ProtectedRoute>} />
        <Route path='/adminSidebar' element={<ProtectedRoute ><AdminSideBar /></ProtectedRoute>} />
        <Route path='/slider/create' element={<ProtectedRoute ><AddSlider /></ProtectedRoute>} />
        <Route path='/collections' element={<ProtectedRoute ><Collections /></ProtectedRoute>} />
        <Route path='/collections/create' element={<ProtectedRoute ><CreateCollections /></ProtectedRoute>} />
        <Route path='/manageAccount' element={<ProtectedRoute ><ManageAccount /></ProtectedRoute>} />
        <Route path='/collection/update/:id' element={<ProtectedRoute ><UpdateCollection /></ProtectedRoute>} />
        <Route path='/slider' element={<ProtectedRoute ><SlidersListing /></ProtectedRoute>} />
        <Route path='/product/update/:id' element={<ProtectedRoute ><UpdateProduct /></ProtectedRoute>} />
        <Route path='/variant-details/:id' element={<ProtectedRoute><VariantDetails /></ProtectedRoute>} />
        <Route path="/variantEdit/:id" element={<ProtectedRoute><VariantEdit /></ProtectedRoute>} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path='/discount' element={<ProtectedRoute><Discounts /></ProtectedRoute>} />
        <Route path="/discount/create" element={<ProtectedRoute><CreateDiscount /></ProtectedRoute>} />
        <Route path="/brands" element={<ProtectedRoute><Brands /></ProtectedRoute>} />
        <Route path="/brands/create" element={<ProtectedRoute><CreateBrand /></ProtectedRoute>} />
        <Route path="/edit-brand/:id" element={<ProtectedRoute><EditBrand /></ProtectedRoute>} />
        <Route path='/variantsNew' element={<VariantsComponent />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
