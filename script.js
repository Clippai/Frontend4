const API_URL = https://backend4-2vye.onrender.com // Altere para seu backend online se necessário

function mostrarCadastro() {
  document.querySelector('.login-container').style.display = 'none';
  document.querySelector('.cadastro-container').style.display = 'block';
}

function mostrarLogin() {
  document.querySelector('.login-container').style.display = 'block';
  document.querySelector('.cadastro-container').style.display = 'none';
}

async function cadastrar() {
  const email = document.getElementById('emailCadastro').value;
  const senha = document.getElementById('senhaCadastro').value;

  const res = await fetch(API_URL + '/cadastrar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha })
  });
  const data = await res.json();
  if (data.error) alert(data.error);
  else {
    alert('Cadastro realizado com sucesso!');
    mostrarLogin();
  }
}

async function login() {
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  const res = await fetch(API_URL + '/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha })
  });
  const data = await res.json();
  if (data.error) alert(data.error);
  else {
    localStorage.setItem('userId', data.user.id);
    window.location.href = 'dashboard.html';
  }
}

if (window.location.pathname.includes('dashboard.html')) {
  const userId = localStorage.getItem('userId');
  if (!userId) window.location.href = 'index.html';

  fetch(`${API_URL}/usuario/${userId}`)
    .then(res => res.json())
    .then(data => {
      document.getElementById('cortesRestantes').textContent = data.cortesRestantes;
      if (data.cortes.length) {
        data.cortes.forEach(c => mostrarCorte(c));
      }
    });

  document.getElementById('btnEnviar').addEventListener('click', async () => {
    const link = document.getElementById('inputLink').value.trim();
    if (!link) return alert('Cole um link');

    const res = await fetch(`${API_URL}/enviar-video`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, link })
    });
    const data = await res.json();

    if (data.error) return alert(data.error);

    mostrarCorte(data.corte);
    document.getElementById('cortesRestantes').textContent =
      parseInt(document.getElementById('cortesRestantes').textContent) - 1;
  });

  document.getElementById('btnGanharMais').addEventListener('click', () => {
    const span = document.getElementById('cortesRestantes');
    span.textContent = parseInt(span.textContent) + 40;
    document.getElementById('mensagem').textContent = '🎉 Você ganhou +40 cortes!';
  });
}

function mostrarCorte(corte) {
  const div = document.createElement('div');
  div.className = 'corte';
  div.innerHTML = `
    <p><strong>ID:</strong> ${corte.id}</p>
    <p><strong>Link:</strong> <a href="${corte.link}" target="_blank">${corte.link}</a></p>
    ${corte.transcricao ? `<p><strong>Transcrição:</strong> ${corte.transcricao}</p>` : ''}
    ${corte.thumbnail ? `<p><strong>Thumbnail:</strong><br><img src="${corte.thumbnail}" width="100%"/></p>` : ''}
    ${corte.thumbnailUpscaled ? `<p><strong>Upscaled:</strong><br><img src="${corte.thumbnailUpscaled}" width="100%"/></p>` : ''}
  `;
  document.getElementById('resultados').prepend(div);
}
