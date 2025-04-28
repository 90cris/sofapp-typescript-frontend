import { ReactNode } from "react";

export interface Product {
  id_producto: number;
  nombre: string;
  marca: string;
  tipo: string;
  cuerpo: number;
  foto: string;
  precio: number;
  stock: number;
  color: string;
  ancho: number;
  alto: number;
  detalle: string;
}
export interface User {
  nombre: string;
  apellido: string;
  email: string;
  pass: string;
  fono: string;
}

export interface IUserContext {
  products: Product[];
  token: string;
  id_usuario: number | string | null;
  setToken: (token: string) => void;
  setUserId: (id: number | string) => void;
  logout: () => void;

  getProducts: () => Promise<Product[]>;
  getProductsByUser: (id_usuario: number | string) => Promise<Product[]>;
  fetchProductById: (id: number | string) => Promise<Product | null>;
  fetchProductsByBrand: (marca: string) => Promise<Product[]>;
  fetchProductsByType: (tipo: string) => Promise<Product[]>;
  fetchProductsByBody: (cuerpo: number | string) => Promise<Product[]>;
  fetchCreateProduct: (producto: any) => Promise<any>;
  fetchRegisterUser: (usuario: any) => Promise<any>;
  fetchUserLogin: (email: string, pass: string) => Promise<string>;
  fetchNewestProducts: () => Promise<Product[]>;
  fetchUserDataByProduct: (id_producto: number) => Promise<any>;
  fetchUpdateStock: (id_producto: number, cantidad: number) => Promise<any>;
}
