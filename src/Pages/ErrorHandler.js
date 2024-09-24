/* eslint-disable import/no-anonymous-default-export */
import Swal from "sweetalert2";

const onLoading = (message) => {
  return Swal.fire({
    text: message ?? "Loading",
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

const onLoadingClose = () => Swal.close();

const onSuccess = () => {
  return Swal.fire({
    position: "center",
    icon: "success",
    title: "Your work has been saved",
    showConfirmButton: false,
    timer: 2000,
  });
};

const onError = (error) => {
  let errorMessage = "Something went wrong";

  if (error.response) {
    if (error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    } else {
      errorMessage = "Internal Server Error";
    }
  } else if (error.message) {
    errorMessage = error.message;
  }

  return Swal.fire({
    icon: "error",
    title: error?.response?.status,
    text: errorMessage,
  });
};

export const showToast = (message) => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top",
    iconColor: "white",
    customClass: {
      popup: "color-toast",
    },
    timerProgressBar: true,
    showConfirmButton: false,
    timer: 3000,
  });
  return Toast.fire({
    icon: "warning",
    title: message,
    color: "white",
  });
};

export default { onError, onSuccess, onLoading, onLoadingClose };
