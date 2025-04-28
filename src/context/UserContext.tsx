import { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { AxiosError } from "axios";
import { ENDPOINT } from "../config/constants";
import { IUserContext, Product } from "./IUserContext";

export const UserContext = createContext<IUserContext | undefined>(undefined);
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [id_usuario, setUserId] = useState<number | string | null>(null);
  const [token, setToken] = useState<string>(
    localStorage.getItem("token") || ""
  );

  useEffect(() => {
    setUserId(localStorage.getItem("id_usuario") || "");
  }, []);

  const getProducts = async () => {
    try {
      const response = await fetch(ENDPOINT.products + "/todos");
      if (!response.ok) throw new Error("Error al obtener productos");

      const data = await response.json();

      if (!Array.isArray(data))
        throw new Error("La respuesta no es un array válido");

      setProducts(data);
      return data;
    } catch (error) {
      console.error("Error al obtener productos:", error);
      return [];
    }
  };

  const fetchProductById = async (id: number | string) => {
    try {
      const productId = typeof id === "string" ? parseInt(id, 10) : id;
      if (isNaN(productId)) throw new Error("ID de producto inválido");

      const response = await fetch(ENDPOINT.products + `/${productId}`);
      if (!response.ok) throw new Error("No se encontró el producto");

      return await response.json();
    } catch (error) {
      console.error("Error al obtener producto por ID:", error);
      return null;
    }
  };

  const fetchProductsByBrand = async (marca: string) => {
    try {
      const response = await fetch(ENDPOINT.products + `/marca/${marca}`);
      if (!response.ok) throw new Error("Error al obtener productos por marca");
      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error al obtener productos por marca:", error.message);
      } else {
        console.error("Error desconocido:", error);
      }
      return [];
    }
  };

  const fetchProductsByType = async (tipo: string) => {
    try {
      const response = await fetch(ENDPOINT.products + `/tipo/${tipo}`);
      if (!response.ok) throw new Error("Error al obtener productos por tipo");
      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error al obtener productos por tipo:", error.message);
      } else {
        console.error("Error desconocido:", error);
      }
      return [];
    }
  };

  const fetchProductsByBody = async (cuerpo: number | string) => {
    try {
      const response = await fetch(ENDPOINT.products + `/cuerpo/${cuerpo}`);
      if (!response.ok)
        throw new Error("Error al obtener productos por cuerpo");
      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error al obtener productos por cuerpo:", error.message);
      } else {
        console.error("Error desconocido:", error);
      }
      return [];
    }
  };

  const getProductsByUser = async (id_usuario: number | string) => {
    try {
      const response = await fetch(
        ENDPOINT.products + `/usuario/${id_usuario}`
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || "Error al obtener los productos.");
      }
      return data; // Devuelve la lista de productos
    } catch (error) {
      console.error("Error en fetchObtenerProductosUsuario:", error);
      return [];
    }
  };

  const fetchCreateProduct = async (producto: any) => {
    console.log("Enviando producto al backend:", producto);
    try {
      const response = await fetch(ENDPOINT.products + "/agregar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(producto),
      });
      return await response.json();
    } catch (error) {
      console.error("Error al crear producto:", error);
    }
  };

  const fetchRegisterUser = async (usuario: any) => {
    try {
      const response = await axios.post(ENDPOINT.users + "/register", usuario);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.msg || "Error desconocido");
      } else {
        throw new Error("Error desconocido");
      }
    }
  };

  const fetchUserLogin = async (email: string, pass: string) => {
    try {
      const response = await fetch(ENDPOINT.users + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, pass }),
      });

      const data = await response.json();

      if (response.status === 404 && data.msg === "EMAIL_NOT_FOUND") {
        throw new Error("EMAIL_NOT_FOUND");
      }

      if (!response.ok) {
        throw new Error("Error en las credenciales");
      }

      const { token } = data;

      if (!token)
        throw new Error("El backend no retornó id_usuario correctamente");

      localStorage.setItem("token", token);
      setToken(token);

      return token;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error al iniciar sesión:", error.message);
      } else {
        console.error("Error desconocido:", error);
      }
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");

    setToken("");
  };

  const fetchNewestProducts = async () => {
    try {
      const response = await fetch(ENDPOINT.products + "/cincoultimos");
      return await response.json();
    } catch (error) {
      console.error("Error al obtener los últimos 5 productos:", error);
      return [];
    }
  };
  const fetchUserDataByProduct = async (id_producto: number) => {
    try {
      // throw new Error("fetchUserDataByProduct");
      const response = await fetch(ENDPOINT.users + `/producto/${id_producto}`);
      if (!response.ok) {
        throw new Error("Error al obtener los datos del usuario.");
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const fetchUpdateStock = async (id_producto: number, cantidad: number) => {
    try {
      if (!id_producto || cantidad === undefined) {
        throw new Error("ID del producto y cantidad son obligatorios");
      }

      const response = await fetch(ENDPOINT.products + "/stock", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id_producto, cantidad }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al actualizar el stock");
      }

      console.log("Stock actualizado correctamente:", data);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error al obtener al actualizar stock:", error.message);
      } else {
        console.error("Error desconocido:", error);
      }
      return null;
    }
  };

  return (
    <UserContext.Provider
      value={{
        products,
        getProducts,
        fetchProductById,
        fetchProductsByBrand,
        fetchProductsByType,
        fetchProductsByBody,
        fetchCreateProduct,
        fetchRegisterUser,
        fetchUserLogin,
        token,
        setToken,
        logout,
        id_usuario,
        setUserId,
        getProductsByUser,
        fetchNewestProducts,
        fetchUserDataByProduct,
        fetchUpdateStock,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
export default UserContext;
