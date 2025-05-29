CREATE DATABASE qlqalexstore;

USE qlqalexstore;

CREATE TABLE productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  descripcion TEXT,
  imagen_url VARCHAR(255),
  stock INT DEFAULT 0,
  habilitado BOOLEAN DEFAULT 1,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  total DECIMAL(10,2) NOT NULL,
  estado ENUM('pendiente', 'completado', 'cancelado') DEFAULT 'pendiente',
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  id_pago VARCHAR(255) -- ID de pago de MercadoPago
);

CREATE TABLE detalles_pedido (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT,
  producto_id INT,
  cantidad INT,
  precio DECIMAL(10,2),
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
  FOREIGN KEY (producto_id) REFERENCES productos(id)
);

CREATE TABLE administradores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario VARCHAR(50) NOT NULL,
  contraseña VARCHAR(255) NOT NULL -- Usar password_hash() en PHP
);