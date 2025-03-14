import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { decodeText } from "@/utils";

// function capitalizeFirstLetter(sentence: string) {
//     return sentence
//         .split(' ')
//         .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
//         .join(' ');
// }
const showToast = async (msg: string, type: "info" | "success" | "warning" | "error" | "default", isCapitalize = false) => {
    let message = msg;
    if (isCapitalize) {
        message = msg.charAt(0).toUpperCase() + msg.slice(1).toLowerCase();
    }
    else {
        message = msg.toLowerCase();
    }
    message = decodeText(message);
    return toast(message, {
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