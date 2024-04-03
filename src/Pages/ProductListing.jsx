import React, { useEffect, useState } from 'react'
import AdminSideBar from './AdminSideBar'
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie'
import axios from 'axios'
import { IoMdEye } from "react-icons/io";
import swalHandle from './ErrorHandler'
import Swal from 'sweetalert2'

const ProductListing = () => {
    const [productsList, setProductsList] = useState([])

    const baseUrl = process.env.REACT_APP_API_URL
    const jwtToken = process.env.REACT_APP_ADMIN_JWT_TOKEN
    const token = Cookies.get(jwtToken)

    useEffect(() => {
        const productDetails = async () => {
            try {
                const url = `${baseUrl}/product/all-products`
                const headers = {
                    Authorization: `Bearer ${token} `
                }
                swalHandle.onLoading();
                const response = await axios.post(url, {}, { headers })
                Swal.close();
                setProductsList(response.data.products)
            } catch (error) {
                console.log(error)
            };
        }; productDetails();
    }, [token, baseUrl])
    console.log(productsList)
    return (
        <div className='adminSec'>
            <AdminSideBar />
            <div className='commonSec'>
                <div className='container'>
                    <div className='row'>
                        <div className='productsTopbar'>
                            <h3>Products</h3>
                            <Link to="/addProduct">Add Products</Link>
                        </div>
                        <div className='col-sm-12'>
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Product</th>
                                        <th scope="col"></th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Inventory</th>
                                        <th scope="col">Sales channels</th>
                                        <th scope="col">Markets</th>
                                        <th scope="col">Category</th>
                                        <th scope="col">Vendor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productsList.map(p => (
                                        <tr key={p.product_id}>
                                            <th className='col-1'><img src={p.image_src} alt='product' className='productThumbnail' /></th>
                                            <td className='col-2'><Link to={`/update-product/${p.product_id}`}>{p.product_title}</Link></td>
                                            <td><a target="__blank" href={p.url_handle}><IoMdEye /></a></td>
                                            <td>{p.status === 1 ? 'Active' : 'Draft'}</td>
                                            <td>{p.total_variants === 0 || null ? `${p.chintal_quantity + p.corporate_office_quantity} in stock` : `${p.total_variant_quantity} in stock for ${p.total_variants} variants`}</td>
                                            <td>null</td>
                                            <td>Indian Market</td>
                                            <td>{p.product_category}</td>
                                            <td>{p.azst_vendor_name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductListing