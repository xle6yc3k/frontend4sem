const express = require('express');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt');

const app = express();
const cacheDir = path.join(__dirname, 'cache');
const usersFile = path.join(__dirname, 'users.json');

if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: 'super_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 1 день
  }
}));

// КЭШ
function getCachedData(key, ttl = 60) {
  const file = path.join(cacheDir, `${key}.json`);
  if (fs.existsSync(file)) {
    const age = (Date.now() - fs.statSync(file).mtimeMs) / 1000;
    if (age < ttl) return JSON.parse(fs.readFileSync(file, 'utf8'));
  }

  const data = {
    items: [1, 2, 3],
    timestamp: Date.now(),
    source: 'Файловый кэш'
  };

  fs.writeFileSync(file, JSON.stringify(data));
  setTimeout(() => fs.existsSync(file) && fs.unlinkSync(file), ttl * 1000);
  return data;
}

// === РОУТЫ ===

// Получить кэшированные данные
app.get('/data', (req, res) => {
  res.json(getCachedData('api_data', 60));
});

// Получить профиль авторизованного пользователя
app.get('/profile', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  res.json({ user: req.session.user });
});

// Проверка авторизации
app.get('/check-auth', (req, res) => {
  if (req.session.user) {
    return res.json({ authenticated: true, user: req.session.user });
  }
  res.json({ authenticated: false });
});

// Регистрация
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Заполните все поля' });
  }

  let users = [];
  if (fs.existsSync(usersFile)) {
    users = JSON.parse(fs.readFileSync(usersFile));
  }

  const userExists = users.find(u => u.username === username);
  if (userExists) {
    return res.status(409).json({ success: false, message: 'Пользователь уже существует' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  res.json({ success: true });
});

// Вход
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  let users = [];
  if (fs.existsSync(usersFile)) {
    users = JSON.parse(fs.readFileSync(usersFile));
  }

  const user = users.find(u => u.username === username);
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.user = { username };
    return res.json({ success: true });
  }

  res.status(401).json({ success: false, message: 'Неверные данные' });
});

// Выход
app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).send('Ошибка выхода');
    res.clearCookie('connect.sid');
    res.json({ success: true });
  });
});

// СТАРТ СЕРВЕРА
app.listen(3000, () => {
  console.log('Сервер запущен: http://localhost:3000');
});
