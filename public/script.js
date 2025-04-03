document.addEventListener('DOMContentLoaded', () => {
    // --- Авторизация ---
    const authSection = document.getElementById('auth-section');
    const profileSection = document.getElementById('profile-section');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const errorMessage = document.getElementById('error-message');
  
    checkAuth();
  
    loginBtn?.addEventListener('click', async () => {
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
  
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
      } catch (err) {
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

    const registerBtn = document.getElementById('register-btn');
    registerBtn?.addEventListener('click', async () => {
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;

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
          document.getElementById('username-display').textContent = data.user.username;
          authSection.classList.add('hidden');
          profileSection.classList.remove('hidden');
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
  
    // --- Тема ---
    function loadTheme() {
      const theme = document.cookie.split('; ').find(c => c.startsWith('theme='))?.split('=')[1];
      if (theme) document.documentElement.setAttribute('data-theme', theme);
    }
  
    document.getElementById('toggle-theme').addEventListener('click', () => {
      const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      fetch('/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: newTheme })
      });
    });
  
    // --- Кэш API ---
    async function updateData() {
      const res = await fetch('/api/data');
      const data = await res.json();
      document.getElementById('data-container').innerHTML = `
        <h3>Данные API</h3>
        <p><strong>Источник:</strong> ${data.source}</p>
        <p><strong>Время:</strong> ${new Date(data.timestamp).toLocaleTimeString()}</p>
        <pre>${JSON.stringify(data.items, null, 2)}</pre>
      `;
      console.log("Обновление данных", data.timestamp);
    }
  
    document.getElementById('refresh-data').addEventListener('click', updateData);
  
    // Инициализация
    loadTheme();
    updateData();
    setInterval(updateData, 5000);
  });
  