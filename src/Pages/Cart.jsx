import React, { useEffect } from 'react';
import axios from 'axios';

const body = {
  cartProducts: [
    {
      productId: 9,
      variantId: 4,
      collectionId: 2,
      quantity: 2,
    },
    {
      productId: 4,
      variantId: 3,
      collectionId: [2, 6],
      quantity: 10,
    },
  ],
};

const Cart = () => {
  const fetchIPAddress = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Failed to fetch IP address:', error);
      return null;
    }
  };

  const generateRandomKey = () => {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  };

  useEffect(() => {
    const initialize = async () => {
      // Check if the IP and key already exist in localStorage
      let storedIP = localStorage.getItem('e_com_cart_ky');
      if (!storedIP) {
        // Fetch the IP address if not found in localStorage
        storedIP = await fetchIPAddress();
        if (storedIP) {
          localStorage.setItem('e_com_cart_ky', storedIP);
        } else {
          const storedKey = generateRandomKey();
          localStorage.setItem('e_com_cart_ky', storedKey);
        }
      }
    };

    initialize();
  }, []);

  const submitCart = async () => {
    try {
      const url = 'http://192.168.212.94:5018/api/v1/cart';
      let sessionId = localStorage.getItem('e_com_cart_ky');
      const response = await axios.post(url, {
        ...body,
        customerId: 55,
        sessionId,
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <button onClick={submitCart}>Submit</button>
    </div>
  );
};

export default Cart;
