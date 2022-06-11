//Botão 'Entrar'
const botaoLogar = document.getElementById("entrarJogador")

chave = null
sessionStorage. clear()
sessionStorage.setItem("authorization","")

async function logar() {
    
    var user = { 
    email: $("#email").val(),
    password: $("#password").val()
}
    if(!user.email || !user.password) {
        alert('Por favor preencha o usuário e a senha e tente novamente.')
    } else {
        $.post('/auth/authenticate', user, async(user) => {
                //console.log("Teste: ", user.token)
                chave = "Bearer " + user.token
                //console.log("Chave Set: ", chave)
                return chave
            }, 'json')
        .fail((erro) => {
                //console.log("Erro durante autenticação.")
            if (typeof erro !== 'undefined') {
                //console.log("Tentou login com esse usuário: ", user)
                alert(erro.responseJSON.error)
            } else {
                console.log("Erro durante autenticação no front: ", erro.status, " - ", erro.responseJSON.error)
                alert(erro.responseJSON.error)
                location.href="/"
            }
        }).done(async(retorno) => {
            //console.log("Chave Pre-set: ", chave)
            //console.log("Usuário Autenticado com Sucesso (done), esse é o token que veio do servidor ;) ==> ", retorno.token)

            sessionStorage. removeItem('authorization')
            
            window.sessionStorage.setItem('_id', retorno.user._id);
            window.sessionStorage.setItem('username', retorno.user.name);
            window.sessionStorage.setItem('vip', retorno.user.VIP);
            window.sessionStorage.setItem('email', retorno.user.email);

            location.href="/jogoV3/"
        })
    }
}

botaoLogar.addEventListener('click', logar)

//Botão 'Novo Jogador'
const botaoNovoJogador = document.getElementById("novoJogador")
async function criaNovoJogador() {
    //console.log("Tentei criar novo jogador")
    location.href="/auth/new"
}
botaoNovoJogador.addEventListener('click', criaNovoJogador)
