export function createNavbar() {
  const nav = document.createElement("nav");
  nav.innerHTML = `
    <ul>
      <li>
        <a href="dashboardCli.html"><i class="fi fi-rr-user"></i></a>
        <p>Incio<p>
      </li>
      <li>
         <a href="/"><img src="/assets/images/imgDashCli/contacto.png"></a>
        <p>Contacto</p>
         </li>
      <li>
        <a href="/"><img src="/assets/images/imgDashCli/salida.png"></a>
        <p>Salida</p>
      </li>
    </ul>
  `;
  return nav;
}
