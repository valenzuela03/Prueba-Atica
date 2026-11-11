DROP TABLE IF EXISTS products;

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    category VARCHAR(100) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_name ON products(name);

INSERT INTO products (name, price, stock, category, is_active) VALUES
('Laptop Pro 16" M3 Max',          2499.99, 15, 'Tecnología',  TRUE),
('Monitor Curvo UltraWide 34"',     649.50, 28, 'Tecnología',  TRUE),
('Teclado Mecánico Custom RGB',     129.99, 45, 'Accesorios',  TRUE),
('Mouse Ergonómico Inalámbrico',     89.00, 60, 'Accesorios',  TRUE),
('Audífonos Noise Cancelling Pro',  299.90, 22, 'Audio',       TRUE),
('Silla Ergonómica Mesh',           379.00, 10, 'Mobiliario',  TRUE),
('Escritorio Eléctrico Elevable',   499.00,  8, 'Mobiliario',  TRUE),
('Cámara Web 4K Ultra HD',          149.99, 35, 'Accesorios',  TRUE);
