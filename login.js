const AUTH_URL = "https://dummyjson.com/auth/login";

const formulario = document.getElementById("login-form");
const mensajeError = document.getElementById("mensajeError");
const botonFormulario= document.getElementById("botonInicioSesion");

formulario.addEventListener("submit", async (event) => {
  event.preventDefault();

  mensajeError.textContent = " ";
  botonFormulario.disabled = true;
  botonFormulario.textContent = "Iniciando sesión...";

  try{
    const datosFormulario = new FormData(formulario);

    const Usuario = {
        username : datosFormulario.get("NombreUsuario").trim(),
        password : datosFormulario.get("Contrasenia").trim()
    }
    const respuesta = await fetch(AUTH_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(Usuario)
    });

    if (!respuesta.ok) {
        mensajeError.textContent = "Usuario y/o contraseña incorrectos. Verifique los datos e intente nuevamente.";
        return;
    }

    const data = await respuesta.json();
    console.log(data);

    sessionStorage.setItem("accesstoken", data.accesstoken);
    sessionStorage.setItem("Usuario", data.firstName);             //para  mostrar el nombre con saludo en la barran anvegacion en el header get items

    window.location.href = "./Mascotas.html";   //para redirigir a la pagina mascotas!



  }catch (error){
    mensajeError.textContent = "Ocurrió un error al iniciar sesión. Por favor, inténtelo nuevamente más tarde.";
    console.error(error);
  } finally{
    botonFormulario.disabled = false;
    botonFormulario.textContent = "Iniciar sesión";
  }
 });
