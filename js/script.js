const texto = document.getElementById("itexto");
const buscar = document.getElementById("ibuscar");
const resposta = document.getElementById("iresposta");
const grafico = document.getElementById("grafico").getContext("2d");

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
      }
    });
})();

function buscarBitcoin(real) {
  var precoBrl = real;

  let dias = 7;
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
          precoUsd = (precoUsd * real)
          return precoUsd;
        });

        let tempos = datas.map((date) => new Date(date).toLocaleDateString());

        const chartData = {
          labels: tempos,
          datasets: [
            {
              label: "Preço do Bitcoin",
              data: precosBitcoinBrl,
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
            },
          ],
        };

        // Obtenha o contexto do canvas do gráfico
        const grafico = document.getElementById("grafico").getContext("2d");

        // Crie um novo gráfico de linha com o Chart.js
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
