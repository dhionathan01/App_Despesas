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
}

let bd = new Bd()

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
        // dialog de sucesso
        $('#sucessoGravacao').modal('show')
    } else {
        // dialog de erro
        $('#erroGravacao').modal('show')
    }

   
}