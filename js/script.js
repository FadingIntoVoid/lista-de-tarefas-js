let tarefas = [];
let filtroAtual = "todas";

function criarTarefa(texto) {
    return {
        id: Date.now(),
        texto: texto,
        concluida: false
    };
}

function obterTarefasFiltradas() {
    if (filtroAtual === "pendentes") {
        return tarefas.filter(t => !t.concluida);
    }

    if (filtroAtual === "concluidas") {
        return tarefas.filter(t => t.concluida);
    }

    return tarefas;
}

function criarElementoTarefa(tarefa) {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = tarefa.texto;

    if (tarefa.concluida) {
        span.classList.add("concluida");
    }

    span.addEventListener("click", () => {
        tarefa.concluida = !tarefa.concluida;
        salvarTarefas();
        renderizarTarefas();
    });

    const botaoRemover = document.createElement("button");
    botaoRemover.textContent = "Remover";

    botaoRemover.addEventListener("click", (e) => {
        e.stopPropagation();
        removerTarefa(tarefa.id);
    });

    li.appendChild(span);
    li.appendChild(botaoRemover);

    return li;
}

function removerTarefa(id) {
    tarefas = tarefas.filter(t => t.id !== id);
    salvarTarefas();
    renderizarTarefas();
}

function renderizarTarefas() {
    const lista = document.getElementById("lista");
    lista.innerHTML = "";

    atualizarFiltroAtivo();

    const tarefasFiltradas = obterTarefasFiltradas();

    tarefasFiltradas.forEach(tarefa => {
        const li = criarElementoTarefa(tarefa);
        lista.appendChild(li);
    });
}

function atualizarFiltroAtivo() {
    document.querySelectorAll(".filtros button")
        .forEach(btn => btn.classList.remove("ativo"));

    document
        .getElementById(`filtro${capitalizar(filtroAtual)}`)
        .classList.add("ativo");
}

function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

const input = document.getElementById("inputTarefa");
const botaoAdicionar = document.getElementById("btnAdicionar");

botaoAdicionar.addEventListener("click", () => {
    const texto = input.value.trim();

    if (texto === "") {
        alert("Insira uma tarefa");
        return;
    }

    const novaTarefa = criarTarefa(texto);
    tarefas.push(novaTarefa);
    salvarTarefas();
    renderizarTarefas();
    input.value = "";
});

document.getElementById("filtroTodas").addEventListener("click", () => {
    filtroAtual = "todas";
    renderizarTarefas();
});

document.getElementById("filtroPendentes").addEventListener("click", () => {
    filtroAtual = "pendentes";
    renderizarTarefas();
});

document.getElementById("filtroConcluidas").addEventListener("click", () => {
    filtroAtual = "concluidas";
    renderizarTarefas();
});

function salvarTarefas() {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function carregarTarefas() {
    const dados = localStorage.getItem("tarefas");

    if (dados) {
        tarefas = JSON.parse(dados);
        renderizarTarefas();
    }
}

carregarTarefas();