let agora =  new Date()
let anoHj = agora.getFullYear()
let mesHj = agora.getMonth()

tipo = sessionStorage.getItem('vip');

if(tipo == "true") {
    tipo = "Cancelamento"
    console.log("tip txs:", tipo)
} else if(tipo == "false") {
    tipo = "Compra"
    console.log("tip txs:", tipo)
} else { console.log("Tipo de Transação não identificado")}

let reg = {
    idUser : "",
    dataUniversalCompra : "",
    ncc : "",
    nccExpMes : "",
    nccExpAno : "",
    nccCvc : "",
    nccNome : "",
    nccCPF : "",
    tipoTsx : tipo
}


function alterarPerfil(reg) {
    $.ajax({
        url: "/pagamento/gerenciar",
        type: 'PUT',
        data: reg,
        success: function(resposta) {
            if(reg.tipoTsx == "Cancelamento") {
                window.sessionStorage.setItem('vip', false)
            } else if (reg.tipoTsx == "Compra") {
                window.sessionStorage.setItem('vip', true)
            } else {
                alert("ERRO na hora de alterar o valor da sessio de VIP!")
            }
            alert('Seu usuário foi atualizado. Você será desconectado para que o sistema considere o cancelamento. Por favor aguarde.')
        },
        error: function(xhr) {
            alert(xhr.status, ":", xhr.responseText)
            console.log("Não deu certo a alteração!!: " + xhr.status + " " + xhr.responseText);
        }
    });
}

function validar(reg) {
    //Testar se número do cartão foi preenchido
    if (
            reg.ncc == "" || 
            reg.ncc.length < 15 ||
            reg.ncc < 3399999999999999 ||
            reg.ncc > 6599999999999999 
        ) {
        
            alert("Por favor informe um número de cartão de crédito válido!")

    } else if (reg.nccNome == "") {

        alert("Por favor informe o nome como está no cartão de crédito!")

    } else if (reg.nccExpAno <= anoHj && reg.nccExpMes <= mesHj +1  ) {

        alert("Parece que o cartão de crédito já venceu ou irá expirar neste mês. Por favor verifique o ano informado e tente novamente.")

    } else if (
            reg.nccCvc == "" ||
            reg.nccCvc.length < 2 || 
            reg.nccCvc < 1
        ) {

        alert("Por favor informe o código de segurança do cartão de crédito!")

    } else if (
            reg.nccCPF == "" ||
            reg.nccCPF.length < 11 || 
            reg.nccCPF < 1000000
        ) {

        alert("Por favor informe o CPF associado ao cartão de crédito!")

    } else {
        alterarPerfil(reg)
    }
}


function ler(reg) {
    console.log("reg.tipoTsx ao ler", reg)

    reg.idUser = sessionStorage.getItem('_id')
    reg.dataUniversalCompra = agora.toISOString()

     if (reg.tipoTsx == "Compra") {
        reg.ncc = document.getElementById("ncc").value,
        reg.nccExpMes = document.getElementById("nccExpMes").value,
        reg.nccExpAno = document.getElementById("nccExpAno").value,
        reg.nccCvc = document.getElementById("nccCvc").value,
        reg.nccNome = document.getElementById("nccNome").value,
        reg.nccCPF = document.getElementById("nccCPF").value
    }

    console.log("reg:", reg)
}

function gerenciar() {

    console.log(reg.tipoTsx)
    ler(reg)

    if(reg.tipoTsx == 'Compra') {
        validar(reg)
    } else if (reg.tipoTsx == 'Cancelamento') {
        console.log(reg)
        alterarPerfil(reg)
    } else {
        console.log("Falha ao tentar gerenciar - comprar.js linha 113")
    }
}
