const API_URL = 'https://backend4-2vye.onrender.com';

let usuario = null;

async function criarUsuario() {
  const res = await fetch(`${API_URL}/criar-usuario`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  usuario = await res.json();
  atualizarCortesRestantes();
}

function atualizarCortesRestantes() {
  document.getElementById('cortesRestantes').textContent = usuario.cortesRestantes;
}

async function enviarVideo() {
  const link = document.getElementById('inputLink').value.trim();
  if (!link) {
    alert('Por favor, cole um link de vídeo.');
    return;
  }

  if (usuario.cortesRestantes <= 0) {
    alert('Você não tem mais cortes disponíveis. Convide amigos para ganhar mais!');
    return;
  }

  const res = await fetch(`${API_URL}/enviar-video`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: usuario.id, link }),
  });
  const data = await res.json();

  if (data.error) {
    alert(data.error);
    return;
  }

  usuario.cortesRestantes--;
  atualizarCortesRestantes();

  const corte = data.corte;
  mostrarResultado(corte);
  document.getElementById('inputLink').value = '';
}

function mostrarResultado(corte) {
  const div = document.createElement('div');
  div.className = 'corte';
  div.innerHTML = `
    <p><strong>ID:</strong> ${corte.id}</p>
    <p><strong>Link:</strong> <a href="${corte.link}" target="_blank">${corte.link}</a></p>
    <p><strong>Data:</strong> ${new Date(corte.data).toLocaleString()}</p>
  `;
  document.getElementById('resultados').prepend(div);
}

function ganharMaisCortes() {
  usuario.cortesRestantes += 40;
  document.getElementById('mensagem').textContent = 'Você ganhou +40 cortes!';
  atualizarCortesRestantes();
}

document.getElementById('btnEnviar').addEventListener('click', enviarVideo);
document.getElementById('btnGanharMais').addEventListener('click', ganharMaisCortes);

window.onload = criarUsuario;
