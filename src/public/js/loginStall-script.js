const signInBtn = document.querySelector('#sign-in-btn')
const signUpBtn = document.querySelector('#sign-up-btn')
const container = document.querySelector('.container')
const select = document.getElementById("area");
const icon = document.getElementById("i-area");


signUpBtn.addEventListener('click', () => {
  container.classList.add('sign-up-mode')
})

signInBtn.addEventListener('click', () => {
  container.classList.remove('sign-up-mode')
})
select.addEventListener("change", () => {
  const value = select.value;

  switch (value) {
    case "engineer":
      icon.className = "fi fi-rr-settings";
      break;
    case "social":
      icon.className = "fi fi-rr-head-side-brain";
      break;
    case "biomedical":
      icon.className = "fi fi-rr-dna";
      break;
    default:
      icon.className = "fi fi-rr-school";
  }
});
const btnSignUp = document.getElementById('btn-signup')
btnSignUp.addEventListener('submit', async (e) => {
  e.preventDefault()
  const data = Object.fromEntries(
    new FormData(e.target)
  )
  console.log(data)
  const url = window.location.origin // Domain
  const userValue = data.username /// Value of name stall
  const emailValue = data.email // Value of email stall
  const phoneValue = parseInt(data.phone) // Value of phone stall
  const nmroIdValue = data.nmro // Value of nmroID stall
  const areaValue = data.area // Value of area stall
  const placeValue = data.place // Value of place stall
  const passValue = data.pass // Value of password

  const res = await fetch(`${url}/user/stall/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      urlhost: url,
      user: userValue,
      email: emailValue,
      phone: phoneValue,
      stallId: nmroIdValue,
      area: areaValue,
      place: placeValue,
      pass: passValue
    })
  })
  const dataUp = await res.json()
  if (!res.ok) {
    return Swal.fire({
      icon: dataUp.status,
      title: dataUp.message
    })
  }
  return Swal.fire({
    icon: dataUp.status,
    title: dataUp.message
  })
})

const btnSignIn = document.getElementById('btn-singin')
btnSignIn.addEventListener('submit', async (e) => {
  e.preventDefault()
  const data = Object.fromEntries(
    new FormData(e.target)
  )
  const url = window.location.origin // Domain
  const emailValue = data.email // Value of email user
  const passValue = data.Password// Value of password

  const res = await fetch(`${url}/user/stall/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      urlhost: url,
      email: emailValue,
      pass: passValue
    })
  })
  const dataIn = await res.json()
  if (!res.ok) {
    return Swal.fire({
      icon: dataIn.status,
      title: dataIn.message
    })
  }
  if (dataIn.redirect) {
    window.location.href = dataIn.redirect
  }
})
