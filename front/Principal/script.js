const tareaList = document.getElementById("tareaList");
const deleteDialog = document.getElementById("deleteDialog");
const confirmDeleteBtn = document.getElementById("confirmDelete");
const cancelDeleteBtn = document.getElementById("cancelDelete");
let personToDelete = null;

var token = localStorage.getItem('token');

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}
if (token == null || token == undefined) {
    window.location.href  = '../'
}
async function fetchget() {
    const arrayToken = token.split('.');
    const tokenPayload = JSON.parse(atob(arrayToken[1]));
    const id_usuario = tokenPayload.id_usuario;
    try {
        const headers = { 'Authorization': `Bearer ${token}` };
        const response = await fetch(`http://localhost/back/usuarios/${id_usuario}/tareas/`, { headers });
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
                    <button class="edit-btn" data-id="${tareas.id_usuario}">
                       Edit
                    </button>
                    <button class="delete-btn" data-persona='${tareas.id_usuario}'>
                        Del
                    </button>
                </td>
            `;

            tareaList.appendChild(row);
        });

        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', function () {
                const personaId = this.getAttribute('data-id');
                const arrayToken = token.split('.');
                const tokenPayload = JSON.parse(atob(arrayToken[1]));
                if (personaId == tokenPayload.id) {
                    window.location.href = `./editar/form.html?id=${personaId}`;
                }
                else {
                    alert("NO tiene permisos para modificar este usuario.")
                }
            });
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function () {
                personToDelete = this.getAttribute('data-persona');
                const arrayToken = token.split('.');
                const tokenPayload = JSON.parse(atob(arrayToken[1]));
                if (personToDelete == tokenPayload.id) {
                    deleteDialog.style.display = 'flex';
                }
                else {
                    alert("NO tiene permisos para modificar este usuario.")
                }

            });
        });
    }
    catch (err) {
        console.log(err);
    }
}

confirmDeleteBtn.addEventListener('click', async function () {
    if (personToDelete) {
        try {

            const response = await fetch(`https://localhost/backend/personas/${personToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(personToDelete)
            });

            if (response.ok) {
                console.log('Persona eliminada con éxito');
                await fetchget(); // Actualizar la lista después de eliminar
                localStorage.clear();
                window.location.href = './alta/form.html'
            } else {
                const errorData = await response.json();
                console.error('Error al eliminar la persona:', errorData.error);
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