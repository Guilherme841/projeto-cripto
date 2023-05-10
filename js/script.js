const grafico = document.getElementById("grafico").getContext("2d");
const preçoBtc = document.getElementById("preçoBtc");
const moeda = document.getElementById("moeda");

let dadosFetch;
let tipoDeMoeda = moeda.value;
let dias = 5;
let real;
let preçoDoDiaBrlCon;
let preçoDoDiaUsdCon;
let bitcoin;
let datas;
let precos;
let meuGrafico;
let precosBitcoinBrl;

function criarGrafico() {
  const chartData = {
    labels: datas,
    datasets: [
      {
        label: "Preço do Bitcoin em BRL",
        data: bitcoin,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 3,
        pointRadius: 6,
      },
    ],
  };
  const grafico = document.getElementById("grafico").getContext("2d");
  Chart.defaults.font.size = 12;
  meuGrafico = new Chart(grafico, {
    type: "line",
    data: chartData,
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

(async function () {
  fetch(
    `https://api.bcb.gov.br/dados/serie/bcdata.sgs.10813/dados/ultimos/1?formato=json`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.erro) {
        alert("ERRO");
      } else {
        real = data[0].valor;
      }
    });

  const response = await fetch(
    "https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=CNY&apikey=4V0TJJQB3286WVE8"
  );
  const data = await response.json();

  if (data.erro) {
    alert("ERRO");
  } else {
    dadosFetch = data;
    // buscarBitcoin();
    // trocarMoeda();

    datas = Object.keys(data["Time Series (Digital Currency Daily)"]).slice(
      0,
      dias
    );
    precos = datas.map(
      (date) =>
        data["Time Series (Digital Currency Daily)"][date]["4b. close (USD)"]
    );

    precosBitcoinBrl = precos.map((precoUsd) => {
      precoUsd = precoUsd * real;
      return precoUsd;
    });

    let preçoDoDiaBrl = precosBitcoinBrl[0];
    preçoDoDiaBrlCon = preçoDoDiaBrl.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    let preçoDoDiaUsd = precos[0];
    let preçoDoDiaUsdNum = Number(preçoDoDiaUsd);
    preçoDoDiaUsdCon = preçoDoDiaUsdNum.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
    bitcoin = precosBitcoinBrl;
    criarGrafico();
    preçoBtc.innerHTML = `${preçoDoDiaBrlCon}`;
  }
})();

function trocarMoeda() {
  tipoDeMoeda = moeda.value;
  if (tipoDeMoeda === "BRL") {
    bitcoin = precosBitcoinBrl;
    preçoBtc.innerHTML = `${preçoDoDiaBrlCon}`;
    meuGrafico.data.datasets[0].data = bitcoin;
    meuGrafico.data.datasets[0].label = 'Preço do Bitcoin em BRL';
    meuGrafico.update();
  } else if (tipoDeMoeda === "USD") {
    preçoBtc.innerHTML = `${preçoDoDiaUsdCon}`;
    bitcoin = precos;
    meuGrafico.data.datasets[0].data = bitcoin;
    meuGrafico.data.datasets[0].label = 'Preço do Bitcoin em USD';
    meuGrafico.update();
  }
}
