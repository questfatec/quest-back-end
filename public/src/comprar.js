function comprar() {

    let agora =  new Date()
    let anoHj = agora.getFullYear()
    let mesHj = agora.getMonth()

    var regcompra = {
        idUser : sessionStorage.getItem('_id'),
        dataUniversalCompra : agora.toISOString(),
        ncc : document.getElementById("ncc").value,
        nccExpMes : document.getElementById("nccExpMes").value,
        nccExpAno : document.getElementById("nccExpAno").value,
        nccCvc : document.getElementById("nccCvc").value,
        nccNome : document.getElementById("nccNome").value,
        nccCPF : document.getElementById("nccCPF").value
    }

    function validar() {
        //Testar se número do cartão foi preenchido
        if (
                regcompra.ncc == "" || 
                regcompra.ncc.length < 15 ||
                regcompra.ncc < 3399999999999999 ||
                regcompra.ncc > 6599999999999999 
            ) {
            
                alert("Por favor informe um número de cartão de crédito válido!")

        } else if (regcompra.nccNome == "") {

            alert("Por favor informe o nome como está no cartão de crédito!")

        } else if (regcompra.nccExpAno <= anoHj && regcompra.nccExpMes <= mesHj +1  ) {

            alert("Parece que o cartão de crédito já venceu ou irá expirar neste mês. Por favor verifique o ano informado e tente novamente.")

        } else if (
                regcompra.nccCvc == "" ||
                regcompra.nccCvc.length < 1 || 
                regcompra.nccCvc < 1
            ) {

            alert("Por favor informe o código de segurança do cartão de crédito!")

        } else if (
                regcompra.nccCPF == "" ||
                regcompra.nccCPF.length < 11 || 
                regcompra.nccCPF < 1000000
            ) {

            alert("Por favor informe o CPF associado ao cartão de crédito!")

        } else {

            alert("Agora só enviar e gravar no bd o registro e alterar o status do usuário para VIP!")
            console.log(regcompra)
        }
    }

    validar()
    //console.log(req.session)

}