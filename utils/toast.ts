import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const showToast = async (msg: string, type: "info" | "success" | "warning" | "error" | "default") => {
    return toast(msg, {
        type: type,
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "light",
    });
};
export default showToast;