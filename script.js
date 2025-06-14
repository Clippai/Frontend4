const API_URL = 'https://backend4-2vye.onrender.com';

document.getElementById('btnEnviar').addEventListener('click', async () => {
  const link = document.getElementById('inputLink').value.trim();
  const format = document.querySelector('input[name="format"]:checked').value;
  const gerarLegenda = document.getElementById('chkLegenda').checked;
  const gerarThumb = document.getElementById('chkThumbnail').checked;
  const edicaoMagica = document.getElementById('chkEdicao').checked;

  if (!link) {
    alert('Por favor, cole um link de vídeo.');
    return;
  }

  document.getElementById('mensagem').textContent = '⏳ Processando...';

  try {
    const res = await fetch(`${API_URL}/api/processar-video`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        link,
        formato: format,
        legenda: gerarLegenda,
        thumbnail: gerarThumb,
        edicao: edicaoMagica
      })
    });

    const data = await res.json();

    if (data.erro) {
      document.getElementById('mensagem').textContent = '❌ ' + data.erro;
    } else {
      document.getElementById('mensagem').textContent = '✅ Processado com sucesso!';
      mostrarResultado(data);
    }
  } catch (e) {
    document.getElementById('mensagem').textContent = '❌ Erro ao processar.';
  }
});

function mostrarResultado(data) {
  const container = document.getElementById('resultados');
  const div = document.createElement('div');
  div.className = 'corte';

  div.innerHTML = `
    <p><strong>Transcrição:</strong> ${data.transcricao || '---'}</p>
    <p><strong>Corte Sugerido:</strong> ${data.corteSugerido || '---'}</p>
    <p><strong>Arquivo:</strong> ${data.caminhoVideo || '---'}</p>
  `;

  container.prepend(div);
}