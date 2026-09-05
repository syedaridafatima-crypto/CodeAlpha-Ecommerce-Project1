 let products = [];

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let orderNumber = Number(localStorage.getItem("orderNumber")) || 1001;
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}
const searchproduct = document.querySelector("#searchproduct");
const searchbutton = document.querySelector("#searchbutton");
const clearsearch = document.querySelector("#clearsearch");
const sortProducts = document.querySelector("#sort-products");
let currentCategory = "All";
let currentSearch = "";
const categoryButtons = document.querySelectorAll(".category-btn");
const productcontainer = document.querySelector("#productcontainer");
const cartCount = document.querySelector("#cart-count");
const cartcontainer = document.querySelector("#cartcontainer");
const carttotal = document.querySelector("#cart-total");
const clearCartButton = document.querySelector("#clear-cart");
const checkoutForm = document.querySelector("#checkout-form");
const customerName = document.querySelector("#customer-name");
const customerEmail = document.querySelector("#customer-email");
const customerPhone = document.querySelector("#customer-phone");
const customerAddress = document.querySelector("#customer-address");
const paymentMethod = document.querySelector("#payment-method");
const summaryItems = document.querySelector("#summary-items");
const summaryTotal = document.querySelector("#summary-total");
const orderConfirmation = document.querySelector("#order-confirmation");
const orderId = document.querySelector("#order-id");
const confirmedTotal = document.querySelector("#confirmed-total");
const continueShopping = document.querySelector("#continue-shopping");
const shopNow = document.querySelector("#shop-now");
function displayProducts(productList = products) {

    productcontainer.innerHTML = "";

    productList.forEach(function(product) {

        productcontainer.innerHTML += `
            <div class="product-card">
             ${product.bestSeller ? '<span class="best-seller">Best Seller</span>' : ''}
             <img src="${product.image}" alt="${product.name}">

                <h3>${product.name}</h3>

                <p>Category: ${product.category}</p>
                <p class="description">${product.description}</p>
                <p>Price: Rs. ${product.price}</p>
                <p class="rating">⭐ ${product.rating}</p>
                <a href="product-details.html?name=${encodeURIComponent(product.name)}">
                    View Details
                </a>
                <button onclick="addToCart('${product.name}')">Add to Cart</button>
            </div>
        `;
    });
}
displayProducts();

function addToCart(productName) {

    const existingProduct = cart.find(function(product) {

        return product.name === productName;

    });

    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        const product = products.find(function(product) {

            return product.name === productName;

        });

        cart.push({
            ...product,
            quantity: 1
        });
    }

    cartCount.textContent = cart.reduce(function(sum, product) {

        return sum + product.quantity;

    }, 0);

    displayCart();
    displayOrderSummary();
    saveCart();

    console.log(cart);
}

function displayCart() {

    cartcontainer.innerHTML = "";

    if (cart.length === 0) {

        cartcontainer.innerHTML = "<p>Your cart is empty.</p>";

        carttotal.textContent = "Total: Rs. 0";

        return;
    }

    cart.forEach(function(product) {

        cartcontainer.innerHTML += `
            <div class="cart-item">

                <img src="${product.image}" alt="${product.name}">

                <div>
                    <h3>${product.name}</h3>

                    <p>Price: Rs. ${product.price}</p>

                        <div class="quantity-controls">

                          <button onclick="decreaseQuantity('${product.name}')">−</button>

                          <span>${product.quantity}</span>

                          <button onclick="increaseQuantity('${product.name}')">+</button>

                        </div>

                        <p>Subtotal: Rs. ${product.price * product.quantity}</p>

                        <button class="remove-button" onclick="removeFromCart('${product.name}')">
                            Remove
                        </button>
                </div>

            </div>
        `;

    });

    const total = cart.reduce(function(sum, product) {

        return sum + (product.price * product.quantity);

    }, 0);

    carttotal.textContent = `Total: Rs. ${total}`;
}

