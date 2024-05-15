const board = document.getElementById("board");
const ownersList = document.getElementById("ownersList");

function createGrid() {
    board.innerHTML = "";
    ownersList.innerHTML=""; // Limpiar el tablero antes de crear uno nuevo
    const tableBody = document.createElement("tbody");
    for (let i = 0; i < 10; i++) {
        const row = document.createElement("tr");
        for (let j = 0; j < 10; j++) {
            const cell = document.createElement("td");
            cell.textContent = (i * 10 + j).toString().padStart(2, '0');
            cell.dataset.owner = "";
            cell.dataset.locked = "false"; // Añadir un atributo para marcar si está bloqueada
            cell.addEventListener("click", () => {
                if (cell.dataset.locked === "false") {
                    if (cell.dataset.owner === "" || cell.dataset.owner === localStorage.getItem("owner")) {
                        cell.classList.toggle("selected");
                        if (cell.classList.contains("selected")) {
                            const owner = prompt("Ingrese su nombre:");
                            if (owner !== null && owner.trim() !== "") {
                                cell.dataset.owner = owner.trim();
                                localStorage.setItem("owner", owner.trim());
                                updateOwnersList(); // Actualizar la lista lateral
                                // Aquí enviaríamos los datos al backend
                                console.log(`Número: ${cell.textContent}, Propietario: ${owner}`);
                            } else {
                                cell.classList.remove("selected");
                            }
                        } else {
                            cell.dataset.owner = "";
                            localStorage.removeItem("owner");
                            updateOwnersList(); // Actualizar la lista lateral
                        }
                    } else {
                        alert("Esta celda está bloqueada por otro propietario.");
                    }
                } else {
                    alert("Esta celda está bloqueada.");
                }
            });
            row.appendChild(cell);
        }
        tableBody.appendChild(row);
    }
    board.appendChild(tableBody);
}

createGrid();

// Función para desbloquear todas las celdas
function unlockCells() {
    const cells = document.querySelectorAll("td");
    cells.forEach(cell => {
        cell.classList.remove("selected");
        cell.dataset.owner = "";
        cell.dataset.locked = "false";
        localStorage.removeItem("owner");
    });
}

// Evento para generar un nuevo tablero
const newBoardButton = document.getElementById("newBoardButton");
newBoardButton.addEventListener("click", () => {
    unlockCells();
    createGrid();
});

// Función para mostrar la lista de propietarios
function updateOwnersList() {
    ownersList.innerHTML = "";
    const cells = document.querySelectorAll("td");
    const owners = new Map();
    cells.forEach(cell => {
        if (cell.dataset.owner !== "") {
            const owner = cell.dataset.owner;
            const number = cell.textContent;
            if (!owners.has(owner)) {
                owners.set(owner, []);
            }
            owners.get(owner).push(number);
        }
    });

    owners.forEach((numbers, owner) => {
        const ownerElement = document.createElement("div");
        ownerElement.classList.add("owner");
        ownerElement.textContent = `${owner}: ${numbers.join(", ")}`;
        ownersList.appendChild(ownerElement);
    });
}
