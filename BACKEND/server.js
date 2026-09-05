const express = require("express");
const cors= require("cors");
const app = express();
const db = require("./db");

app.use(cors());
app.use(express.json());

const PORT = 5000;

let orders = [];

app.get("/", function(req, res) {
    res.send("ShopEase Backend is running!");
});

app.get("/api/products", function(req, res) {

    db.query("SELECT * FROM products", function(err, results) {

        if (err) {
            console.log("Error fetching products:", err);
            res.status(500).json({
                message: "Error fetching products"
            });
            return;
        }

        const products = results.map(function(product) {

            product.bestSeller = Boolean(product.bestSeller);

            product.features = product.features
                ? product.features.split(", ")
                : [];

            return product;

        });

        res.json(products);

    });

});
app.post("/api/orders", function(req, res) {

    const order = req.body;

    const sql = `
        INSERT INTO orders
        (order_id, customer_name, email, phone, address, payment_method, products, total)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        order.orderId,
        order.customerName,
        order.email,
        order.phone,
        order.address,
        order.paymentMethod,
        JSON.stringify(order.products),
        order.total
    ];

    db.query(sql, values, function(err, result) {

        if (err) {
            console.log("Error saving order:", err);

            res.status(500).json({
                message: "Error saving order"
            });

            return;
        }

        res.json({
            message: "Order placed successfully!",
            order: order
        });

    });

});

app.post("/api/register", function(req, res) {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400).json({
            message: "Please fill all fields."
        });
        return;
    }

    const sql = `
        INSERT INTO users (name, email, password)
        VALUES (?, ?, ?)
    `;

    const values = [name, email, password];

    db.query(sql, values, function(err, result) {

        if (err) {

            if (err.code === "ER_DUP_ENTRY") {
                res.status(400).json({
                    message: "Email is already registered."
                });
                return;
            }

            console.log("Error registering user:", err);

            res.status(500).json({
                message: "Error creating account."
            });

            return;
        }

        res.json({
            message: "Registration successful!"
        });

    });

});

app.get("/api/orders", function(req, res) {
    res.json(orders);
});

app.listen(PORT, function() {
    console.log(`Server running at http://localhost:${PORT}`);
});

app.post("/api/login", function(req, res) {

    const { email, password } = req.body;


    if (!email || !password) {

        res.status(400).json({
            message: "Please enter email and password."
        });

        return;
    }


    const sql = `
        SELECT * FROM users
        WHERE email = ? AND password = ?
    `;


    const values = [email, password];


    db.query(sql, values, function(err, results) {

        if (err) {

            console.log("Error logging in:", err);

            res.status(500).json({
                message: "Error logging in."
            });

            return;
        }


        if (results.length === 0) {

            res.status(401).json({
                message: "Invalid email or password."
            });

            return;
        }


        res.json({
            message: "Login successful!"
        });

    });

});
