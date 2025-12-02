// SIGN UP FUNCTION
function signup() {
  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const pass = document.getElementById("signupPassword").value.trim();

  if (!name || !email || !pass) {
    alert("Please fill all fields!");
    return;
  }

  localStorage.setItem("user", JSON.stringify({ name, email, pass }));
  alert("Signup successful! Now please Sign In.");
}


// LOGIN FUNCTION
function login() {
  const email = document.getElementById("loginEmail").value.trim();
  const pass = document.getElementById("loginPassword").value.trim();

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("No account found. Please Sign Up first!");
    return;
  }

  if (email === user.email && pass === user.pass) {
    alert("Login successful!");
    localStorage.setItem("loggedIn", "true");    // <-- Store login state
    window.location.href = "home.html";
  } else {
    alert("Incorrect Email or Password");
  }
}

// Add default product to localStorage if not exists
window.onload = function() {
  if (!localStorage.getItem("products")) {
    const defaultProduct = [
      {
        name: "Machine Rice Flour",
        category: "Machinery",
        price: 200000,
        gate: 12,
        broker: "+91 9876543210"
      }
    ];
    localStorage.setItem("products", JSON.stringify(defaultProduct));
  }
};
