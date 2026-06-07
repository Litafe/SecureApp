const express = require('express');
const bcrypt = require('bcrypt');
const fs = require('fs');
const bodyParser = require('body-parser');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

const app = express();
app.use(bodyParser.json());
const path = require('path');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/register.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'register.html'));
});

app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/reset.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'reset.html'));
});

app.get('/style.css', (req, res) => {
  res.sendFile(path.join(__dirname, 'style.css'));
});

app.get('/script.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'script.js'));
});
const USERS_FILE = path.join(__dirname, 'users.json');

function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(USERS_FILE));
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  let users = loadUsers();

  if (users.find(u => u.username === username)) {
    return res.json({ error: 'User already exists' });
  }

  const hash = await bcrypt.hash(password, 10);
  const secret = speakeasy.generateSecret({ name: `secure-app (${username})` });

  users.push({
    username,
    password: hash,
    twoFASecret: secret.base32
  });

  saveUsers(users);

  qrcode.toDataURL(secret.otpauth_url, (err, url) => {
    if (err) return res.json({ error: 'QR failed' });
    res.json({ qrCodeUrl: url });
  });
});

// LOGIN
app.post('/login', async (req, res) => {
  const { username, password, token } = req.body;

  let users = loadUsers();
  const user = users.find(u => u.username === username);

  if (!user) return res.json({ error: 'User not found' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.json({ error: 'Wrong password' });

  const verified = speakeasy.totp.verify({
    secret: user.twoFASecret,
    encoding: 'base32',
    token
  });

  if (!verified) return res.json({ error: 'Invalid 2FA code' });

  res.json({ success: true });
});

app.post('/reset', async (req, res) => {
  const { username, password } = req.body;

  let users = loadUsers();
  const user = users.find(u => u.username === username);

  if (!user) return res.json({ error: 'User not found' });

  user.password = await bcrypt.hash(password, 10);

  const secret = speakeasy.generateSecret({ name: `secure-app (${username})` });
  user.twoFASecret = secret.base32;

  saveUsers(users);

  qrcode.toDataURL(secret.otpauth_url, (err, url) => {
    if (err) return res.json({ error: 'QR failed' });
    res.json({ qrCodeUrl: url });
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("secure-app running on port " + PORT);
});
