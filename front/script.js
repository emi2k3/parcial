const username = document.getElementById('username');
const passwordinput = document.getElementById('password');
var token;

class usuario {
    constructor(username, contraseña) {
        this.username = username;
        this.contraseña = contraseña;
    }

}


document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();
  

        const newusuario = new usuario(username.value,passwordinput.value);
        await fetchdatos(newusuario)
        if(localStorage.getItem('token')!=null || localStorage.getItem('token')!=undefined)
        {
            token = localStorage.getItem('token');
            const arrayToken = token.split('.');
            const tokenPayload = JSON.parse(atob(arrayToken[1]));
            const is_admin = tokenPayload.is_admin;
            
            if(is_admin==true){
                window.location.href = "./Principala/index.html";
            }
            else{
                window.location.href = "./Principal/index.html";
            }

          
        }

     else {
        alert('Por favor, corrija los errores.');
    
}});


//POST
async function fetchdatos(usuario) {
    try {
        
        const response = await fetch("http://localhost/back/auth/", {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(usuario),

        })
        if(response.status===401)
            {
                username.value = '';
                passwordinput.value = '';
                return false;
            }
        if (!response.ok) {
            
            throw new Error("No funciona");
        }
        const data = await response.json();
        localStorage.setItem('token',data.token)
    }

    catch (err) {
        console.log(err);
    }
}