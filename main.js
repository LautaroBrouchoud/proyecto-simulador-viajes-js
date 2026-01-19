// VIAJES DISPONIBLES
const viajes = [
  { id: 1, destino: "Bariloche", duracion: "5 días" },
  { id: 2, destino: "Cataratas del Iguazú", duracion: "3 días" },
  { id: 3, destino: "Mendoza", duracion: "4 días" }
];

// DOM
const listaViajes = document.getElementById("lista-viajes");
const reservasHTML = document.getElementById("reservas");
const btnVaciar = document.getElementById("btn-vaciar");
const formulario = document.getElementById("formulario");
const mensajeFinal = document.getElementById("mensaje-final");

// STORAGE
let reservas = JSON.parse(localStorage.getItem("reservasViajes")) || [];

// MOSTRAR VIAJES
function mostrarViajes() {
  listaViajes.innerHTML = "";

  viajes.forEach(viaje => {
    const div = document.createElement("div");
    div.className = "viaje";
    div.innerHTML = `
      <p><strong>${viaje.destino}</strong></p>
      <p>Duración: ${viaje.duracion}</p>
      <button data-id="${viaje.id}">Reservar</button>
    `;
    listaViajes.appendChild(div);
  });
}

// AGREGAR RESERVA
function reservarViaje(id) {
  const viaje = viajes.find(v => v.id === id);
  reservas.push(viaje);
  actualizarReservas();
}

// MOSTRAR RESERVAS
function mostrarReservas() {
  reservasHTML.innerHTML = "";

  if (reservas.length === 0) {
    reservasHTML.innerHTML = "<p>No hay viajes reservados</p>";
    return;
  }

  reservas.forEach((reserva, index) => {
    const div = document.createElement("div");
    div.className = "reserva";
    div.innerHTML = `
      ${reserva.destino} (${reserva.duracion})
      <button data-index="${index}">Eliminar</button>
    `;
    reservasHTML.appendChild(div);
  });
}

// ACTUALIZAR STORAGE
function actualizarReservas() {
  localStorage.setItem("reservasViajes", JSON.stringify(reservas));
  mostrarReservas();
}

// EVENTOS
listaViajes.addEventListener("click", e => {
  if (e.target.tagName === "BUTTON") {
    reservarViaje(Number(e.target.dataset.id));
  }
});

reservasHTML.addEventListener("click", e => {
  if (e.target.tagName === "BUTTON") {
    reservas.splice(Number(e.target.dataset.index), 1);
    actualizarReservas();
  }
});

btnVaciar.addEventListener("click", () => {
  reservas = [];
  actualizarReservas();
});

// FORMULARIO
formulario.addEventListener("submit", e => {
  e.preventDefault();

  if (reservas.length === 0) {
    mensajeFinal.textContent = "No hay reservas para confirmar.";
    return;
  }

  const nombre = document.getElementById("nombre").value;
  mensajeFinal.textContent = `Reserva confirmada para ${nombre}. ¡Buen viaje! ✈️`;

  reservas = [];
  localStorage.clear();
  mostrarReservas();
  formulario.reset();
});

// INIT
mostrarViajes();
mostrarReservas();
