import Cookies from 'js-cookie';
import axios from 'axios';
import ErrorHandler from '../Pages/ErrorHandler';

export const onStatusUpdate = async (id, status) => {
  const baseUrl = process.env.REACT_APP_API_URL;
  const jwtToken = Cookies.get(process.env.REACT_APP_ADMIN_JWT_TOKEN);
  try {
    const url = `${baseUrl}/admin/reviews/approve`;
    const headers = {
      Authorization: `Bearer ${jwtToken}`,
    };
    const body = {
      reviewId: id,
      isApproved: status,
    };
    const response = await axios.post(url, body, { headers });
    if (response.status === 200) {
      return response;
    }
  } catch (error) {
    ErrorHandler.onError(error);
  }
};