checkoutForm.addEventListener("submit", async function(event) {

    if (cart.length === 0) {
        event.preventDefault();
        alert("Your cart is empty. Please add products before placing an order.");
        return;
    }

    event.preventDefault();

    const name = customerName.value;
    const email = customerEmail.value;
    const phone = customerPhone.value;
    const address = customerAddress.value;
    const payment = paymentMethod.value;

    const total = cart.reduce(function(sum, product) {
        return sum + (product.price * product.quantity);
    }, 0);

    const newOrderId = "GG-" + orderNumber;

    const orderData = {
        orderId: newOrderId,
        customerName: name,
        email: email,
        phone: phone,
        address: address,
        paymentMethod: payment,
        products: cart,
        total: total
    };

    console.log("Order Data:", orderData);

    try {

        const response = await fetch("http://localhost:5000/api/orders", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(orderData)

        });

        const data = await response.json();

        console.log("Backend Response:", data);

        if (!response.ok) {
            alert("There was an error placing your order.");
            return;
        }

        orderId.textContent = newOrderId;
        confirmedTotal.textContent = `Total: Rs. ${total}`;

        orderConfirmation.style.display = "block";

        orderNumber++;

        localStorage.setItem("orderNumber", orderNumber);

        cart = [];

        localStorage.removeItem("cart");

        cartCount.textContent = 0;

        displayCart();

        displayOrderSummary();

        checkoutForm.reset();

    } catch (error) {

        console.log("Error placing order:", error);

        alert("Could not place the order. Please try again.");

    }

});

function displayOrderSummary() {

    summaryItems.innerHTML = "";

    if (cart.length === 0) {

        summaryItems.innerHTML = "<p>No items in your order.</p>";

        summaryTotal.textContent = "Total: Rs. 0";

        return;
    }

    cart.forEach(function(product) {

        const subtotal = product.price * product.quantity;

        summaryItems.innerHTML += `
            <div class="summary-item">

                <span>
                    ${product.name} × ${product.quantity}
                </span>

                <span>
                    Rs. ${subtotal}
                </span>

            </div>
        `;

    });

    const total = cart.reduce(function(sum, product) {

        return sum + (product.price * product.quantity);

    }, 0);

    summaryTotal.textContent = `Total: Rs. ${total}`;
}

function increaseQuantity(productName) {

    const product = cart.find(function(product) {

        return product.name === productName;

    });

    product.quantity++;

    cartCount.textContent = cart.reduce(function(sum, product) {

        return sum + product.quantity;

    }, 0);

    displayCart();
    displayOrderSummary();
    saveCart();
}

function decreaseQuantity(productName) {

    const product = cart.find(function(product) {

        return product.name === productName;

    });

    if (product.quantity > 1) {

        product.quantity--;

    }

    cartCount.textContent = cart.reduce(function(sum, product) {

        return sum + product.quantity;

    }, 0);

    displayCart();
    displayOrderSummary();
    saveCart();
}

function removeFromCart(productName) {

    cart = cart.filter(function(product) {

        return product.name !== productName;

    });

    cartCount.textContent = cart.reduce(function(sum, product) {

        return sum + product.quantity;

    }, 0);

    displayCart();
    displayOrderSummary();
    saveCart();
}
    
function updateProducts() {

    currentSearch = searchproduct.value.toLowerCase();

    let filteredProducts = products.filter(function(product) {

        const matchesSearch = product.name
            .toLowerCase()
            .includes(currentSearch);

        const matchesCategory =
            currentCategory === "All" ||
            product.category === currentCategory;

        return matchesSearch && matchesCategory;
    });

    const selectedSort = sortProducts.value;

    if (selectedSort === "price-low") {

        filteredProducts.sort(function(a, b) {
            return a.price - b.price;
        });

    } else if (selectedSort === "price-high") {

        filteredProducts.sort(function(a, b) {
            return b.price - a.price;
        });

    } else if (selectedSort === "rating") {

        filteredProducts.sort(function(a, b) {
            return b.rating - a.rating;
        });
    }

    displayProducts(filteredProducts);
}
 searchbutton.addEventListener("click", updateProducts);


 clearsearch.addEventListener("click", function() {

    searchproduct.value = "";

    updateProducts();

});

categoryButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        currentCategory = button.dataset.category;

        updateProducts();
    });

});

displayCart();
displayOrderSummary();

continueShopping.addEventListener("click", function() {

    orderConfirmation.style.display = "none";

    document.querySelector("#products").scrollIntoView({
        behavior: "smooth"
    });

});

shopNow.addEventListener("click", function() {
    document.querySelector("#products").scrollIntoView({
        behavior: "smooth"
    });
});

clearCartButton.addEventListener("click", function() {

    if (cart.length === 0) {
        return;
    }

    cart = [];

    localStorage.removeItem("cart");

    cartCount.textContent = 0;

    displayCart();
    displayOrderSummary();
});

sortProducts.addEventListener("change", updateProducts);

fetch("http://localhost:5000/api/products")
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        products = data;
        displayProducts();
    })
    .catch(function(error) {
        console.log("Error:", error);
    });