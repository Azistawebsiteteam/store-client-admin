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



import 'bootstrap/dist/css/bootstrap.css';
import './Pages/Admin.css';
import VariantDetails from './Pages/VariantDetails';
import VariantEdit from './Pages/VariantEdit';
import Orders from './Pages/Orders';
import Inventory from './Pages/Inventory';
import NotFound from './Pages/NotFound';



function App() {

  const adminToken = process.env.REACT_APP_ADMIN_JWT_TOKEN
  const admJwt = Cookies.get(adminToken)


  return (
    <>
      {admJwt && <AdminNavbar />}
      <Routes>
        <Route path='/' element={<ProtectedRoute ><Home /></ProtectedRoute>} />
        <Route path="/adminLoginPage" element={<AdminLoginPage />} />
        <Route path="/addProduct" element={<ProtectedRoute ><AddProduct /></ProtectedRoute>} />
        <Route path='/productListing' element={<ProtectedRoute ><ProductListing /></ProtectedRoute>} />
        <Route path='/adminSidebar' element={<ProtectedRoute ><AdminSideBar /></ProtectedRoute>} />
        <Route path='/sliderCreate' element={<ProtectedRoute ><AddSlider /></ProtectedRoute>} />
        <Route path='/collections' element={<ProtectedRoute ><Collections /></ProtectedRoute>} />
        <Route path='/createCollections' element={<ProtectedRoute ><CreateCollections /></ProtectedRoute>} />
        <Route path='/manageAccount' element={<ProtectedRoute ><ManageAccount /></ProtectedRoute>} />
        <Route path='/updateCollection/:id' element={<ProtectedRoute ><UpdateCollection /></ProtectedRoute>} />
        <Route path='/slidersListing' element={<ProtectedRoute ><SlidersListing /></ProtectedRoute>} />
        <Route path='/update-product/:id' element={<ProtectedRoute ><UpdateProduct /></ProtectedRoute>} />
        <Route path='/variant-details/:id' element={<ProtectedRoute><VariantDetails /></ProtectedRoute>} />
        <Route path="/variantEdit/:id" element={<ProtectedRoute><VariantEdit /></ProtectedRoute>} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
