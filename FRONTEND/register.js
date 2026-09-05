const registerForm = document.querySelector("#register-form");

const registerMessage = document.querySelector("#register-message");

registerForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const name = document.querySelector("#register-name").value;
    const email = document.querySelector("#register-email").value;
    const password = document.querySelector("#register-password").value;

    const userData = {
        name: name,
        email: email,
        password: password
    };

    try {

        const response = await fetch("http://localhost:5000/api/register", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(userData)

        });

        const data = await response.json();

        if (!response.ok) {

            registerMessage.textContent = data.message;

            return;

        }

        registerMessage.textContent = data.message;

        registerForm.reset();

    } catch (error) {

        console.log("Error:", error);

        registerMessage.textContent =
            "Could not connect to the server.";

    }

});