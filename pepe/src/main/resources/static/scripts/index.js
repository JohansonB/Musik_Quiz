const toggleButton = document.getElementById("toggleButton");
const loginForm = document.getElementById("loginForm");
const loginButton = document.getElementById("loginButton");
const errorMessage = document.getElementById("errorMessage");
var action = "/login";

toggleButton.addEventListener("click", function() {
    if (toggleButton.textContent === "Noch nicht registriert?") {
        action = "/signup";
        toggleButton.textContent = "Ich habe bereits ein Konto.";
        loginButton.textContent = "Registrieren"
         // Show the class dropdown box when switching to Sign Up
         document.getElementById("class-container").style.visibility = "visible";

    } else {
        action = "/login";
        toggleButton.textContent = "Noch nicht registriert?";
        loginButton.textContent = "Login"
        // Hide the class dropdown box when switching back to Login
        document.getElementById("class-container").style.visibility = "hidden";

    }
    errorMessage.textContent = '';
});

loginButton.addEventListener("click", async function() {
    let formData;
    if(action == "/login"){
        formData = {
            username: document.getElementById("username").value,
            password: document.getElementById("password").value
        };
    }
    if(action == "/signup"){
        formData = {
            username: document.getElementById("username").value,
            password: document.getElementById("password").value,
            klasse: document.getElementById("class").value
        };
    }

    try {
        const response = await fetch(action, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            //load the pofile information into the sessionStorage
            const responseData = await response.json();
            sessionStorage.clear();
            for (const key in responseData) {
                if (responseData.hasOwnProperty(key)) {
                    const value = responseData[key];
                    sessionStorage.setItem(key, value);
                }
            }
            // Navigate to the /main page
            window.location.href = "/main";

        } else {
            const errorData = await response.json();
            errorMessage.textContent = errorData["error"];

        }
    } catch (error) {
        console.error("Error:", error);
    }
});