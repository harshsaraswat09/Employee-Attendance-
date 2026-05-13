import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./app.store.js";
import AppRoutes from "./app.routes.jsx";
import "./App.css";

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  );
};

export default App;