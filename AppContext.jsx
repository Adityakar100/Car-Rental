import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// ✅ Set base URL for API from environment variable
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

// ✅ Optional: Automatically attach token to every request
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `${token}`;
  }
  return config;
});

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY;

  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [cars, setCars] = useState([]);

  // ✅ Fetch logged-in user details
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/data");

      if (data?.user) {
        setUser(data.user);
        setIsOwner(data.user.role === "owner");
      } else {
        toast.error(data.message || "Failed to fetch user");
        navigate("/");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error fetching user");
    }
  };

  // ✅ Fetch all cars
  const fetchCars = async () => {
    try {
      const { data } = await axios.get("/api/user/cars");

      if (data?.cars) {
        setCars(data.cars);
      } else {
        toast.error(data.message || "No cars found");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error fetching cars");
    }
  };

  // ✅ Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsOwner(false);
    axios.defaults.headers.common["Authorization"] = "";
    toast.success("You have been logged out");
  };

  // ✅ On app load: get token from localStorage, fetch cars
  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("token");
    if (tokenFromStorage) {
      setToken(tokenFromStorage);
    }
    fetchCars();
  }, []);

  // ✅ When token is available, fetch user
  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token]);

  const value = {
    navigate,
    currency,
    axios,
    user,
    setUser,
    token,
    setToken,
    isOwner,
    setIsOwner,
    fetchUser,
    showLogin,
    setShowLogin,
    logout,
    fetchCars,
    cars,
    setCars,
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
