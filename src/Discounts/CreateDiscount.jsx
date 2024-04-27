import React from 'react'
import AdminSideBar from '../Pages/AdminSideBar'
import DiscountForm from './DiscountForm'
import { useState } from 'react'
import '../Pages/Admin.css'

const CreateDiscount = () => {
    const [selectedDiscount, setDiscount] = useState('Amount of products')
    const [count, setCount] = useState(0)

    const handleDiscountsTab = (tab) => {
        setDiscount(tab)
        setCount(count + 1)
    }


    return (
        <div className='adminSec'>
            <AdminSideBar />
            <div className='commonSec'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-sm-12'>
                            <div className='d-flex justify-content-between mb-4'>
                                <h3>Create product discount</h3>
                            </div>
                        </div>
                        <div className='col-sm-12'>
                            <div className='bgStyle'>
                                <h5>Select discount type</h5>
                                <ul className='discountTabsCont'>
                                    <li className={`discountTab ${selectedDiscount === 'Amount of products' && 'activeDiscount'}`} onClick={() => handleDiscountsTab('Amount of products')}>
                                        <h6>Amount of products</h6>
                                        <span>(Product discount)</span>
                                        <p>Discount specific products or collections of products.</p>
                                    </li>
                                    <li className={`discountTab ${selectedDiscount === 'Buy X get Y' && 'activeDiscount'}`} onClick={() => handleDiscountsTab('Buy X get Y')}>
                                        <h6>Buy X get Y</h6>
                                        <span>(Product discount)</span>
                                        <p>Discount products based on a customer’s purchase.</p>
                                    </li>
                                    <li className={`discountTab ${selectedDiscount === 'Amount of Orders' && 'activeDiscount'}`} onClick={() => handleDiscountsTab('Amount of Orders')}>
                                        <h6>Amount of orders</h6>
                                        <span>(Order discount)</span>
                                        <p>Discount the total order amount.</p>
                                    </li>
                                    <li className={`discountTab ${selectedDiscount === 'Free shipping' && 'activeDiscount'}`} onClick={() => handleDiscountsTab('Free shipping')}>
                                        <h6>Free Shipping</h6>
                                        <span>Shipping discount</span>
                                        <p>Offer free shipping on an order.</p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <DiscountForm selectedDiscount={selectedDiscount} key={count} />
                    </div>
                </div>
            </div>
        </div>

    )
}

export default CreateDiscount