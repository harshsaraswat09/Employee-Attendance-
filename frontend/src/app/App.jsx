import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { useEffect } from "react";
import store from "./app.store.js";
import AppRoutes from "./app.routes.jsx";
import "./App.css";
import { useAuth } from "../features/auth/hook/useAuth.js";

const AppContent = () => {
  const { handleGetMe } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      handleGetMe();
    } else {
      store.dispatch({ type: "auth/setLoading", payload: false });
    }
  }, []);

  return <AppRoutes />;
};

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </Provider>
  );
};

export default App;