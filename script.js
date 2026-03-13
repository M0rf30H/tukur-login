const SUPABASE_URL = 'https://echyplrboxmckxljtkgg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjaHlwbHJib3htY2t4bGp0a2dnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwODQxNTcsImV4cCI6MjA4ODY2MDE1N30.sS3yWvLoG3jcOj-eOWb4K9nIlUuAqBEIbSF9rECQ9dQ';

const loginForm = document.getElementById('login-form');
const loginBox = document.getElementById('login-box');
const splashScreen = document.getElementById('splash-screen');
const splashVideo = document.getElementById('splash-video');
const message = document.getElementById('message');
const passwordInput = document.getElementById('password');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    // .trim() elimina espacios accidentales que metas al copiar/pegar
    const userLogin = document.getElementById('user-login').value.trim();
    const pass = passwordInput.value.trim();

    message.style.color = 'white';
    message.innerText = 'Conectando con TukurForge...';

    try {
        const url = `${SUPABASE_URL}/rest/v1/usuarios?usuario_login=eq.${userLogin}&password=eq.${pass}&select=*`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: { 
                'apikey': SUPABASE_KEY, 
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });

        const data = await response.json();

        // LOG PARA SOCIOS: Si esto falla, presiona F12 en tu página y dime qué sale en "Console"
        console.log("Respuesta de Supabase:", data);

        if (data && data.length > 0) {
            message.style.color = '#00ff00';
            message.innerText = '✅ Acceso correcto';

            loginBox.classList.add('fade-out');
            setTimeout(() => {
                loginBox.classList.add('hidden');
                splashScreen.classList.remove('hidden');
                splashVideo.play().catch(err => console.error("Error video:", err));
            }, 500);
        } else {
            message.style.color = '#ff4d4d';
            message.innerText = '❌ Error: Datos incorrectos';
        }
    } catch (error) {
        console.error("Error técnico:", error);
        message.innerText = '⚠️ Error de red o base de datos.';
    }
});