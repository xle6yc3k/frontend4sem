let token = null;

document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('registerUsername').value;
  const password = document.getElementById('registerPassword').value;

  try {
    const response = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();
    document.getElementById('registerMessage').textContent = result.message || 'Registration failed';
  } catch (error) {
    document.getElementById('registerMessage').textContent = 'Request error';
  }
});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();

    if (response.ok) {
      token = result.token;
      document.getElementById('loginMessage').textContent = 'Login successful!';
      document.getElementById('jwtToken').textContent = token; // ← вывод токена
    } else {
      document.getElementById('loginMessage').textContent = result.message || 'Login failed';
    }
  } catch (error) {
    document.getElementById('loginMessage').textContent = 'Request error';
  }
});

document.getElementById('fetchProtectedData').addEventListener('click', async () => {
  if (!token) {
    document.getElementById('protectedData').textContent = 'Please login first';
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/profile', {
      headers: { 'Authorization': `Bearer ${token}` },
    });    

    const result = await response.json();

    if (response.ok) {
      document.getElementById('protectedData').textContent = JSON.stringify(result);
    } else {
      document.getElementById('protectedData').textContent = 'Access denied';
    }
  } catch (error) {
    document.getElementById('protectedData').textContent = 'Request error';
  }
});
