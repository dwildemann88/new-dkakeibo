let salario = parseFloat(localStorage.getItem("dkakeiboSalario")) || 0;
let objetivo = parseFloat(localStorage.getItem("dkakeiboObjetivo")) || 0;
let janelaAberta = false; // Variável de controle para verificar se há uma janela aberta

// Função para abrir a janela com detalhes do mês
function abrirMes(mes) {
  if (janelaAberta) {
    alert("Feche a janela atual antes de abrir outra.");
    return; // Impede a abertura de novas janelas se já houver uma aberta
  }

  janelaAberta = true; // Marca que uma janela está aberta
  let janelaMes = document.createElement("div");
  janelaMes.classList.add("janela-mes");
  janelaMes.innerHTML = `
    <h2>${mes}</h2>
    <p>Salário Atual: R$ <span id="salario-atual">${salario}</span></p>
    <form id="form-${mes}">
      <label for="descricao">Descrição:</label>
      <input type="text" id="descricao" required>
      <label for="valor">Valor:</label>
      <input type="number" id="valor" required>
      <button type="button" onclick="adicionarGasto('${mes}', true)">Guardar</button>
      <button type="button" onclick="adicionarGasto('${mes}', false)">Descontar</button>
    </form>
    <ul id="lista-${mes}"></ul>
    <button onclick="fecharJanela()">Fechar</button>
  `;
  document.body.appendChild(janelaMes);

  // Carregar despesas guardadas
  carregarGastos(mes);
}

function fecharJanela() {
  document.querySelector(".janela-mes").remove();
  janelaAberta = false; // Libera para abrir novas janelas
}

// Função para adicionar gasto ou valor guardado
function adicionarGasto(mes, isGuardar) {
  const descricao = document.querySelector(`#form-${mes} #descricao`).value;
  const valor = parseFloat(document.querySelector(`#form-${mes} #valor`).value);
  
  if (descricao && !isNaN(valor)) {
    const novoValor = isGuardar ? -valor : -valor; // Ambos diminuem o saldo
    salario += novoValor;
    document.getElementById("salario-atual").innerText = salario;

    const lista = document.getElementById(`lista-${mes}`);
    const item = document.createElement("li");
    item.style.backgroundColor = isGuardar ? "green" : "red";
    item.innerHTML = `${descricao}: R$ ${Math.abs(novoValor)} <button onclick="removerGasto(this, ${novoValor}, '${mes}')">X</button>`;
    lista.appendChild(item);

    // Salvar no localStorage
    let gastosMes = JSON.parse(localStorage.getItem(mes)) || [];
    gastosMes.push({ descricao, valor: novoValor, isGuardar });
    localStorage.setItem(mes, JSON.stringify(gastosMes));

    // Limpar o formulário após adicionar
    document.querySelector(`#form-${mes} #descricao`).value = '';
    document.querySelector(`#form-${mes} #valor`).value = '';
  } else {
    alert("Preencha a descrição e o valor corretamente.");
  }
}

function removerGasto(elemento, valor, mes) {
  const descricao = elemento.parentElement.innerText.split(":")[0];
  salario -= valor;
  document.getElementById("salario-atual").innerText = salario;
  elemento.parentElement.remove();

  let gastosMes = JSON.parse(localStorage.getItem(mes)) || [];
  gastosMes = gastosMes.filter(gasto => gasto.descricao !== descricao || gasto.valor !== valor);
  localStorage.setItem(mes, JSON.stringify(gastosMes));
}

function carregarGastos(mes) {
  const lista = document.getElementById(`lista-${mes}`);
  const gastosMes = JSON.parse(localStorage.getItem(mes)) || [];
  gastosMes.forEach((gasto) => {
    const item = document.createElement("li");
    item.style.backgroundColor = gasto.isGuardar ? "green" : "red";
    item.innerHTML = `${gasto.descricao}: R$ ${Math.abs(gasto.valor)} <button onclick="removerGasto(this, ${gasto.valor}, '${mes}')">X</button>`;
    lista.appendChild(item);
  });
}

// Função para exibir progresso
function exibirProgresso() {
  const progressoContainer = document.createElement("div");
  progressoContainer.classList.add("progresso-container");
  let totalGuardado = 0;

  const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  meses.forEach(mes => {
    const gastosMes = JSON.parse(localStorage.getItem(mes)) || [];
    const guardado = gastosMes.reduce((acc, gasto) => gasto.isGuardar ? acc + Math.abs(gasto.valor) : acc, 0);
    totalGuardado += guardado;
  });

  const progresso = (totalGuardado / objetivo) * 100;
  progressoContainer.innerHTML = `
    <h2>Progresso: ${Math.min(progresso, 100).toFixed(2)}%</h2>
    <p>Total guardado: R$ ${totalGuardado}</p>
    <div class="barra-progresso">
      <div class="progresso" style="width: ${Math.min(progresso, 100)}%;"></div>
    </div>
    <button onclick="fecharProgresso()">Fechar</button>
  `;

  document.body.appendChild(progressoContainer);
}

function fecharProgresso() {
  document.querySelector(".progresso-container").remove();
}

// Atribuir eventos de clique aos meses
document.querySelectorAll(".mouth").forEach(mouth => {
  mouth.addEventListener("click", function() {
    abrirMes(this.querySelector(".mouth-name").innerText);
  });
});

// Evento para o botão de progresso
document.querySelector(".progress").addEventListener("click", exibirProgresso);
