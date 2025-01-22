import "@/styles/globals.css";
import { X } from "lucide-react";
import { ToastContainer, CloseButtonProps } from "react-toastify";
import type { AppProps } from "next/app";
import App, { AppContext } from "next/app";
import { parse } from "cookie";
import { useEffect } from "react";
import jwt from "jsonwebtoken";

import apiClient from "@/utils/apiClient";
import type { DecodedToken } from "@/types";

MyApp.getInitialProps = async (appContext: AppContext) => {
  const { ctx } = appContext; // Extract the context
  const { req } = ctx;

  let authToken = null;

  if (req) {
    // Parse cookies from the request
    const cookies = parse(req.headers.cookie || "");
    authToken = cookies.authToken || null; // Access authToken
  }

  // Call the default App's getInitialProps (optional, for pageProps)
  const appProps = await App.getInitialProps(appContext);

  return { ...appProps, authToken };
};
function MyApp({ Component, pageProps, authToken }: AppProps & { authToken?: string }) {
  useEffect(() => {
    // Add global configurations here
    const initializeConfig = () => {
      if (authToken) {
        try {
          const decodedToken = jwt.decode(authToken) as DecodedToken;
          // You can also use this decoded info to set any global state or config
          apiClient.setAuthToken(decodedToken.jwt);
        } catch (error) {
          console.error("Invalid token:", error);
        }
      }
    };

    initializeConfig();
  }, []);

  const CustomCloseButton = ({ closeToast }: CloseButtonProps) => {
    return (
      <button
        aria-label="remove"
        type="button"
        className="absolute right-4 top-6"
        onClick={() => {
          closeToast(true);
        }}
      >
        <X className="h-4 w-4" />
      </button>
    );
  };
  return (
    <>
      <ToastContainer closeButton={CustomCloseButton} />
      <Component {...pageProps} />
    </>
  );
}
export default MyApp;
