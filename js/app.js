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

            listaDespesa.push(despesa)
        }
        console.log(listaDespesa)
        return listaDespesa
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
        //bd.gravarDados(despesa)
        configurarModal('sucess')
        // dialog de sucesso
        $('#modalRegistraDespesa').modal('show')
    } else {
        configurarModal('falha')
        // dialog de erro
        $('#modalRegistraDespesa').modal('show')
    }  
}

function carregaListaDespesas() {
    let listaDespesa = Array()
    listaDespesa = bd.recuperarTodosRegistros()
    console.log(listaDespesa)
}