-- Enums
CREATE TYPE user_role AS ENUM ('OWNER', 'MANAGER', 'EMPLOYEE');

-- Tables

CREATE TABLE company (
    company_id VARCHAR PRIMARY KEY,
    company_name VARCHAR NOT NULL,
    business_type VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    phone_number NUMERIC NOT NULL,
    address VARCHAR NOT NULL,
    city VARCHAR NOT NULL,
    country VARCHAR NOT NULL,
    created_at VARCHAR,
    updated_at VARCHAR
);

CREATE TABLE users (
    user_id VARCHAR PRIMARY KEY,
    company_id VARCHAR NOT NULL REFERENCES company(company_id),
    email VARCHAR NOT NULL UNIQUE,
    password VARCHAR NOT NULL,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    phone_number NUMERIC NOT NULL,
    role user_role DEFAULT 'EMPLOYEE',
    is_active BOOLEAN DEFAULT true,
    created_at VARCHAR,
    updated_at VARCHAR,
    refresh_token VARCHAR,
    refresh_token_expires TIMESTAMP
);

CREATE TABLE point_sale (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    address VARCHAR NOT NULL,
    company_id VARCHAR REFERENCES company(company_id)
);

CREATE TABLE category (
    id SERIAL PRIMARY KEY,
    category_name VARCHAR NOT NULL UNIQUE
);

CREATE TABLE product (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    code INT NOT NULL UNIQUE,
    purchase_price NUMERIC(10, 2) NOT NULL,
    selling_price NUMERIC(10, 2) NOT NULL,
    category_id INT REFERENCES category(id),
    stock INT NOT NULL
);

CREATE TABLE sale (
    sale_id SERIAL PRIMARY KEY,
    discount NUMERIC(10, 2) NOT NULL,
    point_sale_id INT REFERENCES point_sale(id),
    total_amount NUMERIC NOT NULL,
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    product JSONB DEFAULT '[]'
);

CREATE TABLE sales_detail (
    id SERIAL PRIMARY KEY,
    code INT NOT NULL,
    quantity INT NOT NULL,
    selling_price NUMERIC NOT NULL,
    sale_id INT REFERENCES sale(sale_id),
    product JSONB
);

CREATE TABLE payment (
    payment_id SERIAL PRIMARY KEY,
    total_amount NUMERIC(10, 2),
    point_sale INT REFERENCES point_sale(id),
    "paymentDetail" JSONB DEFAULT '[]',
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sale_id INT REFERENCES sale(sale_id)
);

CREATE TABLE payments_method (
    id SERIAL PRIMARY KEY,
    method_name VARCHAR NOT NULL
);

CREATE TABLE payments_detail (
    id SERIAL PRIMARY KEY,
    payment_method VARCHAR NOT NULL,
    total_amount NUMERIC NOT NULL,
    payment_id INT REFERENCES payment(payment_id)
);

CREATE TABLE work_session (
    id SERIAL PRIMARY KEY,
    company_id VARCHAR REFERENCES company(company_id),
    point_sale_id INT REFERENCES point_sale(id),
    user_id VARCHAR REFERENCES users(user_id),
    check_in VARCHAR,
    check_out VARCHAR,
    total_time NUMERIC
);