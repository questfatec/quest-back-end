function load() {

    const info = {
        "_id": sessionStorage.getItem('_id')
    }
 
    $.ajax({
        url:"/game/login",
        type: "PUT",
        //data: info, 
        success: (retorno) => {
            console.log("Jogador LOGADO no DB: ", retorno)
            alert('login com sucesso...por favor aguarde!')
        },
        error: (xhr) => {
            //console.log("Não deu certo o registro do usuário: " + xhr.status + " " + xhr.statusText);
            alert("Infelizmente já há dois jogadores. Por favor aguarde.")
            location.href = "/jogoV3"
        }
    })
}

function carregarMultiplayer(cat) {
    console.log('Categoria selecionada: ', cat)
    load()
}


