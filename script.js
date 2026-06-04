function generatePassword() {
  let length = document.getElementById("length").value;
  let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";

  for (let i = 0; i < length; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }

  document.getElementById("output").innerText = password;
}

function analyzePassword() {
  let pass = document.getElementById("analyzeInput").value;

  let score = 0;
  if (pass.length >= 8) score++;
  if (/[A-Z]/.test(pass)) score++;
  if (/[0-9]/.test(pass)) score++;
  if (/[\!\@\#\$\%\^\&\*]/.test(pass)) score++;

  let strength = ["Weak","Medium","Strong","Very Strong"][score];
  document.getElementById("strength").innerText = strength;
}
