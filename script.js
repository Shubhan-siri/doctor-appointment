// SIGN UP
function signup() {
  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const pass = document.getElementById("signupPassword").value;

  if (!name || !email || !pass) {
    alert("Please fill all fields!");
    return;
  }

  // Save user data
  localStorage.setItem("user", JSON.stringify({ name, email, pass }));

  alert("Signup successful! Now please Sign In.");
}


// LOGIN
function login() {
  const email = document.getElementById("loginEmail").value;
  const pass = document.getElementById("loginPassword").value;

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("No account found. Please Sign Up first!");
    return;
  }

  if (email === user.email && pass === user.pass) {
    alert("Login successful!");
    window.location.href = "home.html";
  } else {
    alert("Incorrect Email or Password");
  }
}
