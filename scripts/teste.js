questoes_ja_respondidas = ["3","4"]

qtd_perguntas_respondidas = questoes_ja_respondidas.length

filtro_perguntas_respondidas = []

for(i=0;qtd_perguntas_respondidas>i;i++) {
    filtro_perguntas_respondidas.push( { idBruno: { $ne: String(questoes_ja_respondidas[i]) } } )
}

filtro_perguntas_respondidas = { $and: filtro_perguntas_respondidas }

console.log(filtro_perguntas_respondidas)