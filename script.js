const API_URL = 'https://backend4-2vye.onrender.com/api';
let usuario = null;

async function criarOuCarregarUsuario() {
  const localUser = localStorage.getItem("usuario");
  if (localUser) {
    usuario = JSON.parse(localUser);
    atualizarCortesRestantes();
    return;
  }

  const res = await fetch(`${API_URL}/criar-usuario`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });

  usuario = await res.json();
  localStorage.setItem("usuario", JSON.stringify(usuario));
  atualizarCortesRestantes();
}

function atualizarCortesRestantes() {
  const limite = 20 + (usuario.indicacoes || 0) * 40;
  const usados = (usuario.cortes || []).filter(c => {
    const data = new Date(c.data);
    const agora = new Date();
    return data.getMonth() === agora.getMonth() && data.getFullYear() === agora.getFullYear();
  }).length;

  document.getElementById('cortesRestantes').textContent = `Cortes restantes: ${limite - usados}`;
}

async function enviarVideo() {
  const link = document.getElementById('inputLink').value.trim();
  if (!link) return alert('Cole um link de vídeo.');

  const res = await fetch(`${API_URL}/enviar-video`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuarioId: usuario.id, link })
  });

  const data = await res.json();
  if (data.erro) return alert(data.erro);

  usuario.cortes = usuario.cortes || [];
  usuario.cortes.push(data.corte);
  localStorage.setItem("usuario", JSON.stringify(usuario));
  atualizarCortesRestantes();
  mostrarResultado(data.corte);
}

function mostrarResultado(corte) {
  const container = document.getElementById("resultados");
  const div = document.createElement("div");
  div.className = "corte";
  div.innerHTML = `
    <p><strong>Link original:</strong> <a href="${corte.link}" target="_blank">${corte.link}</a></p>
    <p><strong>Status:</strong> Corte registrado! (simulado)</p>
  `;
  container.prepend(div);
}

async function ganharMaisCortes() {
  const codigo = prompt("Cole o código do seu amigo para ganhar mais cortes:");
  if (!codigo) return;

  const res = await fetch(`${API_URL}/ganhar-cortes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuarioId: usuario.id, codigoConvite: codigo })
  });

  const data = await res.json();
  if (data.erro) {
    alert(data.erro);
  } else {
    alert(data.mensagem);
    usuario.indicacoes = (usuario.indicacoes || 0) + 1;
    localStorage.setItem("usuario", JSON.stringify(usuario));
    atualizarCortesRestantes();
  }
}

document.getElementById("btnEnviar").addEventListener("click", enviarVideo);
document.getElementById("btnGanharMais").addEventListener("click", ganharMaisCortes);

window.onload = () => {
  criarOuCarregarUsuario();
};
