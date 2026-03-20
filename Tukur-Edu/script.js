// CONFIGURACIÓN (Reemplaza con tus datos reales)
const SUPABASE_URL = 'https://echyplrboxmckxljtkgg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjaHlwbHJib3htY2t4bGp0a2dnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwODQxNTcsImV4cCI6MjA4ODY2MDE1N30.sS3yWvLoG3jcOj-eOWb4K9nIlUuAqBEIbSF9rECQ9dQ';

const loginForm = document.getElementById('login-form');
const loginBox = document.getElementById('login-box');
const splashScreen = document.getElementById('splash-screen');
const splashVideo = document.getElementById('splash-video');
const message = document.getElementById('message');
const passwordInput = document.getElementById('password');
const togglePassword = document.getElementById('togglePassword');
const brandLogo = document.getElementById('brand-logo');
const welcomeText = document.getElementById('welcome-text');

// 1. REPARACIÓN DEL OJO
togglePassword.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    togglePassword.textContent = isPassword ? '🔒' : '👁️';
});

// 2. DETECTOR DE CLIENTE (QR Inteligente)
const params = new URLSearchParams(window.location.search);
const clientID = params.get('c'); // Ejemplo: acceso.tukurforge.com/?c=101

async function checkClientIdentity() {
    if (clientID) {
        try {
            // Buscamos en la tabla 'negocios' el código aleatorio
            const res = await fetch(`${SUPABASE_URL}/rest/v1/negocios?id_aleatorio=eq.${clientID}&select=*`, {
                headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
            });
            const data = await res.json();
            if (data.length > 0) {
                brandLogo.src = data[0].logo_url;
                welcomeText.innerText = `Acceso: ${data[0].nombre_comercial}`;
            }
        } catch (e) { console.log("Usando logo por defecto."); }
    }
}
checkClientIdentity();

// 3. LOGICA DE LOGIN
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = document.getElementById('user-login').value.trim();
    const pass = passwordInput.value.trim();

    message.style.color = "white";
    message.innerText = "Verificando identidad...";

    try {
        const query = `${SUPABASE_URL}/rest/v1/usuarios?usuario_login=eq.${user}&password=eq.${pass}&select=*`;
        const response = await fetch(query, {
            headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
        });
        const data = await response.json();

        if (data && data.length > 0) {
            message.style.color = "#00ff00";
            message.innerText = "✅ Bienvenido";
            
            loginBox.classList.add('fade-out');
            setTimeout(() => {
                loginBox.classList.add('hidden');
                splashScreen.classList.remove('hidden');
                splashVideo.play();
            }, 500);

            splashVideo.onended = () => {
                localStorage.setItem('user_name', data[0].nombre_completo);
                window.location.href = 'dashboard.html';
            };
        } else {
            message.style.color = "#ff4d4d";
            message.innerText = "❌ Datos incorrectos";
            passwordInput.value = "";
        }
    } catch (err) {
        message.style.color = "#ff4d4d";
        message.innerText = "⚠️ Error de conexión";
    }
});
