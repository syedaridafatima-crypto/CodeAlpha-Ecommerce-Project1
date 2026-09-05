const loginForm = document.querySelector("#login-form");

const loginMessage = document.querySelector("#login-message");


loginForm.addEventListener("submit", async function(event) {

    event.preventDefault();


    const email = document.querySelector("#login-email").value;

    const password = document.querySelector("#login-password").value;


    const loginData = {

        email: email,

        password: password

    };


    try {

        const response = await fetch("http://localhost:5000/api/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(loginData)

        });


        const data = await response.json();


        if (!response.ok) {

            loginMessage.textContent = data.message;

            return;

        }


        loginMessage.textContent = data.message;


    } catch (error) {

        console.log("Error:", error);

        loginMessage.textContent =
            "Could not connect to the server.";

    }

});