const loginForm = document.querySelector("#login-form");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const emailError = document.querySelector("#email-error");
const passwordError = document.querySelector("#password-error");
const formStatus = document.querySelector("#form-status");
const showPasswordButton = document.querySelector(".show-password");
const demoCredentials = [
  { email: "demo@hackwithindia.com", password: "welcome123" }
];

showPasswordButton.addEventListener("click", () => {
  const isPasswordVisible = passwordInput.type === "text";
  passwordInput.type = isPasswordVisible ? "password" : "text";
  showPasswordButton.textContent = isPasswordVisible ? "Show" : "Hide";
  showPasswordButton.setAttribute(
    "aria-label",
    isPasswordVisible ? "Show password" : "Hide password"
  );
});

function clearErrors() {
  emailError.textContent = "";
  passwordError.textContent = "";
  emailInput.classList.remove("input-error");
  passwordInput.classList.remove("input-error");
  formStatus.textContent = "";
  formStatus.className = "form-status";
}

function showError(input, errorElement, message) {
  input.classList.add("input-error");
  errorElement.textContent = message;
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearErrors();

  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;
  let isValid = true;

  if (!email) {
    showError(emailInput, emailError, "Enter your email address.");
    isValid = false;
  } else if (!emailInput.validity.valid) {
    showError(emailInput, emailError, "Use a valid email address.");
    isValid = false;
  }

  if (!password) {
    showError(passwordInput, passwordError, "Enter your password.");
    isValid = false;
  }

  if (!isValid) {
    return;
  }

  try {
    let credentials = demoCredentials;
    try {
      const response = await fetch("credentials.json");
      if (response.ok) {
        credentials = await response.json();
      }
    } catch (error) {
      console.info("Using the local demo credentials fallback.", error);
    }

    const isMatch = credentials.some(
      (account) => account.email.toLowerCase() === email && account.password === password
    );

    if (isMatch) {
      formStatus.textContent = "Signed in successfully. Welcome back.";
      formStatus.className = "form-status success";
      loginForm.reset();
    } else {
      formStatus.textContent = "That email and password do not match.";
      formStatus.className = "form-status error";
    }
  } catch (error) {
    formStatus.textContent = "Unable to sign in right now. Try again shortly.";
    formStatus.className = "form-status error";
    console.error(error);
  }
});
