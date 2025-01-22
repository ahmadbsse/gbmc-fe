import axios from "axios";

class ApiClient {
  constructor(baseURL) {
    this.client = axios.create({
      baseURL,
      timeout: 10000, // Set a timeout for all requests
      headers: {
        "Content-Type": "application/json",
      },
    });
    this.client.defaults.withCredentials = true;
    // Add a response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          console.error("Response error:", error.response.data);
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Error setting up request:", error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  setAuthToken(token) {
    if (token) {
      this.client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete this.client.defaults.headers.common["Authorization"];
    }
  }

  async GET(url, config = {}) {
    try {
      const response = await this.client.get(url, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async POST(url, payload = {}, config = {}) {
    try {
      const response = await this.client.post(url, payload, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async PUT(url, payload = {}, config = {}) {
    try {
      const response = await this.client.put(url, payload, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async DELETE(url, config = {}) {
    try {
      const response = await this.client.delete(url, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }
  async UPLOAD(url, formData, config = {}) {
    try {
      const response = await this.client.post(url, formData, {
        ...config,
        headers: {
          ...config.headers,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error; // Re-throw for further handling
    }
  }
  handleError(error) {
    const err = error.response?.data?.error;
    if (err) {
      if (err.status === 403) {
        this.setAuthToken(null);
      }
      console.error("API Error:", err); // Logs the full error object
      throw err;
    } else {
      throw error;
    }
  }
}

const apiClient = new ApiClient(process.env.NEXT_PUBLIC_API_BASE_URL + "/api" || "");

export default apiClient;
