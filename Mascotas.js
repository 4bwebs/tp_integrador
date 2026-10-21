const Mascotas = [];

const listaMascotas = document.getElementById("lista-mascotas");

const total = document.getElementById("total");

const formulario = document.getElementById("form-mascotas");
// Panel rápido - buscador y contador
const buscador = document.getElementById('buscadorMascotas');
const contador = document.getElementById('mi-contador');

function actualizarContador() {
  const mascotas = JSON.parse(localStorage.getItem('mascotas') || '[]');
  if(contador) contador.textContent = `${mascotas.length} mascotas`;
}

if(buscador){
  buscador.addEventListener('input', (e) => {
    const texto = e.target.value.toLowerCase();
    const filas = document.querySelectorAll('tbody tr');
    filas.forEach(fila => {
      fila.style.display = fila.textContent.toLowerCase().includes(texto) ? '' : 'none';
    });
  });
}

document.addEventListener('DOMContentLoaded', actualizarContador);
const form = document.querySelector('form');
if(form) form.addEventListener('submit', () => setTimeout(actualizarContador, 300));
