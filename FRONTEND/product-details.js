const productDetailsContainer = document.querySelector("#product-details-container");

const urlParams = new URLSearchParams(window.location.search);

const productName = urlParams.get("name");

fetch("http://localhost:5000/api/products")
    .then(function(response) {
        return response.json();
    })
    .then(function(products) {

        const product = products.find(function(product) {
            return product.name === productName;
        });

        if (!product) {

            productDetailsContainer.innerHTML = `
                <h2>Product not found</h2>
                <a href="index.html">Back to Products</a>
            `;

            return;
        }

        productDetailsContainer.innerHTML = `

            <img src="${product.image}" alt="${product.name}">

            <div>

                <h2>${product.name}</h2>

                <p>
                    <strong>Category:</strong>
                    ${product.category}
                </p>

                <h3>Description</h3>

                <p>
                    ${product.description}
                </p>

                <h3>Key Features</h3>

                <ul>
                    ${product.features.map(function(feature) {
                        return `<li>${feature}</li>`;
                    }).join("")}
                </ul>

                <p>
                    <strong>Finish:</strong>
                    ${product.finish}
                </p>

                <p>
                    <strong>Suitable For:</strong>
                    ${product.suitableFor}
                </p>

                <h3>How to Use</h3>

                <p>
                    ${product.howToUse}
                </p>

                <p>
                    <strong>Price:</strong>
                    Rs. ${product.price}
                </p>

                <p>
                    ⭐ ${product.rating}
                </p>

                ${
                    product.bestSeller
                    ? "<p>🏆 Best Seller</p>"
                    : ""
                }

                <button>
                    Add to Cart
                </button>

                <br><br>

                <a href="index.html">
                    ← Back to Products
                </a>

            </div>
        `;
    })
    .catch(function(error) {

        console.log("Error:", error);

        productDetailsContainer.innerHTML = `
            <h2>Could not load product</h2>
        `;
    });