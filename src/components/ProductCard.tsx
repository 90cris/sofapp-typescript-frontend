import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import jwtDecode from "jwt-decode";
import { formatPrice } from "../helpers/helpers";
import { Product } from "../context/IUserContext";

interface ProductCardProps {
  producto: Product;
  onClick: () => void;
}

interface DecodedToken {
  id_usuario: number;
  [key: string]: any;
}

const ProductCard = ({ producto, onClick }: ProductCardProps) => {
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
        setProductos(productosObtenidos);
      }
    };

    obtenerProductos();
  }, [id_usuario]);

  const actualizarStockLocal = (id_producto: number, nuevoStock: number) => {
    setProductos((prevProductos) =>
      prevProductos.map((p) =>
        p.id_producto === id_producto ? { ...p, stock: nuevoStock } : p
      )
    );
  };

  const handleIncreaseStock = async (
    id_producto: number,
    stockActual: number
  ) => {
    if (stockActual < 5) {
      const nuevoStock = stockActual + 1;
      await fetchUpdateStock(id_producto, 1);
      actualizarStockLocal(id_producto, nuevoStock);
    }
  };

  const handleDecreaseStock = async (
    id_producto: number,
    stockActual: number
  ) => {
    if (stockActual > 0) {
      const nuevoStock = stockActual - 1;
      await fetchUpdateStock(id_producto, -1);
      actualizarStockLocal(id_producto, nuevoStock);
    }
  };

  return (
    <Row className="m-3">
      {productos.length > 0 ? (
        productos.map((producto) => (
          <Col key={producto.id_producto} sm={6} md={4} lg={3} className="">
            <Card
              onClick={onClick}
              style={{ cursor: "pointer" }}
              className="h-100"
            >
              <Card.Img variant="top" src={producto.foto} />
              <Card.Body>
                <Card.Title>{producto.nombre}</Card.Title>
                <Card.Text>{producto.marca}</Card.Text>
              </Card.Body>
              <Card.Footer>
                <Row>
                  <Col className="text-center align-self-center">
                    <strong>Precio:</strong> {formatPrice(producto.precio)}
                  </Col>

                  <Col className="text-center align-self-center">
                    <strong>Stock:</strong> {producto.stock}
                  </Col>

                  <Col className="text-center">
                    <Button
                      variant="danger"
                      onClick={() =>
                        handleDecreaseStock(
                          producto.id_producto,
                          producto.stock
                        )
                      }
                      disabled={producto.stock === 0}
                    >
                      -
                    </Button>
                    <Button
                      variant="success"
                      onClick={() =>
                        handleIncreaseStock(
                          producto.id_producto,
                          producto.stock
                        )
                      }
                      disabled={producto.stock === 5}
                      className="ms-2"
                    >
                      +
                    </Button>
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col>
                    <Button
                      variant="warning"
                      onClick={() =>
                        navigate(`/product/${producto.id_producto}`)
                      }
                    >
                      Ver Detalles
                    </Button>
                  </Col>
                </Row>
              </Card.Footer>
            </Card>
          </Col>
        ))
      ) : (
        <p>No tienes productos publicados.</p>
      )}
    </Row>
  );
};

export default ProductCard;
