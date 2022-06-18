//Carregar dados básicos
const valorZerado = "Aguardando Início da partida..."

var rodada = {
    pontuaçãoRodada: {
        href: document.getElementById("pontuaçãoRodada"),
        valor: null,
        valorInicial: valorZerado
    },
    atualRodada: {
        href: document.getElementById("atualRodada"),
        valor: null,
        valorInicial: valorZerado
    },
    tempoRodada: {
        href: document.getElementById("tempoRodada"),
        valor: null,
        valorInicial: valorZerado
    },
    perguntaRodada: {
        href: document.getElementById("perguntaRodada_pergunta"),
        href_categoria: document.getElementById("perguntaRodada_categoria"),
        href_alternativaA: document.getElementById("perguntaRodada_alternativaA"),
        href_alternativaB: document.getElementById("perguntaRodada_alternativaB"),
        href_alternativaC: document.getElementById("perguntaRodada_alternativaC"),
        href_alternativaD: document.getElementById("perguntaRodada_alternativaD"),
        href_dica: document.getElementById("perguntaRodada_dica"),
        href_respostaCorreta: document.getElementById("perguntaRodada_respostaCorreta"),
        href_info: document.getElementById("perguntaRodada_info"),
        categoria: valorZerado,
        pergunta: valorZerado,
        alternativaA: valorZerado,
        alternativaB: valorZerado,
        alternativaC: valorZerado,
        alternativaD: valorZerado,
        dica: valorZerado,
        respostaCorreta: valorZerado,
        info: valorZerado
    },
    questoes_respondidas: [
        {_id:"000000000000000000000000"}
    ]

}

function carregaInicio() {
    $(rodada.perguntaRodada.href_categoria).append(rodada.perguntaRodada.categoria)
    $(rodada.pontuaçãoRodada.href).append(rodada.pontuaçãoRodada.valorInicial)
    $(rodada.atualRodada.href).append(rodada.atualRodada.valorInicial)
    $(rodada.tempoRodada.href).append(rodada.tempoRodada.valorInicial)
    $(rodada.perguntaRodada.href).append(rodada.perguntaRodada.pergunta)
    $(rodada.perguntaRodada.href_alternativaA).append(rodada.perguntaRodada.alternativaA)
    $(rodada.perguntaRodada.href_alternativaB).append(rodada.perguntaRodada.alternativaB)
    $(rodada.perguntaRodada.href_alternativaC).append(rodada.perguntaRodada.alternativaC)
    $(rodada.perguntaRodada.href_alternativaD).append(rodada.perguntaRodada.alternativaD)
    $(rodada.perguntaRodada.href_dica).append(rodada.perguntaRodada.dica)
    $(rodada.perguntaRodada.href_respostaCorreta).append(rodada.perguntaRodada.respostaCorreta)
    $(rodada.perguntaRodada.href_info).append(rodada.perguntaRodada.info)
}

carregaInicio()

function carregaPergunta(pergunta) {
    $(rodada.perguntaRodada.href_categoria).empty()
    $(rodada.perguntaRodada.href_categoria).append(pergunta.categoria)

    $(rodada.perguntaRodada.href).empty()
    $(rodada.perguntaRodada.href).append(pergunta.pergunta)

    $(rodada.perguntaRodada.href_alternativaA).empty()
    $(rodada.perguntaRodada.href_alternativaA).append(pergunta.alternativaA)
    $("#ativoA").attr("res", pergunta.alternativaA)

    $(rodada.perguntaRodada.href_alternativaB).empty()
    $(rodada.perguntaRodada.href_alternativaB).append(pergunta.alternativaB)
    $("#ativoB").attr("res", pergunta.alternativaB)

    $(rodada.perguntaRodada.href_alternativaC).empty()
    $(rodada.perguntaRodada.href_alternativaC).append(pergunta.alternativaC)
    $("#ativoC").attr("res", pergunta.alternativaC)

    $(rodada.perguntaRodada.href_alternativaD).empty()
    $(rodada.perguntaRodada.href_alternativaD).append(pergunta.alternativaD)
    $("#ativoD").attr("res", pergunta.alternativaD)

    $(rodada.perguntaRodada.href_dica).empty()
    $(rodada.perguntaRodada.href_dica).append("Não é um jogador VIP - PENDENTE")
    rodada.perguntaRodada.dica = pergunta.dica

    $(rodada.perguntaRodada.href_respostaCorreta).empty()
    $(rodada.perguntaRodada.href_respostaCorreta).append("Aguardando Jogador responder a pergunta.")
    rodada.perguntaRodada.respostaCorreta = pergunta.respostaCorreta

    $(rodada.perguntaRodada.href_info).empty()
    $(rodada.perguntaRodada.href_info).append("Aguardando Jogador responder a pergunta.")
    rodada.perguntaRodada.info = pergunta.info
}

function novapergunta(requisicao){
    $.ajax({
        url: "/jogoV3/pergunta",
        type: 'GET',
        dataType: 'json',
        headers: {
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(requisicao),
        },
        success: function(pergunta) {
            rodada.questoes_respondidas.push({_id:String(pergunta[0]._id)})
            carregaPergunta(pergunta[0])
        },
        error: function(xhr) {
            alert(xhr.responseText)
        }
    });
}

function iniciar(pontos) {

    window.sessionStorage.setItem('pontosPerguntaAtual', pontos);

    requisicao = {
        categoria: $('#categoriaInicial').val(),
        questoes_ja_respondidas: rodada.questoes_respondidas 
    }
    
    //console.log("Requisição: ", requisicao)

    novapergunta(requisicao)
}

function respostaValidar(resposta) {

    let pontosPerguntaAtual = window.sessionStorage.getItem('pontosPerguntaAtual');

    resposta = String($(resposta).attr("res"))
    
    if (resposta == rodada.perguntaRodada.respostaCorreta) {
        alert("CERTA RESPOSTA!")

        //Move peão vermelho se acertar resposta - falta controlar o peão azul
        socket.emit('moveRed', posicaoRed + pontosPerguntaAtual);

        if (fichaAposta.every(checkFicha)) {
          fichaAposta = [true, true, true, true, true];
        }

    } else { 
        res = "RESPOSTA ERRADA! A resposta correta era " + String(rodada.perguntaRodada.respostaCorreta)
        res = res + ". Explicação do Jogo: " + String(rodada.perguntaRodada.info)
        alert(res)
        //console.log("resposta dada: ", resposta)
        //console.log("resposta correta: ", rodada.perguntaRodada.respostaCorreta)
    }

    requisicao = {
        categoria: $('#categoriaInicial').val(),
        questoes_ja_respondidas: rodada.questoes_respondidas 
    }

    //novapergunta(requisicao)
}