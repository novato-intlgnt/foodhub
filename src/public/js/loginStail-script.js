const signInBtn = document.querySelector('#sign-in-btn')
const signUpBtn = document.querySelector('#sign-up-btn')
const container = document.querySelector('.container')

signUpBtn.addEventListener('click', () => {
  container.classList.add('sign-up-mode')
})

signInBtn.addEventListener('click', () => {
  container.classList.remove('sign-up-mode')
})

const btnSignUp = document.getElementById('btn-signup')
btnSignUp.addEventListener('submit', async (e) => {
  e.preventDefault()
  const data = Object.fromEntries(
    new FormData(e.target)
  )
  const url = window.location.origin // Domain
  const userValue = data.username /// Value of name user
  const emailValue = data.email // Value of email user
  const passValue = data.pass // Value of password

  const res = await fetch(`${url}/user/stail/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      urlhost: url,
      user: userValue,
      email: emailValue,
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

  const res = await fetch(`${url}/user/stail/signin`, {
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
