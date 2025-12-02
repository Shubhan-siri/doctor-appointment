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
  let products = JSON.parse(localStorage.getItem("products")) || [];

  // Check if Machine Rice Flour exists
  const riceExists = products.some(p => p.name === "Machine Rice Flour");
  if (!riceExists) {
    products.push({
      name: "Machine Rice Flour",
      category: "Machinery",
      price: 200000,
      gate: 12,
      broker: "+91 9876543210"
    });
  }

  // Check if Wheet Floor Machine exists
  const wheetExists = products.some(p => p.name === "Wheet Floor Machine");
  if (!wheetExists) {
    products.push({
      name: "Wheet Floor Machine",
      category: "Machinery",
      price: 150000,
      gate: 15,
      broker: "+91 9876543211"
    });
  }

  // Save updated products back to localStorage
  localStorage.setItem("products", JSON.stringify(products));
};
