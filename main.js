// VARIABLES Y CONSTANTES
    const productos = [
      { nombre: "Mouse", precio: 5000 },
      { nombre: "Teclado", precio: 12000 },
      { nombre: "Auriculares", precio: 8000 }
    ];

    let carrito = [];
    let total = 0;

    console.log("Productos disponibles:", productos);

    // Mostrar productos disponibles
    function mostrarProductos() {
      let lista = "Productos disponibles:\n";
      productos.forEach((p, index) => {
        lista += index + 1 + ". " + p.nombre + " - $" + p.precio + "\n";
      });
      alert(lista);
    }

    // Agregar producto al carrito
    function agregarAlCarrito() {
      const opcion = prompt("Ingrese el número del producto que desea agregar:");

      const index = parseInt(opcion) - 1;

      if (isNaN(index) || index < 0 || index >= productos.length) {
        alert("Opción inválida. Intente nuevamente.");
        return;
      }

      carrito.push(productos[index]);
      total += productos[index].precio;

      console.log("Producto agregado:", productos[index]);
      alert("Agregado al carrito: " + productos[index].nombre);
    }

    // Mostrar resumen
    function mostrarCarrito() {
      if (carrito.length === 0) {
        alert("El carrito está vacío.");
        return;
      }

      let resumen = "Carrito actual:\n";
      carrito.forEach((p) => {
        resumen += "- " + p.nombre + " ($" + p.precio + ")\n";
      });
      resumen += "\nTOTAL: $" + total;

      alert(resumen);
    }

    // Proceso principal

    alert("Bienvenido a la tienda interactiva!");

    let continuar = true;

    while (continuar) {
      mostrarProductos();

      agregarAlCarrito();

      mostrarCarrito();

      continuar = confirm("¿Desea seguir comprando?");
    }

    // Confirmación de compra final
    if (carrito.length > 0) {
      const confirmar = confirm("¿Desea confirmar su compra por $" + total + "?");

      if (confirmar) {
        alert("¡Compra realizada con éxito! Gracias por su compra.");
        console.log("Compra finalizada:", carrito);
      } else {
        alert("Compra cancelada.");
        console.log("El usuario canceló la compra.");
      }
    } else {
      alert("No agregó productos. ¡Hasta la próxima!");
    }
