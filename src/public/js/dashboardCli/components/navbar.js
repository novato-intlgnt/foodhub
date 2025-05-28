export function createNavbar() {
  const nav = document.createElement("nav");
  nav.innerHTML = `
    <ul>
      <li>
        <a href="dashboardCli.html"><i class="fi fi-rr-user"></i></a>
        <p>Incio<p>
      </li>
      <li>
         <a href="js/dashboardCli/pages/contacto.html"><i class="fi fi-rr-phone-call"></i></a>
        <p>Contacto</p>
         </li>
      <li style="a">
        <a href="index.html"><i class="fi fi-bs-exit"></i></a>
        <p>Salida</p>
      </li>
    </ul>
  `;
  return nav;
}
