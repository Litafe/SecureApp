function generatePassword() {
  const length = parseInt(document.getElementById("length").value);
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";

  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  document.getElementById("output").innerText = password;
}

function analyzePassword() {
  const pass = document.getElementById("analyzeInput").value;

  let score = 0;

  if (pass.length >= 8) score++;
  if (/[A-Z]/.test(pass)) score++;
  if (/[0-9]/.test(pass)) score++;
  if (/[!@#$%^&*]/.test(pass)) score++;

  let strength = "";

  if (score <= 1) {
    strength = "Weak";
  } else if (score === 2) {
    strength = "Medium";
  } else if (score === 3) {
    strength = "Strong";
  } else {
    strength = "Very Strong";
  }

  document.getElementById("strength").innerText = strength;
}
