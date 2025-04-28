import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { UserContext } from "./context/UserContext";
import { UserProvider } from "./context/UserContext";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ReactNode, useContext } from "react";
import CustomNavbar from "./components/Navbar";
import Footer from "./components/Footer";
import MySpinner from './components/Spinner';
import Home from "./views/Home";
import Login from "./views/Login";
import Register from "./views/Register";
import Profile from "./views/Profile";
import CreatePost from "./views/CreatePost";
import Products from "./views/Products";
import ProductDetail from "./views/Product";
import MyProducts from "./views/MyProducts";
import Policies from "./views/Policies";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";

interface RouteProps {
  children: ReactNode;
}
function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <CustomNavbar />
        <MySpinner />
        <Routes>
     
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                <Route path="/policies" element={<Policies/>} />

                {/* Rutas protegidas */}
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/CreatePost" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
          <Route path="/MyProducts" element={<ProtectedRoute><MyProducts /></ProtectedRoute>} />

          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
      <div style={{minHeight: "46vh"}}></div>
      <Footer />
    </UserProvider>
  );
}





export default App;
