let objetivo = parseFloat(localStorage.getItem("dkakeiboObjetivo")) || 0;
let janelaAberta = false; // Variável para controle de janelas

// Função para abrir a janela com detalhes do mês
function abrirMes(mes) {
  if (janelaAberta) {
    alert("Feche a janela atual antes de abrir outra.");
    return; // Impede a abertura de novas janelas se já houver uma aberta
  }

  janelaAberta = true; // Marca que a janela está aberta

  // Carrega o salário do mês atual
  let salario = parseFloat(localStorage.getItem(`dkakeiboSalario_${mes}`)) || parseFloat(localStorage.getItem("dkakeiboSalario")) || 0;

  let janelaMes = document.createElement("div");
  janelaMes.classList.add("janela-mes");
  janelaMes.innerHTML = `
    <h2>${mes}</h2>
    <p>Salário Atual: R$ <span id="salario-atual">${salario.toFixed(2)}</span></p>
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

// Fecha a janela
function fecharJanela() {
  document.querySelector(".janela-mes").remove();
  janelaAberta = false; // Marca que a janela foi fechada
}

// Função para adicionar gasto ou valor guardado
function adicionarGasto(mes, isGuardar) {
  const descricao = document.querySelector(`#form-${mes} #descricao`).value;
  const valor = parseFloat(document.querySelector(`#form-${mes} #valor`).value);
  
  if (descricao && !isNaN(valor)) {
    // Carrega o salário do mês atual
    let salario = parseFloat(localStorage.getItem(`dkakeiboSalario_${mes}`)) || parseFloat(localStorage.getItem("dkakeiboSalario")) || 0;

    const novoValor = isGuardar ? -valor : valor; // Guardar é negativo, despesa é positivo
    salario += novoValor; // Atualiza o salário do mês específico
    localStorage.setItem(`dkakeiboSalario_${mes}`, salario); // Armazena o novo salário
    document.getElementById("salario-atual").innerText = salario.toFixed(2); // Atualiza o valor exibido no DOM

    const lista = document.getElementById(`lista-${mes}`);
    const item = document.createElement("li");
    item.style.backgroundColor = isGuardar ? "green" : "red"; // Fundo verde para guardado, vermelho para despesa
    item.innerHTML = `${descricao}: R$ ${Math.abs(valor).toFixed(2)} <button onclick="removerGasto(this, ${novoValor}, '${mes}')">X</button>`;
    lista.appendChild(item);

    // Salvar no localStorage
    let gastosMes = JSON.parse(localStorage.getItem(mes)) || [];
    gastosMes.push({ descricao, valor: novoValor });
    localStorage.setItem(mes, JSON.stringify(gastosMes));

    // Limpar o formulário após adicionar
    document.querySelector(`#form-${mes} #descricao`).value = '';
    document.querySelector(`#form-${mes} #valor`).value = '';
  } else {
    alert("Preencha a descrição e o valor corretamente.");
  }
}

// Função para remover um gasto
function removerGasto(elemento, valor, mes) {
  const descricao = elemento.parentElement.innerText.split(":")[0]; // Pega a descrição do item
  // Carrega o salário do mês atual
  let salario = parseFloat(localStorage.getItem(`dkakeiboSalario_${mes}`)) || parseFloat(localStorage.getItem("dkakeiboSalario")) || 0;

  salario -= valor; // Atualiza o salário
  localStorage.setItem(`dkakeiboSalario_${mes}`, salario); // Armazena o novo salário
  document.getElementById("salario-atual").innerText = salario.toFixed(2); // Atualiza o valor no DOM
  elemento.parentElement.remove(); // Remove o item do DOM

  // Remover o item do Local Storage
  let gastosMes = JSON.parse(localStorage.getItem(mes)) || [];
  gastosMes = gastosMes.filter(gasto => !(gasto.descricao === descricao && gasto.valor === valor));
  localStorage.setItem(mes, JSON.stringify(gastosMes)); // Atualiza o Local Storage
}

// Função para carregar os gastos de um mês
function carregarGastos(mes) {
  const lista = document.getElementById(`lista-${mes}`);
  const gastosMes = JSON.parse(localStorage.getItem(mes)) || [];
  
  gastosMes.forEach((gasto) => {
    const item = document.createElement("li");
    item.style.backgroundColor = gasto.valor < 0 ? "green" : "red"; // Fundo verde para guardado, vermelho para despesa
    item.innerHTML = `${gasto.descricao}: R$ ${Math.abs(gasto.valor).toFixed(2)} <button onclick="removerGasto(this, ${gasto.valor}, '${mes}')">X</button>`;
    lista.appendChild(item);
  });

  // Atualiza o salário após carregar os gastos
  let salario = parseFloat(localStorage.getItem(`dkakeiboSalario_${mes}`)) || parseFloat(localStorage.getItem("dkakeiboSalario")) || 0;
  document.getElementById("salario-atual").innerText = salario.toFixed(2); // Exibe o salário atualizado
}

// Atribuir eventos de clique aos meses
document.querySelectorAll(".mouth").forEach(mouth => {
  mouth.addEventListener("click", function() {
    abrirMes(this.querySelector(".mouth-name").innerText);
  });
});
