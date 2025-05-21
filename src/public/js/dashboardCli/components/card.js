export function createCard() {
  const card = document.createElement("div");
  card.className = "carta";
  card.innerHTML = `
    <img src="/assets/images/imgDashCli/broster.jpg" style="width:100%">
    <div class="info-comida">
        <h1 style="text-align: center">Pollo broster</h1>
        <p >Pollo servido con papas y cremas </p>
        <p>s /.11.00 </p>
        <button class="estado-pedido">dame</button>
    </div>
  `;
  return card;
}
