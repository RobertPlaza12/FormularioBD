//llamada al backend
const API = "https://inv-ferreteriarodriguez.atwebpages.com/api/inv.php";

async function api(action, extra = {}) {
    const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...extra })
    });
    return res.json();
}

// Insertar
async function insertar() {
    const nombre = document.getElementById("nombre").value.trim();
    const cantidad = document.getElementById("cantidad").value;
    const precio = document.getElementById("precio").value;

    if (!nombre || !cantidad || !precio) {
        alert("Completa todos los campos.");
        return;
    }

    const resp = await api("insert", { nombre, cantidad, precio });
    alert(resp.msg);
    cargarTabla();
    limpiar();
}

// Actualizar
async function actualizar() {
    const id = document.getElementById("id").value;

    if (!id) {
        alert("No has seleccionado ningún registro.");
        return;
    }

    const nombre = document.getElementById("nombre").value.trim();
    const cantidad = document.getElementById("cantidad").value;
    const precio = document.getElementById("precio").value;

    const resp = await api("update", { id, nombre, cantidad, precio });
    alert(resp.msg);

    cargarTabla();
    limpiar();
}

// Eliminar
async function eliminar(id) {
    if(id) {
        // Eliminar desde la tabla
        if (!confirm("¿Eliminar este registro?")) return;

        const resp = await api("delete", { id });
        alert(resp.msg);
        cargarTabla();
    }else{
        // Eliminar desde la búsqueda
        const idBuscado = document.getElementById("idBuscado").value.trim();
        
        if (!idBuscado) {
            alert("Introduce un ID para buscar.");
            return;
        }
        
        if (!confirm("¿Eliminar este registro?")) return;

        const resp = await api("delete", { id: idBuscado });
        alert(resp.msg);
        cargarTabla();
    }
}

// iditar desde el formulario
function editar(item) {
    document.getElementById("id").value = item.id;
    document.getElementById("nombre").value = item.nombre;
    document.getElementById("cantidad").value = item.cantidad;
    document.getElementById("precio").value = item.precio;
}

// Cargar tabla completa
async function cargarTabla() {
    const resp = await api("all");
    const tbody = document.getElementById("tabla");

    tbody.innerHTML = "";

    resp.items.forEach(item => {
        tbody.innerHTML += `
            <tr>
                <td>${item.id}</td>
                <td>${item.nombre}</td>
                <td>${item.cantidad}</td>
                <td>${item.precio}</td>
                <td>
                    <button class="btn-edit" onclick='editar(${JSON.stringify(item)})'>Editar</button>
                    <button class="btn-delete" onclick="eliminar('${item.id}')">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

// Limpiar formulario
function limpiar() {
    document.getElementById("idBuscado").value = "";
    document.getElementById("nombre").value = "";
    document.getElementById("cantidad").value = "";
    document.getElementById("precio").value = "";
}

async function buscar() {
    const idBuscado = document.getElementById("idBuscado").value.trim();

    if (!idBuscado) {
        alert("Introduce un ID para buscar.");
        return;
    }

    const resp = await api("get", { id: idBuscado });

    if (resp.status === "ok") {
        const item = resp.item;

        document.getElementById("id").value = item.id;
        document.getElementById("nombre").value = item.nombre;
        document.getElementById("cantidad").value = item.cantidad;
        document.getElementById("precio").value = item.precio;

        alert("Producto encontrado.");
        return item.id;
    } else {
        alert("No existe un registro con ese ID.");
    }
}

cargarTabla();

