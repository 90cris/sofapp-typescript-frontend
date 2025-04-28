import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import jwtDecode from "jwt-decode";
import { formatPrice } from "../helpers/helpers";

interface DecodedToken {
  id_usuario: number | string;
}

interface Product {
  id: number;
  nombre: string;
  marca: string;
  precio: number;
  foto: string;
  stock: number;
}

interface MyProductsProps {
  onClick?: () => void;
}

const MyProducts = ({ onClick }: MyProductsProps) => {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("UserContext debe estar dentro del UserProvider");
  }
  const { getProductsByUser, fetchUpdateStock } = userContext;
  const [productos, setProductos] = useState<Product[]>([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const decodedToken = token ? jwtDecode<DecodedToken>(token) : null;
  const id_usuario = decodedToken ? decodedToken.id_usuario : null;

  useEffect(() => {
    const obtenerProductos = async () => {
      if (id_usuario) {
        const productosObtenidos = await getProductsByUser(id_usuario);
        const productosAdaptados: Product[] = productosObtenidos.map(
          (producto) => ({
            id: producto.id_producto,
            nombre: producto.nombre,
            marca: producto.marca,
            precio: producto.precio,
            foto: producto.foto,
            stock: producto.stock,
          })
        );
        setProductos(productosAdaptados);
      }
    };

    obtenerProductos();
  }, [id_usuario]);
  // Función para actualizar el stock localmente
  const actualizarStockLocal = (id: number, nuevoStock: number) => {
    setProductos((prevProductos) =>
      prevProductos.map((p) => (p.id === id ? { ...p, stock: nuevoStock } : p))
    );
  };

  // Incrementar stock
  const handleIncreaseStock = async (id: number, stockActual: number) => {
    if (stockActual < 5) {
      const nuevoStock = stockActual + 1;
      await fetchUpdateStock(id, 1);
      actualizarStockLocal(id, nuevoStock);
    }
  };

  // Decrementar stock
  const handleDecreaseStock = async (id: number, stockActual: number) => {
    if (stockActual > 0) {
      const nuevoStock = stockActual - 1;
      await fetchUpdateStock(id, -1);
      actualizarStockLocal(id, nuevoStock);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Mis productos</h1>
      <Row className="m-3">
        {productos.length > 0 ? (
          productos.map((producto) => (
            <Col key={producto.id} sm={6} md={4} lg={3}>
              <Card
                onClick={onClick}
                style={{ cursor: "pointer" }}
                className="h-100"
              >
                <Card.Body>
                  <Card.Title>{producto.nombre}</Card.Title>
                  <Card.Text>{producto.marca}</Card.Text>
                </Card.Body>
                <Card.Img variant="top" src={producto.foto} />
                <Card.Footer>
                  <Row className="d-flex justify-content-between align-items-center">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <strong>Precio:</strong>
                        </div>
                        <div>{formatPrice(producto.precio)}</div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <strong>Stock:</strong> {producto.stock}
                        </div>
                        <div>
                          <Button
                            variant="danger"
                            onClick={() =>
                              handleDecreaseStock(producto.id, producto.stock)
                            }
                            disabled={producto.stock === 0}
                          >
                            -
                          </Button>
                          <Button
                            variant="success"
                            onClick={() =>
                              handleIncreaseStock(producto.id, producto.stock)
                            }
                            disabled={producto.stock === 5}
                            className="ms-2"
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        textAlign: "center",
                        width: "100%",
                        marginTop: "8px",
                      }}
                    >
                      <Button
                        variant="warning"
                        onClick={() => navigate(`/product/${producto.id}`)}
                      >
                        Ver Detalles
                      </Button>
                    </div>
                  </Row>
                </Card.Footer>
              </Card>
            </Col>
          ))
        ) : (
          <p className="text-center">No tienes productos publicados.</p>
        )}
      </Row>
    </div>
  );
};

export default MyProducts;
