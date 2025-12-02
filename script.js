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
    window.location.href = "home.html";  // redirect works now
  } else {
    alert("Incorrect Email or Password");
  }
}
