const API_URL = 'https://backend4-2vye.onrender.com/api';

let usuario = null;

async function criarUsuario() {
  try {
    const res = await fetch(`${API_URL}/criar-usuario`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    usuario = await res.json();
    atualizarCortesRestantes();
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    alert("Erro ao conectar com o servidor.");
  }
}

function atualizarCortesRestantes() {
  document.getElementById('cortesRestantes').textContent = usuario?.cortesRestantes ?? 0;
}

async function enviarVideo() {
  const link = document.getElementById('inputLink').value.trim();
  if (!link) {
    alert('Por favor, cole um link de vídeo.');
    return;
  }
  if (!usuario || usuario.cortesRestantes <= 0) {
    alert('Você não tem mais cortes disponíveis. Convide amigos para ganhar mais!');
    return;
  }

  try {
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

    usuario.cortesRestantes--;
    atualizarCortesRestantes();
    mostrarResultado(data.corte);
    document.getElementById('inputLink').value = '';
  } catch (error) {
    console.error("Erro ao enviar vídeo:", error);
    alert("Erro ao processar o corte.");
  }
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
  try {
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
  } catch (error) {
    console.error("Erro ao ganhar mais cortes:", error);
  }
}

document.getElementById('btnEnviar').addEventListener('click', enviarVideo);
document.getElementById('btnGanharMais').addEventListener('click', ganharMaisCortes);

window.onload = criarUsuario;
