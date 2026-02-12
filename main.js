let viajes = [];
let reservas = JSON.parse(localStorage.getItem("reservasViajes")) || [];

const listaViajes = document.getElementById("lista-viajes");
const reservasHTML = document.getElementById("reservas");
const btnVaciar = document.getElementById("btn-vaciar");
const formulario = document.getElementById("formulario");

/* =========================
   CARGA ASINCRÓNICA JSON
========================= */

fetch("viajes.json")
  .then(response => response.json())
  .then(data => {
    viajes = data;
    mostrarViajes();
  })
  .catch(() => {
    Swal.fire("Error", "No se pudieron cargar los destinos", "error");
  });

/* =========================
   MOSTRAR VIAJES
========================= */

function mostrarViajes() {
  listaViajes.innerHTML = "";

  viajes.forEach(viaje => {
    const div = document.createElement("div");
    div.className = "viaje";

    div.innerHTML = `
      <img 
        src="${viaje.imagen}" 
        alt="${viaje.destino}" 
        class="imagen-destino"
        data-img="${viaje.imagen}"
      >
      <h3>${viaje.destino}</h3>
      <p>${viaje.descripcion}</p>
      <p>Precio por día: $${viaje.precioPorDia}</p>
      
      <label>Días:</label>
      <input type="number" min="1" value="${viaje.duracionBase}" id="dias-${viaje.id}">
      
      <label>Personas:</label>
      <input type="number" min="1" value="1" id="personas-${viaje.id}">
      
      <label>Fecha:</label>
      <input type="date" id="fecha-${viaje.id}">
      
      <button data-id="${viaje.id}">Reservar</button>
    `;

    listaViajes.appendChild(div);
  });
}

/* =========================
   VALIDAR SUPERPOSICIÓN
========================= */

function haySuperposicion(fechaNueva, diasNuevos) {

  const inicioNuevo = new Date(fechaNueva);
  const finNuevo = new Date(inicioNuevo);
  finNuevo.setDate(finNuevo.getDate() + diasNuevos - 1);

  return reservas.some(reserva => {

    const inicioExistente = new Date(reserva.fecha);
    const finExistente = new Date(inicioExistente);
    finExistente.setDate(finExistente.getDate() + reserva.dias - 1);

    return (
      inicioNuevo <= finExistente &&
      finNuevo >= inicioExistente
    );
  });
}

/* =========================
   RESERVAR VIAJE
========================= */

function reservarViaje(id) {
  const viaje = viajes.find(v => v.id === id);

  const dias = Number(document.getElementById(`dias-${id}`).value);
  const personas = Number(document.getElementById(`personas-${id}`).value);
  const fecha = document.getElementById(`fecha-${id}`).value;

  if (!fecha) {
    Swal.fire("Error", "Seleccioná una fecha válida", "warning");
    return;
  }

  if (personas < 1) {
    Swal.fire("Error", "La cantidad de personas debe ser al menos 1", "warning");
    return;
  }

  const fechaSeleccionada = new Date(fecha);
  const hoy = new Date();

  if (fechaSeleccionada <= hoy) {
    Swal.fire("Error", "La fecha debe ser futura", "error");
    return;
  }

  // VALIDACIÓN DE SUPERPOSICIÓN
  if (haySuperposicion(fecha, dias)) {
    Swal.fire(
      "Fechas no disponibles",
      "Las fechas seleccionadas se superponen con otra reserva existente",
      "error"
    );
    return;
  }

  const total = dias * viaje.precioPorDia * personas;

  reservas.push({
    destino: viaje.destino,
    dias,
    personas,
    fecha,
    total
  });

  actualizarReservas();

  Swal.fire("Agregado", "Viaje agregado correctamente", "success");
}

/* =========================
   MOSTRAR RESERVAS
========================= */

function mostrarReservas() {
  reservasHTML.innerHTML = "";

  if (reservas.length === 0) {
    reservasHTML.innerHTML = "<p>No hay reservas.</p>";
    return;
  }

  reservas.forEach((reserva, index) => {
    const div = document.createElement("div");
    div.className = "reserva";

    div.innerHTML = `
      <strong>${reserva.destino}</strong><br>
      Fecha: ${reserva.fecha}<br>
      Días: ${reserva.dias}<br>
      Personas: ${reserva.personas}<br>
      Total: $${reserva.total}<br>
      <button data-index="${index}">Eliminar</button>
    `;

    reservasHTML.appendChild(div);
  });

  const totalGeneral = calcularTotalGeneral();

  const totalDiv = document.createElement("h3");
  totalDiv.textContent = `Total general: $${totalGeneral}`;
  reservasHTML.appendChild(totalDiv);
}

/* =========================
   CALCULAR TOTAL GENERAL
========================= */

function calcularTotalGeneral() {
  return reservas.reduce((acumulador, reserva) => {
    return acumulador + reserva.total;
  }, 0);
}

/* =========================
   STORAGE
========================= */

function actualizarReservas() {
  localStorage.setItem("reservasViajes", JSON.stringify(reservas));
  mostrarReservas();
}

/* =========================
   EVENTOS
========================= */

listaViajes.addEventListener("click", e => {

  if (e.target.tagName === "BUTTON") {
    reservarViaje(Number(e.target.dataset.id));
  }

  if (e.target.classList.contains("imagen-destino")) {
    const imagenURL = e.target.dataset.img;

    Swal.fire({
      imageUrl: imagenURL,
      imageAlt: "Imagen del destino",
      showConfirmButton: false,
      showCloseButton: true,
      width: "800px"
    });
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

/* =========================
   CONFIRMAR RESERVA
========================= */

formulario.addEventListener("submit", e => {
  e.preventDefault();

  if (reservas.length === 0) {
    Swal.fire("Error", "No hay reservas para confirmar", "warning");
    return;
  }

  const nombre = document.getElementById("nombre").value;

  if (!nombre.trim()) {
    Swal.fire("Error", "Ingresá un nombre válido", "warning");
    return;
  }

  const totalFinal = calcularTotalGeneral();

  Swal.fire({
    title: "Confirmar compra",
    text: `Total a pagar: $${totalFinal}`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí, confirmar"
  }).then(result => {
    if (result.isConfirmed) {
      Swal.fire("¡Reserva exitosa!", `Buen viaje ${nombre} ✈️`, "success");

      reservas = [];
      localStorage.removeItem("reservasViajes");
      mostrarReservas();
      formulario.reset();
    }
  });
});

/* =========================
   INIT
========================= */

mostrarReservas();
