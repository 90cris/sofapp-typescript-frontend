import React, { useState, useContext } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { UserContext } from "../context/UserContext";
import jwtDecode from "jwt-decode";
import { FormControlProps } from "react-bootstrap";

interface DecodedToken {
  id_usuario: number | string;
}

const CreatePost = () => {
  const userContext = useContext(UserContext);

  if (!userContext) {
    throw new Error("UserContext debe estar dentro del UserProvider");
  }

  const { fetchCreateProduct } = userContext;
  const token = localStorage.getItem("token");
  const decodedToken = token ? jwtDecode<DecodedToken>(token) : null;
  const id_usuario = decodedToken ? decodedToken.id_usuario : null;
  interface FormData {
    name: string;
    color: string;
    width: string;
    height: string;
    brand: string;
    type: string;
    body: string;
    description: string;
    price: string;
    stock: number;
    photo: string;
  }
  const [formData, setFormData] = useState<FormData>({
    name: "",
    color: "",
    width: "",
    height: "",
    brand: "",
    type: "",
    body: "",
    description: "",
    price: "",
    stock: 1,
    photo: "",
  });
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
      if (Object.values(formData).some((field) => field === "")) {
      setError("Todos los campos son obligatorios");
      return;
    }
    if (!id_usuario) {
      setError("Error: No se encontró el usuario autenticado");
      return;
    }
    const productData = {
      id_usuario,
      nombre: formData.name,
      marca: formData.brand,
      tipo: formData.type,
      cuerpo: parseInt(formData.body, 10),
      alto: parseFloat(formData.height),
      ancho: parseFloat(formData.width),
      precio: parseFloat(formData.price),
      foto: formData.photo,
      detalle: formData.description,
      stock: formData.stock,
      color: formData.color,
    };
    const response = await fetchCreateProduct(productData);
    if (response && response.msg) {
      alert("Producto agregado con éxito!");
      setFormData({
        name: "",
        color: "",
        width: "",
        height: "",
        brand: "",
        type: "",
        body: "",
        description: "",
        price: "",
        stock: 1,
        photo: "",
      });
      setError("");
    } else {
      setError("Hubo un error al agregar el producto");
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      color: "",
      width: "",
      height: "",
      brand: "",
      type: "",
      body: "",
      description: "",
      price: "",
      stock: 1,
      photo: "",
    });
    setError("");
  };

  return (
    <Container>
      <h1 className="text-center">Formulario de publicación</h1>
      <Form
        onSubmit={handleSubmit}
        className="col-10 col-md-6 mx-auto p-3 border border-dark rounded mt-3 mb-5"
      >
        {error && <p className="text-danger">{error}</p>}
        <Row>
          <Col xs={12} md={4}>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                maxLength={50}
              />
              {warning && <p style={{ color: "orange" }}>{warning}</p>}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formColor">
              <Form.Label>Selecciona un Color:</Form.Label>
              <Form.Control
                as="select"
                name="color"
                value={formData.color}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona</option>
                <option value="blanco">Blanco</option>
                <option value="negro">Negro</option>
                <option value="azul">Azul</option>
                <option value="cafe">Café</option>
                <option value="plomo">Plomo</option>
                <option value="rojo">Rojo</option>
                <option value="burdeo">Burdeo</option>
                <option value="verde">Verde</option>
                <option value="amarillo">Amarillo</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="formWidth">
              <Form.Label>Ancho (cm)</Form.Label>
              <Form.Control
                type="number"
                name="width"
                value={formData.width}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="formHeight">
              <Form.Label>Alto (cm)</Form.Label>
              <Form.Control
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="formBrand">
              <Form.Label>Selecciona una marca:</Form.Label>
              <Form.Control
                as="select"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona</option>
                <option value="Rosen">Rosen</option>
                <option value="Ikea">IKEA</option>
                <option value="Mueblez">Mueblez vintaje</option>
                <option value="Otra">Otra</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="formType">
              <Form.Label>Tipo</Form.Label>
              <Form.Control
                as="select"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona</option>
                <option value="sofa">Sofá</option>
                <option value="sillon">Sillón</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="mb-3" controlId="formBody">
              <Form.Label>Cuerpo</Form.Label>
              <Form.Control
                as="select"
                name="body"
                value={formData.body}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona</option>
                <option value="1">1 cuerpo</option>
                <option value="2">2 cuerpos</option>
                <option value="3">3 cuerpos</option>
                <option value="4">4 cuerpos</option>
                <option value="5">5 cuerpos</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="formDescription">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPrice">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formPhoto">
              <Form.Label>Foto (URL)</Form.Label>
 <Form.Control
                type="url"
                name="photo"
                value={formData.photo}
                onChange={handleChange}
                placeholder="https://example.com/imagen.jpg"
                required
              />
          <Form.Text className="text-muted">
                Ingresa una URL válida que apunte a una imagen.
              </Form.Text>

            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex align-items-end">
            <Button variant="secondary" onClick={handleCancel} className="me-2">
              Cancelar
            </Button>
          </Col>
          <Col className="d-flex align-items-end">
            <Button variant="success" type="submit">
              Publicar
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default CreatePost;
