const grafico = document.getElementById("grafico").getContext("2d");
const preçoBtc = document.getElementById("preçoBtc");
const moeda = document.getElementById("moeda");

let dadosFetch;
let tipoDeMoeda = moeda.value;
let dias = 5;

(function () {
  fetch(
    `https://api.bcb.gov.br/dados/serie/bcdata.sgs.10813/dados/ultimos/1?formato=json`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.erro) {
        alert("ERRO");
      } else {
        let real = data[0].valor;
        buscarBitcoin(real);
        trocarMoeda(real);
      }
    });
  fetch(
    `https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=CNY&apikey=4V0TJJQB3286WVE8`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.erro) {
        alert("ERRO");
      } else {
        dadosFetch = data;
      }
    });
})();

function trocarMoeda(real) {
  precoBrl = real;
  tipoDeMoeda = moeda.value;
  fetch(
    `https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=CNY&apikey=4V0TJJQB3286WVE8`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.erro) {
        alert("ERRO");
      } else {
        let datas = Object.keys(
          data["Time Series (Digital Currency Daily)"]
        ).slice(0, dias);
        let precos = datas.map(
          (date) =>
            data["Time Series (Digital Currency Daily)"][date][
              "4b. close (USD)"
            ]
        );

        let precosBitcoinBrl = precos.map((precoUsd) => {
          precoUsd = precoUsd * precoBrl;
          return precoUsd;
        });

        let preçoDoDiaBrl = precosBitcoinBrl[0];
        let preçoDoDiaBrlCon = preçoDoDiaBrl.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });

        let preçoDoDiaUsd = precos[0];
        let preçoDoDiaUsdCon = preçoDoDiaUsd.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        });

        let moedaBtc;

        if (tipoDeMoeda.value === "BRL") {
          moedaBtc = preçoDoDiaBrlCon;
        } else {
          moedaBtc = preçoDoDiaUsdCon;
        }
        moeda.innerHTML = `${moedaBtc}`;
      }
    });
}

function buscarBitcoin(real) {
  precoBrl = real;
  fetch(
    `https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=CNY&apikey=4V0TJJQB3286WVE8`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.erro) {
        alert("ERRO");
      } else {
        let datas = Object.keys(
          data["Time Series (Digital Currency Daily)"]
        ).slice(0, dias);
        let precos = datas.map(
          (date) =>
            data["Time Series (Digital Currency Daily)"][date][
              "4b. close (USD)"
            ]
        );

        let precosBitcoinBrl = precos.map((precoUsd) => {
          precoUsd = precoUsd * precoBrl;
          return precoUsd;
        });

        let preçoDoDiaBrl = precosBitcoinBrl[0];
        let preçoDoDiaBrlCon = preçoDoDiaBrl.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });

        const chartData = {
          labels: datas,
          datasets: [
            {
              label: "Preço do Bitcoin em BRL",
              data: precosBitcoinBrl,
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 3,
              pointRadius: 6,
            },
          ],
        };
        const grafico = document.getElementById("grafico").getContext("2d");
        Chart.defaults.font.size = 12;
        const meuGrafico = new Chart(grafico, {
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
    });
}
