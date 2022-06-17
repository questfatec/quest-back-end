//Listar todas as categorias
async function listarCategorias(categorias) {

    var traducao_categoria_free = null
    var recebido_categoria_free = null

    if (categorias.free == true) {
        traducao_categoria_free = "Sim"
        recebido_categoria_free = `
            <select name="categoria" id="freeNova_${categorias._id}">
                <option value="true">Sim</option>
                <option value="false">Não</option>
            </select>&nbsp;&nbsp;
        `
    } else if (categorias.free == false) {
        traducao_categoria_free = "Não"
        recebido_categoria_free = `
            <select name="categoria" id="freeNova_${categorias._id}">
                <option value="false">Não</option>
                <option value="true">Sim</option>
            </select>&nbsp;&nbsp;
        `
    } else {
        traducao_categoria_free = "Erro"
    }

    versao_atual = categorias.__v + 1

    recebido =`
        <tr class='categoriaLista' id='tr_${categorias._id}'>
            <td>${categorias._id}</td>
            <td>
                <input type="text" value="${categorias.categoria}" id='categoria_nome_nova${categorias._id}'></input>
                <input type="hidden" value="${categorias.categoria}" id='categoria_nome_velha${categorias._id}'></input>
            </td>
            <td id='categoria_free_${categorias._id}' value='categoria_free_${categorias._id}'>
                ${recebido_categoria_free}
            </td>
            <td>${categorias.createdAt}</td>
            <td>${versao_atual}</td>
            <td>
                <a href="#" onclick="editar('${categorias._id}')">SALVAR</a>
            </td>
            <td>
                <a href="#" onclick="excluir('${categorias._id}')">EXCLUIR</a>
            </td>
        </tr>
    `

    $("#listaCategorias").append(recebido)

}

//Editar categoria específica
async function editar(idParaEditar) {
    idCategoriaNomeNova = "#categoria_nome_nova" + idParaEditar
    categoriaNomeNova = $(idCategoriaNomeNova).val()

    idCategoriaNomeVelha = "#categoria_nome_velha" + idParaEditar
    categoriaNomeVelha = $(idCategoriaNomeVelha).val()

    idFreeNova = "#freeNova_" + idParaEditar
    categoriaFreeNova = $(idFreeNova).val()
    
    var novaCategoria = {
        _id: idParaEditar,
        categoriaNova : categoriaNomeNova,
        categoriaVelha : categoriaNomeVelha,
        freeNova : categoriaFreeNova
    }

    console.log(novaCategoria)

    $.ajax({
        url: "/categoria/",
        type: 'PUT',
        data: novaCategoria,
        success: function(resposta) {
            $('.categoriaLista').remove()
            buscarCategorias()
            alert(resposta)
        },
        error: function(xhr) {
            $('.categoriaLista').remove()
            buscarCategorias()
            alert(xhr.status, ":", xhr.responseText)
            console.log("Não deu certo a alteração!!: " + xhr.status + " " + xhr.responseText);
        }
    });
}

//Buscar categorias
async function buscarCategorias() {
    $.get(
        '/categoria/categorias',
        (categorias) => {
            var qtd = Object.keys(categorias).length
            if (qtd == 0 || !qtd) {
                console.log("Não há categorias cadastradas")
                $("#listaCategorias").append(`<b>AINDA NÃO HÁ CATEGORIAS!</b>`)
            } else {
                console.log("Quantidade atual de categorias no banco de dados: ", qtd)
                categorias.forEach(listarCategorias)
            }
        }
    )
}

buscarCategorias()

//Excluir categoria
async function excluir(idCategoriaExcluir) {
    console.log("começando a deletar")
    id = {_id: idCategoriaExcluir} 
    console.log("Id: ", id)
    $.ajax({
        url: "/categoria/",
        type: 'DELETE',
        data: id,
        success: function(resposta) {
            $('.categoriaLista').remove()
            buscarCategorias()
            alert(resposta)
        },
        error: function(xhr) {
            alert(xhr.status, ":", xhr.responseText)
            console.log("Não deu certo a exclusão!!: " + xhr.status + " " + xhr.responseText);
        }
    });
}

//Cadastrar nova categoria
async function gravarNovaCategoria () {

    //Guardar valores na memória para criação de objeto e validação 
    categoriaNova = $("#categoriaNova").val()
    freeNova = $("#freeNova").val()

    //Criar objeto para os dados que serão cadastrados na nova categoria
    var novaCategoria = {
        categoria : categoriaNova,
        free : freeNova
    }

    //Teste - O que estão tentando cadastrar
    console.log(novaCategoria)

    if( !categoriaNova || !freeNova ) {
        alert("Impossível gravar nova categoria. Por favor preencha todos os campos e tente novamente.")
    } else {
        $.ajax({
            url: "/categoria/",
            type: 'POST',
            data: novaCategoria, 
            success: function(resposta) {
                $('.categoriaLista').remove()
                buscarCategorias()
                alert("Categoria registrada com sucesso!")
            },
            error: function(xhr) {
                alert(xhr.status, ":", xhr.responseText)
                console.log("Não deu certo a criação de uma nova categoria!!: " + xhr.status + " " + xhr.statusText);
            }
        });
    }
}