document.addEventListener('DOMContentLoaded', () => {
    const authSection = document.getElementById('auth-section');
    const profileSection = document.getElementById('profile-section');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const registerBtn = document.getElementById('register-btn');
    const errorMessage = document.getElementById('error-message');
    const dataContainer = document.getElementById('data-container');
    const usernameDisplay = document.getElementById('username-display');
    const themeToggleBtn = document.getElementById('toggle-theme');
    const refreshBtn = document.getElementById('refresh-data');
  
    // === Проверка авторизации ===
    checkAuth();
  
    loginBtn?.addEventListener('click', async () => {
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value.trim();
  
      try {
        const response = await fetch('/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
          credentials: 'include'
        });
  
        const data = await response.json();
        if (data.success) {
          checkAuth();
        } else {
          showError('Неверный логин или пароль');
        }
      } catch {
        showError('Ошибка соединения');
      }
    });
  
    logoutBtn?.addEventListener('click', async () => {
      await fetch('/logout', {
        method: 'POST',
        credentials: 'include'
      });
      authSection.classList.remove('hidden');
      profileSection.classList.add('hidden');
    });
  
    registerBtn?.addEventListener('click', async () => {
      const username = document.getElementById('reg-username').value.trim();
      const password = document.getElementById('reg-password').value.trim();
  
      try {
        const res = await fetch('/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
  
        const data = await res.json();
        if (data.success) {
          alert('Регистрация успешна. Теперь войдите.');
        } else {
          showError(data.message || 'Ошибка регистрации');
        }
      } catch {
        showError('Ошибка соединения');
      }
    });
  
    async function checkAuth() {
      try {
        const response = await fetch('/check-auth', {
          credentials: 'include'
        });
        const data = await response.json();
        if (data.authenticated) {
          usernameDisplay.textContent = data.user.username;
          authSection.classList.add('hidden');
          profileSection.classList.remove('hidden');
          updateData();
        } else {
          authSection.classList.remove('hidden');
          profileSection.classList.add('hidden');
        }
      } catch (err) {
        console.error('Ошибка проверки авторизации:', err);
      }
    }
  
    function showError(message) {
      errorMessage.textContent = message;
      errorMessage.classList.remove('hidden');
      setTimeout(() => {
        errorMessage.classList.add('hidden');
      }, 3000);
    }
  
    // === Тема ===
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  
    themeToggleBtn?.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const newTheme = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  
    // === Кэш и отображение времени жизни ===
    async function updateData() {
      const res = await fetch('/data');
      const data = await res.json();
  
      const now = Date.now();
      const timestamp = data.timestamp;
      const lifetime = Math.floor((now - timestamp) / 1000); // в секундах
  
      dataContainer.innerHTML = `
        <h3>Данные API</h3>
        <p><strong>Источник:</strong> ${data.source}</p>
        <p><strong>Серверное время:</strong> ${new Date(timestamp).toLocaleTimeString()}</p>
        <p><strong>Lifetime:</strong> ${lifetime} секунд</p>
        <pre>${JSON.stringify(data.items, null, 2)}</pre>
      `;
      console.log("Обновление данных, возраст:", lifetime, "сек");
    }
  
    refreshBtn?.addEventListener('click', updateData);
  
    // Автообновление раз в 5 сек (по желанию)
    setInterval(() => {
      if (!profileSection.classList.contains('hidden')) {
        updateData();
      }
    }, 5000);
  });
  