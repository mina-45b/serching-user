const btnSearch = document.getElementById('btn-search');
const userResult = document.getElementById('user-result');
const userData = document.getElementById('user-data');
const idUser = document.getElementById('id-user');


btnSearch.addEventListener('click', async () => {

    while (userData.firstChild) {
        userData.removeChild(userData.firstChild);
    }

    const id = idUser.value;

    if (idUser.checkValidity() && id != '') {
        console.log("es válido");
        visibilityUserResult('flex');
        const liLoading = addLoadingText();
        userData.appendChild(liLoading);

        try {
            const data = await getUser(id);
            showUserData(data);
        } catch (error) { //capturo errores del fetch - y http//
            showError(error);
            console.log(error);
        } finally {
            //Siempre se ejecuta//
            userData.removeChild(liLoading);
        }
    } else {
        visibilityUserResult('none');
    }
});

async function getUser(id) {
    let response;
    try {
        response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
    } catch (error) {
        error.message = "Error de conexión";
        error.code = "offline"; //genero error del conexión//
        throw error;
    }

    console.log(`Estado: ${response.status}`);
    console.log(`Url: ${response.url}`);

    if (response.ok) {
        console.log(`Respuesta ok: ${response.ok}`);

        let data = await response.json();
        return data;
    }
    else {
        const error = new Error("Error HTTP");
        error.code = response.status; //genero error del status//
        throw error;
    }
}

function addLoadingText() {
    const li = document.createElement('li');
    li.textContent = "Cargando..."
    return (li);
}

function visibilityUserResult(attribute) {
    userResult.style.display = attribute;
}

function showUserData(data) {
    const liNameUser = document.createElement('li');
    const liEmailUser = document.createElement('li');
    liNameUser.textContent = `Name: ${data.name}`;
    liEmailUser.textContent = `Email: ${data.email}`;
    userData.appendChild(liNameUser);
    userData.appendChild(liEmailUser);
}

function showError(error) {
    console.log(`Mensaje error: ${error.message}`);
    const liNotFound = document.createElement('li');
    switch (error.code) {
        case 400:
            liNotFound.textContent = 'Solicitud no procesada';
            break;
        case 401:
            liNotFound.textContent = 'Permiso no autorizado';
            break;
        case 403:
            liNotFound.textContent = 'Permiso denegado';
            break;
        case 404:
            liNotFound.textContent = 'Usuario no encontrado';
            break;
        case 429:
            liNotFound.textContent = 'Demasiadas solicitudes';
            break;
        case 500:
            liNotFound.textContent = 'Error interno del servidor';
            break;
        case 503:
            liNotFound.textContent = 'El servidor esta temporalmente duera de servicio';
            break;
        default:
            liNotFound.textContent = error.message;
    }
    userData.appendChild(liNotFound);
}