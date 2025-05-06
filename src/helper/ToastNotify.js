import { toast } from "react-toastify";

const toastSuccessNotify = (message) => {
  toast.success(message);
};

const toastErrorNotify = (message) => {
  toast.error(message);
};

const toastWarningNotify = (message) => {
  toast.warning(message);
};

// Add a default export
const ToastNotify = {
  toastSuccessNotify,
  toastErrorNotify,
  toastWarningNotify,
};

export default ToastNotify;
export { toastSuccessNotify, toastErrorNotify, toastWarningNotify };
