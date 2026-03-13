const SUPABASE_URL = 'https://echyplrboxmckxljtkgg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjaHlwbHJib3htY2t4bGp0a2dnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwODQxNTcsImV4cCI6MjA4ODY2MDE1N30.sS3yWvLoG3jcOj-eOWb4K9nIlUuAqBEIbSF9rECQ9dQ';

const loginForm = document.getElementById('login-form');
const brandLogo = document.getElementById('brand-logo');
const message = document.getElementById('message');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userLogin = document.getElementById('user-login').value;
    const pass = document.getElementById('password').value;

    message.style.color = 'white';
    message.innerText = 'Validando credenciales...';

    try {
        // 1. Consultamos la tabla Usuarios y hacemos el "Join" con Negocio
        const response = await fetch(`${SUPABASE_URL}/rest/v1/Usuarios?Usuario_Login=eq.${userLogin}&Password=eq.${pass}&select=*,Negocio(*)`, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });

        const data = await response.json();

        if (data.length > 0) {
            const usuario = data[0];
            message.style.color = '#00ff00';
            message.innerText = `¡Bienvenido, ${usuario.Nombre_Completo}!`;

            // 2. Magia Ejecutiva: Cambiamos el logo dinámicamente
            if (usuario.Negocio && usuario.Negocio.Logo_Empresa) {
                brandLogo.src = usuario.Negocio.Logo_Empresa;
            }
            
            // Aquí podrías redireccionar: window.location.href = 'dashboard.html';
        } else {
            message.style.color = '#ff4d4d';
            message.innerText = 'Usuario o contraseña incorrectos.';
        }
    } catch (error) {
        console.error(error);
        message.innerText = 'Error de conexión con el servidor.';
    }
});