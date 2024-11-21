// import axios from 'axios';
// import Cookies from 'js-cookie';

// import ErrorHandler from '../Pages/ErrorHandler';

// const baseUrl = `${process.env.REACT_APP_API_URL}/orders/admin`;
// const jwtToken = Cookies.get(process.env.REACT_APP_ADMIN_JWT_TOKEN);

// export const handleOrderConfirmation = async (
//   id,
//   orderStatus,
//   type,
//   invId
// ) => {
//   try {
//     if (type !== 'cancel' && invId === undefined) {
//       alert('Please select the Inventory');
//       return;
//     }

//     ErrorHandler.onLoading();

//     const payload = {
//       orderId: id,
//       orderStatus,
//       inventoryId: invId,
//       reason,
//       shippingMethod,
//     }; // Exclude `type` here
//     const response = await axios.post(`${baseUrl}/confirm`, payload, {
//       headers: { Authorization: `Bearer ${jwtToken}` },
//     });

//     ErrorHandler.onLoadingClose();
//     const updateOrders = orders.map((ord) => {
//       if (ord.azst_orders_id === id) {
//         return { ...ord, azst_orders_confirm_status: orderStatus };
//       }
//       return ord;
//     });
//     setOrders(updateOrders);
//   } catch (error) {
//     ErrorHandler.onLoadingClose();
//     ErrorHandler.onError(error);
//   }
// };
