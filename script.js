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
  fetch(`${API_URL}/cortes-restantes/${usuario.id}`)
    .then(res => res.json())
    .then(data => {
      usuario.cortesRestantes = data.cortesRestantes;
      document.getElementById('cortesRestantes').textContent = data.cortesRestantes;
    });
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

  mostrarResultado(data.corte);
  document.getElementById('inputLink').value = '';
}

function mostrarResultado(corte) {
  const container = document.getElementById('resultados');
  const div = document.createElement('div');
  div.className = 'corte';

  div.innerHTML = `
    <p><strong>ID:</strong> ${corte.id}</p>
    <p><strong>Link original:</strong> <a href="${corte.link}" target="_blank">${corte.link}</a></p>
    <p><strong>Data:</strong> ${new Date(corte.data).toLocaleString()}</p>
  `;

  container.prepend(div);
}

function ganharMaisCortes() {
  alert("Convide amigos pelo seu link! (Funcionalidade futura)");
}

document.getElementById('btnEnviar').addEventListener('click', enviarVideo);
document.getElementById('btnGanharMais').addEventListener('click', ganharMaisCortes);

window.onload = () => {
  criarUsuario();
};
