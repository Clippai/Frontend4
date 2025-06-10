const API_URL = 'https://backend4-2vye.onrender.com/api';

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
    body: JSON.stringify({ usuarioId: usuario.id, link }),
  });

  const data = await res.json();

  if (data.erro) {
    alert(data.erro);
    return;
  }

  usuario = {
    ...usuario,
    cortesRestantes: usuario.cortesRestantes - 1,
    cortes: [...(usuario.cortes || []), data.corte],
  };
  atualizarCortesRestantes();
  mostrarResultado(data.corte);
  document.getElementById('inputLink').value = '';
}

function mostrarResultado(corte) {
  const container = document.getElementById('resultados');
  const div = document.createElement('div');
  div.className = 'corte';

  div.innerHTML = `
    <p><strong>Status:</strong> ${corte.status}</p>
    <p><strong>Link original:</strong>
      <a href="${corte.linkOriginal}" target="_blank">${corte.linkOriginal}</a>
    </p>
    <p><strong>Vídeo cortado:</strong>
      ${corte.videoCortadoUrl
        ? `<a href="${corte.videoCortadoUrl}" target="_blank">Assista aqui</a>`
        : 'Processando...'}
    </p>
  `;

  container.prepend(div);
}

async function ganharMaisCortes() {
  const res = await fetch(`${API_URL}/ganhar-cortes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuarioId: usuario.id }),
  });

  const data = await res.json();

  if (data.mensagem) {
    document.getElementById('mensagem').textContent = data.mensagem;
    usuario.cortesRestantes = data.cortesRestantes;
    atualizarCortesRestantes();
  }
}

document.getElementById('btnEnviar').addEventListener('click', enviarVideo);
document.getElementById('btnGanharMais').addEventListener('click', ganharMaisCortes);

window.onload = () => {
  criarUsuario();
};
