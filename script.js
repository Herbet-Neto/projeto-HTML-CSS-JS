function adicionarTarefa() {

    //recebe valor do input do usuário
    const inputTarefa = document.getElementById("inputTarefa")
    let tarefa = inputTarefa.value.trim()

    const mensagem = document.getElementById("mensagem")
    const inputImagem = document.getElementById("inputImagem")

    if (tarefa == "") {
        let mensagemErro = "Digite uma tarefa para adicioná-la a sua lista!"
        mensagem.textContent = mensagemErro
        mensagem.style.color = "red"
    } else if(tarefa.length < 5) {
        let mensagemErro = "Digite no mínimo 5 caracteres!"
        mensagem.textContent = mensagemErro;
        mensagem.style.color = "red"
    } else {
        let mensagemSucesso = "Tarefa adicionada com sucesso!"
        mensagem.textContent = mensagemSucesso
        mensagem.style.color = "green"

        const listaTarefas = document.getElementById("listaTarefas")
        let novaTarefa = document.createElement("li")
        novaTarefa.draggable = true

        const imagem = document.createElement("img")
        imagem.className = "imagem-tarefa"
        if (inputImagem.files.length > 0) {
            const arquivo = inputImagem.files[0]
            const url = URL.createObjectURL(arquivo)
            imagem.src = url
        }

        const textoTarefa = document.createElement("span")
        textoTarefa.textContent = tarefa

        novaTarefa.appendChild(imagem)
        novaTarefa.appendChild(textoTarefa)

        const botaoEditar = document.createElement('button')
        botaoEditar.textContent = "Editar"
        botaoEditar.className = "botao-editar"
        botaoEditar.onclick = function () {
            let novoTexto = prompt("Edite a tarefa:", textoTarefa.textContent)
            if (novoTexto && novoTexto.trim().length >= 5) {
                textoTarefa.textContent = novoTexto.trim()
                mensagem.textContent = "Tarefa editada!"
                mensagem.style.color = "blue"
            }
            let trocarImagem = confirm("Deseja alterar a imagem?")
            if (trocarImagem) {
                let novoInput = document.createElement("input")
                novoInput.type = "file"
                novoInput.accept = "image/png"
                novoInput.onchange = function () {
                    if (novoInput.files.length > 0) {
                        const novoArquivo = novoInput.files[0]
                        const novaUrl = URL.createObjectURL(novoArquivo)
                        imagem.src = novaUrl
                        mensagem.textContent = "Imagem alterada!"
                        mensagem.style.color = "blue"
                    }
                }
                novoInput.click()
            }
        }
        novaTarefa.appendChild(botaoEditar)

        const botaoRemoverImagem = document.createElement('button')
        botaoRemoverImagem.textContent = "Remover Img"
        botaoRemoverImagem.className = "botao-editar"
        botaoRemoverImagem.onclick = function () {
            imagem.remove()
            mensagem.textContent = "Imagem removida!"
            mensagem.style.color = "black"
        }
        novaTarefa.appendChild(botaoRemoverImagem)

        const botaoExcluir = document.createElement('button');
        botaoExcluir.textContent = "Excluir";
        botaoExcluir.className = "botao-excluir";
        botaoExcluir.onclick = function () {
            novaTarefa.remove();
            mensagem.textContent = "Tarefa removida!"
            mensagem.style.color = "black"
        };
        novaTarefa.appendChild(botaoExcluir)

        listaTarefas.appendChild(novaTarefa)

        adicionarArrastarSoltar()
    }

    inputTarefa.value = ""
    inputImagem.value = ""
}

function adicionarArrastarSoltar() {
    const lista = document.getElementById("listaTarefas")
    const itens = lista.querySelectorAll("li")

    itens.forEach(item => {
        item.addEventListener("dragstart", () => {
            item.classList.add("dragging")
        })
        item.addEventListener("dragend", () => {
            item.classList.remove("dragging")
        })
    })

    lista.addEventListener("dragover", e => {
        e.preventDefault()
        const elementoArrastado = document.querySelector(".dragging")
        const depoisDe = getElementoDepois(lista, e.clientY)
        if (depoisDe == null) {
            lista.appendChild(elementoArrastado)
        } else {
            lista.insertBefore(elementoArrastado, depoisDe)
        }
    })
}

function getElementoDepois(lista, y) {
    const elementos = [...lista.querySelectorAll("li:not(.dragging)")]
    return elementos.reduce((maisProximo, child) => {
        const box = child.getBoundingClientRect()
        const offset = y - box.top - box.height / 2
        if (offset < 0 && offset > maisProximo.offset) {
            return { offset: offset, element: child }
        } else {
            return maisProximo
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element
}
