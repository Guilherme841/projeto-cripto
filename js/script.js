const texto = document.getElementById("itexto");
const buscar = document.getElementById("ibuscar");
const resposta = document.getElementById("iresposta");

buscar.addEventListener("click", function () {
  const textoBuscado = texto.value;

  fetch(
    `https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=CNY&apikey=4V0TJJQB3286WVE8`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.erro) {
        alert("ERRO!");
      } else {
        const precoHoje =
          data["Time Series (Digital Currency Daily)"]["2023-04-26"][
            "4b. close (USD)"
          ];
        resposta.innerHTML = `O preço do bitcoin hoje é: ${precoHoje}`
      }
    });
});
