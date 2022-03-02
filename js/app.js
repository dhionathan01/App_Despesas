class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }
    validarDados() {
        for (let i in this) {
            if (this[i] == undefined || this[i] == '' || this[i] == null) { //this[i] Explicação detalhada: Aula 281 '06:00' minutos
                return false
            } 
        }
        return true
    }
}

// Classe BD (banco de dados), feita para persistir os dados no local storange
class Bd {
    constructor() {
        // Verificando se existe um id, caso não criar o índice 0
        let id = localStorage.getItem('id')
        if (id === null) {
            localStorage.setItem('id', 0)
        }
    }
    getProximoId() {
        // Gera o id seguinte ao existente para persistir os dados
        let proximoId = localStorage.getItem('id') 
        return(parseInt(proximoId) + 1) // retorna o valor que será dado ao id
    }
    gravarDados(dados) {
        //localStorage.setItem('despesa', JSON.stringify(dados)) //JSON.stringify converte um objeto literal em notação JSON
        let id = this.getProximoId() // Pega o id disponível para inserção dos dados
        localStorage.setItem(id, JSON.stringify(dados)) // Setando dados no localstorange
        localStorage.setItem('id', id)
    }

    recuperarTodosRegistros() {

        //lista para armazenar todas as despesas
        let listaDespesa = Array()

        let id = localStorage.getItem('id')

        // recuperando todas as despesas cadastradas em localStorange
        for (let i = 1; i <= id; i++){
            //recuperando despesa
            let despesa = localStorage.getItem(i)
            // convertendo a string para um objeto literal, para que possamos tratar seu dados
            despesa = JSON.parse(despesa)

            // Tratando itens que foram pulados/removidos
            if (despesa === null) {
                continue // Nesse contexto o continue ignora todo o restante do código no loop e passa para o próxima iteração
                        // Desse modo o listaDespesa.push(despesa) é ignorado e passa pra próxima repetição do loop
            }
            //Criando um id para cada objeto listado
            despesa.id = i
            listaDespesa.push(despesa)
        }
        return listaDespesa
    }
    pesquisar(despesa) {

        let despesasFiltradas = Array()
        despesasFiltradas = this.recuperarTodosRegistros()
        // ano
        // Se despesa ano não for vazio faça //  Utilizado para que caso não seja preenchido não aja o filtro e todos os itens sejam exibidos normalmente
        if (despesa.ano != '') {
            // precisamos sobrepor o array para que a próxima verificação seja feita com base na anterior
            despesasFiltradas = despesasFiltradas.filter(item => item.ano == despesa.ano)
        }
        // mes

        if (despesa.mes != '') {
            despesasFiltradas = despesasFiltradas.filter(item => item.mes == despesa.mes)
        }
        // dia
        if (despesa.dia != '') {
            despesasFiltradas = despesasFiltradas.filter(item => item.dia == despesa.dia)
        }
        // tipo
        if (despesa.tipo != '') {
            despesasFiltradas = despesasFiltradas.filter(item => item.tipo == despesa.tipo)
        }
        // descricao
        if (despesa.descricao != '') {
            despesasFiltradas = despesasFiltradas.filter(item => item.descricao == despesa.descricao)
        }
        //

        return despesasFiltradas
    }

    remover(id) {
        localStorage.removeItem(id)
    }

}

let bd = new Bd()

function configurarModal(validacao) {
    if (validacao == 'sucess') {
        document.getElementById('header_color').className = 'modal-header text-success'
        document.getElementById('btn_color').className = 'btn btn-success'
        document.getElementById('exampleModalLabel').innerHTML = 'Registro inserido com sucesso'
        document.getElementById('mensagem_modal').innerHTML = 'Despesa foi cadastrada com sucesso'
        document.getElementById('btn_color').innerHTML = 'Voltar'
    } else if (validacao == 'falha') {
        document.getElementById('header_color').className = 'modal-header text-danger'
        document.getElementById('btn_color').className = 'btn btn-danger'
        document.getElementById('exampleModalLabel').innerHTML = 'Falha ao cadastrar registro'
        document.getElementById('mensagem_modal').innerHTML = 'Alguns campos obrigatórios não foram preenchidos'
        document.getElementById('btn_color').innerHTML = 'Voltar e Ajustar'
        
    }
}

