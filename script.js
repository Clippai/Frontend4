const API_URL = 'https://backend4-2vye.onrender.com';
let usuario = null;

async function criarUsuario() {
  const res = await fetch(`${API_URL}/criar-usuario`, { method: 'POST' });
  usuario = await res.json();
  atualizarCortesRestantes();
}

function atualizarCortesRestantes() {
  document.getElementById('cortesRestantes').textContent = usuario.cortesRestantes;
}

async function enviarVideo() {
  const link = document.getElementById('inputLink').value.trim();
  const gerarThumbnail = document.getElementById('thumbnail').checked;
  const gerarHeadline = document.getElementById('headline').checked;
  const formato = document.getElementById('formato').value;

  if (!link) return alert('Cole o link do vídeo.');
  if (usuario.cortesRestantes <= 0) {
    return alert('Sem cortes disponíveis. Convide amigos!');
  }

  const res = await fetch(`${API_URL}/enviar-video`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: usuario.id,
      link,
      gerarThumbnail,
      gerarHeadline,
      formato
    }),
  });

  const data = await res.json();

  if (data.error) {
    return alert(data.error);
  }

  usuario.cortesRestantes--;
  atualizarCortesRestantes();

  const corte = data.corte;
  mostrarResultado(corte);
  document.getElementById('inputLink').value = '';
}

function mostrarResultado(corte) {
  const c = corte;
  const div = document.createElement('div');
  div.className = 'corte';

  div.innerHTML = `
    <p><strong>ID:</strong> ${c.id}</p>
    <p><strong>Link:</strong> <a href="${c.link}" target="_blank">${c.link}</a></p>
    <p><strong>Data:</strong> ${new Date(c.data).toLocaleString()}</p>
    <p><strong>Formato:</strong> ${c.formato}</p>
    ${c.headline ? `<p><strong>Headline:</strong> ${c.headline}</p>` : ""}
    ${c.thumbnailUrl ? `<img src="${c.thumbnailUrl}" alt="Thumbnail" style="width:100%;max-width:320px;margin-top:10px;border-radius:8px;" />` : ""}
  `;

  document.getElementById('resultados').prepend(div);
}

async function ganharMaisCortes() {
  usuario.cortesRestantes += 50;
  document.getElementById('mensagem').textContent = 'Você ganhou +50 cortes!';
  atualizarCortesRestantes();
}

document.getElementById('btnEnviar').onclick = enviarVideo;
document.getElementById('btnGanharMais').onclick = ganharMaisCortes;

window.onload = criarUsuario;
