const SUPABASE_URL = 'https://echyplrboxmckxljtkgg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjaHlwbHJib3htY2t4bGp0a2dnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwODQxNTcsImV4cCI6MjA4ODY2MDE1N30.sS3yWvLoG3jcOj-eOWb4K9nIlUuAqBEIbSF9rECQ9dQ';

const loginForm = document.getElementById('login-form');
const loginBox = document.getElementById('login-box');
const splashScreen = document.getElementById('splash-screen');
const splashVideo = document.getElementById('splash-video');
const brandLogo = document.getElementById('brand-logo');
const message = document.getElementById('message');
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

togglePassword.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    togglePassword.textContent = isPassword ? '🔒' : '👁️';
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userLogin = document.getElementById('user-login').value;
    const pass = passwordInput.value;

    message.style.color = 'white';
    message.innerText = 'Verificando en TukurForge...';

    try {
        const url = `${SUPABASE_URL}/rest/v1/usuarios?usuario_login=eq.${userLogin}&password=eq.${pass}&select=*`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: { 
                'apikey': SUPABASE_KEY, 
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            }
        });

        const data = await response.json();

        if (data && data.length > 0) {
            const usuario = data[0];
            message.style.color = '#00ff00';
            message.innerText = '✅ Credenciales correctas';

            loginBox.classList.add('fade-out');
            
            setTimeout(() => {
                loginBox.classList.add('hidden');
                splashScreen.classList.remove('hidden');
                splashVideo.play();
            }, 500);

            splashVideo.onended = () => {
                alert(`¡Bienvenido, ${usuario.nombre_completo}!`);
            };
        } else {
            message.style.color = '#ff4d4d';
            message.innerText = '❌ Error: Datos incorrectos';
        }
    } catch (error) {
        console.error("Error de socio:", error);
        message.innerText = '⚠️ Error de red. Revisa tu conexión.';
    }
});