function limparInputs() {
    document.getElementById('ano').value = ''
    document.getElementById('mes').value = ''
    document.getElementById('dia').value = ''
    document.getElementById('tipo').value = ''
    document.getElementById('descricao').value = ''
    document.getElementById('valor').value = ''
}

function cadastrarDespesa() {
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    )
    if (despesa.validarDados()) {
        bd.gravarDados(despesa)
        configurarModal('sucess')
        // dialog de sucesso
        $('#modalRegistraDespesa').modal('show')
        limparInputs()
        
    } else {
        configurarModal('falha')
        // dialog de erro
        $('#modalRegistraDespesa').modal('show')
    }  
}

function formatandoExibirTipo(itens_despesas) {
    switch (itens_despesas.tipo) {
        case '1': itens_despesas.tipo = 'Alimentação'
            break
        case '2': itens_despesas.tipo = 'Educação'
            break
        case '3': itens_despesas.tipo = 'Lazer'
            break
        case '4': itens_despesas.tipo = 'Saúde'
            break
        case '5': itens_despesas.tipo = 'Transporte'
            break
    }

    return itens_despesas.tipo
}

// Caso não for passado nada ana função (nenhum paramentro),ela criar um array por default (explicação Aula 290 , 6:50 )


function carregaListaDespesas(listaDespesas = Array(), filtro = false) {
    // Caso o array por default esteja vazio, chama a função para exibir todos, e não tenha valores escritos em filtro
    if (listaDespesas.length == 0 && filtro == false) {
        listaDespesas = bd.recuperarTodosRegistros()
    }
    //selecionando o elemento tbody da tabela
    var listaDespesasView = document.getElementById('listaDespesasView')
    // Zerando todos os valore para caso for chamada a função novamente,não adicionar itens duplicados
    listaDespesasView.innerHTML = ''
    // percorrer o array despesas, listando cada despsa de forma dinâmica

    listaDespesas.forEach(function (itens_despesas) {
        //criando a linha os (tr)
        let linha = listaDespesasView.insertRow()
        // criando as colunas:
        linha.insertCell(0).innerHTML = `${itens_despesas.dia}/${itens_despesas.mes}/${itens_despesas.ano}`
        //ajustar o tipo
        formatandoExibirTipo(itens_despesas)
        linha.insertCell(1).innerHTML = itens_despesas.tipo
        linha.insertCell(2).innerHTML = itens_despesas.descricao
        linha.insertCell(3).innerHTML = itens_despesas.valor

        // criando botão de exclusão
        let btn = document.createElement('button')
        // adicionando estilos no botão
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = `id_despesa_${itens_despesas.id}`
        // adicionando ação no botão
        btn.onclick = function () {
            // remover despesa
            // refatorando a string para que seja passado somente o valor do id
            let id = this.id.replace('id_despesa_', '')
            bd.remover(id)
            chamarModal()
            // Atualizando a página
            
            
        }
        linha.insertCell(4).append(btn)
        console.log(itens_despesas)
    })
    
}

function pesquisarDespesa() {
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    let listaDespesasFiltrada = bd.pesquisar(despesa)

    carregaListaDespesas(listaDespesasFiltrada, true)// O true é usado para identificar que um filtro foi passado
}

function chamarModal() {
        document.getElementById('header_color').className = 'modal-header text-success'
        document.getElementById('btn_color').className = 'btn btn-success'
        document.getElementById('exampleModalLabel').innerHTML = 'Registro Removido'
        document.getElementById('mensagem_modal').innerHTML = 'A exclusão do registro foi feita com sucesso'
        document.getElementById('btn_color').innerHTML = 'Continuar'
    $('#modalConsulta').modal('show')
}
