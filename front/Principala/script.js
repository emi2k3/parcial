const tareaList = document.getElementById("tareaList");
const deleteDialog = document.getElementById("deleteDialog");
const confirmDeleteBtn = document.getElementById("confirmDelete");
const cancelDeleteBtn = document.getElementById("cancelDelete");
let tareatodelete = null;

var token = localStorage.getItem('token');

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}
if (token == null || token == undefined) {
    window.location.href  = '../'
}
async function fetchget() {
    try {
        const headers = { 'Authorization': `Bearer ${token}` };
        const response = await fetch(`http://localhost/back/tareas/`, { headers });
        if (response.status === 401) {
            window.location.href = 'http://localhost/'
        }
        if (!response.ok) {
            throw new Error("No funciona");
        }
        const tareas = await response.json();
        console.log(JSON.stringify(tareas));

        tareaList.innerHTML = '';

        tareas.forEach(tareas => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${tareas.nombre}</td>
                <td>${tareas.creador}</td>
                <td>${tareas.usuarios}</td>
                <td class="action-buttons">
                    <button class="edit-btn">
                       Edit
                    </button>
                    <button class="delete-btn data-id=${tareas.id_tarea}">
                        Del
                    </button>
                </td>
            `;

            tareaList.appendChild(row);
        });

        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', function () {
                
            });
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function () {

            });
        });
    }
    catch (err) {
        console.log(err);
    }
}

confirmDeleteBtn.addEventListener('click', async function () {
    if (tareatodelete) {
        try {

            const response = await fetch(`http://localhost/back/tareas/${tareatodelete}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                console.log('Tarea fue eliminada con éxito');
                await fetchget(); // Actualizar la lista después de eliminar
            } else {
                const errorData = await response.json();
                console.error('Error al eliminar la tarea:', errorData.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    deleteDialog.style.display = 'none';
});

cancelDeleteBtn.addEventListener('click', function () {
    deleteDialog.style.display = 'none';
});

const addcomment = document.getElementById("newCommentBtn");
addcomment.addEventListener('click', function (e) {
    window.location.href = '../Comentarios'
});

const deletetoken = document.getElementById("botoncerrar");
deletetoken.addEventListener('click', function (e) {
    localStorage.clear();
    window.location.href = '../'
});

fetchget();