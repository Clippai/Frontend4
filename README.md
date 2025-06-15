# 🎨 ClippAI - Frontend

Frontend simples do ClippAI, que se conecta com o backend para processar vídeos com IA.

---

## 🚀 Funcionalidades:
- Inserir link de vídeo (YouTube, Kwai, Twitch, etc.).
- Gerar cortes automáticos com IA.
- Mostrar status dos cortes restantes.
- Ganhar mais cortes convidando amigos.

---

## 📦 Estrutura de Arquivos:
- `index.html` → Estrutura da página.
- `style.css` → Estilo (visual) do site.
- `script.js` → Funcionalidades e integração com o backend.

---

## 💻 Como rodar localmente:

1. Crie uma pasta chamada `frontend`.
2. Coloque os arquivos `index.html`, `style.css` e `script.js` dentro dessa pasta.
3. Clique no arquivo `index.html` e abra com seu navegador.

---

## 🌐 Deploy no Render:

1. Acesse https://render.com.
2. Clique em **“New Static Site”**.
3. Conecte ao seu repositório do GitHub (onde está seu frontend).
4. Configure:
   - **Build Command:** (deixa vazio)
   - **Publish Directory:** (deixa vazio ou `/`)
5. Clique em **“Create Static Site”**.

---

## 🔗 Integração com Backend:

- No arquivo `script.js`, altere a variável:
```javascript
const API_URL = 'https://SEU-BACKEND.onrender.com';
