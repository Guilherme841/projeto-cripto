const texto = document.getElementById("itexto");
const buscar = document.getElementById("ibuscar");
const resposta = document.getElementById("iresposta");

function buscarBrl() {
  fetch(
    `https://api.bcb.gov.br/dados/serie/bcdata.sgs.10813/dados/ultimos/1?formato=json`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.erro) {
        alert("ERRO");
      } else {
        const real = data[0].valor;
        buscarBitcoin(real);
      }
    });
}

function buscarBitcoin(real) {
  fetch(
    `https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=CNY&apikey=4V0TJJQB3286WVE8`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.erro) {
        alert("ERRO!");
      } else {
        const bitcoinLast = Object.keys(
          data["Time Series (Digital Currency Daily)"]
        )[0];
        const ultimoPreco =
          data["Time Series (Digital Currency Daily)"][bitcoinLast][
            "4b. close (USD)"
          ];
        const preçoNumber = Number(ultimoPreco);
        const precoBrl = (preçoNumber * real).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
        resposta.innerHTML = `O preço do bitcoin hoje é: ${precoBrl}`;
      }
    });
}

buscar.addEventListener("click", function () {
  buscarBrl();
});