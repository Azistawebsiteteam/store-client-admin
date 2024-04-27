import React from 'react'
import AdminSideBar from '../Pages/AdminSideBar'
import { Link } from 'react-router-dom'
import '../Pages/Admin.css'


const Discounts = () => {
    return (
        <div className='adminSec'>
            <AdminSideBar />
            <div className='commonSec'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-sm-12'>
                            <div className='col-sm-12'>
                                <div className='d-flex justify-content-between mb-4'>
                                    <h3>List of Discounts</h3>
                                    <Link to="/discount/create">Create Discount</Link>
                                </div>
                            </div>
                            <div className='col-sm-12'>
                                <div>
                                    <table class="table table-hover">
                                        <thead>
                                            <tr>
                                                <th scope="col">#</th>
                                                <th scope="col">Title</th>
                                                <th scope="col">Status</th>
                                                <th scope="col">Method</th>
                                                <th scope="col">Type</th>
                                                <th scope="col">Combinations</th>
                                                <th scope="col">Used</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <th scope="row">1</th>
                                                <td>Mark</td>
                                                <td>Otto</td>
                                                <td>@mdo</td>
                                                <td>@mdo</td>
                                                <td>@mdo</td>
                                                <td>@mdo</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Discounts