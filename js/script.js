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
  fetch(
    `https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=CNY&apikey=4V0TJJQB3286WVE8`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.erro) {
        alert("ERRO!");
      } else {
        let bitcoinLast = Object.keys(
          data["Time Series (Digital Currency Daily)"]
        )[0];
        let ultimoPreco =
          data["Time Series (Digital Currency Daily)"][bitcoinLast][
            "4b. close (USD)"
          ];
        let preçoNumber = Number(ultimoPreco);
        let precoBrl = (preçoNumber * real).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
        resposta.innerHTML = `O preço do bitcoin hoje é: ${precoBrl}`;
        atualizarPreço(precoBrl)
      }
    });
}

function atualizarPreço(precoBrl) {
  let precoBrlBtc = precoBrl;
  const meuGrafico = new Chart(grafico, {
    type: "line",
    data: {
      labels: ["teste"],
      datasets: [
        {
          label: precoBrlBtc,
          data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

