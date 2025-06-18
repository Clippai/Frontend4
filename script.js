const API_URL = 'https://backend4-2vye.onrender.com';

// Mostrar login e cadastro
function mostrarCadastro() {
  document.querySelector('.login-container').style.display = 'none';
  document.querySelector('.cadastro-container').style.display = 'block';
}
function mostrarLogin() {
  document.querySelector('.login-container').style.display = 'block';
  document.querySelector('.cadastro-container').style.display = 'none';
}

// Cadastro
async function cadastrar() {
  const email = document.getElementById('emailCadastro').value;
  const senha = document.getElementById('senhaCadastro').value;

  const res = await fetch(`${API_URL}/cadastrar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha })
  });
  const data = await res.json();

  if (data.error) {
    alert(data.error);
  } else {
    alert('Cadastro realizado com sucesso!');
    mostrarLogin();
  }
}

// Login
async function login() {
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha })
  });
  const data = await res.json();

  if (data.error) {
    alert(data.error);
  } else {
    localStorage.setItem('userId', data.user.id);
    window.location.href = 'dashboard.html';
  }
}

// Dashboard
if (window.location.pathname.includes('dashboard.html')) {
  const userId = localStorage.getItem('userId');
  if (!userId) window.location.href = 'index.html';

  fetch(`${API_URL}/usuario/${userId}`)
    .then(res => res.json())
    .then(data => {
      document.getElementById('cortesRestantes').textContent = data.cortesRestantes;
    });

  document.getElementById('btnEnviar').addEventListener('click', async () => {
    const link = document.getElementById('inputLink').value.trim();
    if (!link) return alert('Cole um link de vídeo.');

    const res = await fetch(`${API_URL}/enviar-video`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, link })
    });
    const data = await res.json();

    if (data.error) {
      alert(data.error);
    } else {
      const div = document.createElement('div');
      div.className = 'corte';
      div.innerHTML = `
        <p><strong>ID:</strong> ${data.corte.id}</p>
        <p><strong>Link:</strong> <a href="${data.corte.link}" target="_blank">${data.corte.link}</a></p>
        <p><strong>Data:</strong> ${new Date(data.corte.data).toLocaleString()}</p>
      `;
      document.getElementById('resultados').prepend(div);

      const span = document.getElementById('cortesRestantes');
      span.textContent = parseInt(span.textContent) - 1;
    }
  });

  document.getElementById('btnGanharMais').addEventListener('click', () => {
    const span = document.getElementById('cortesRestantes');
    span.textContent = parseInt(span.textContent) + 40;
    document.getElementById('mensagem').textContent = '🎉 Você ganhou +40 cortes!';
  });
}
