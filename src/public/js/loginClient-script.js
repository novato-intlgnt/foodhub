const logInForm = document.getElementById('formSignIn')
const logUpForm = document.getElementById('formSignUp')

logUpForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  const data = Object.fromEntries(
    new FormData(e.target)
  )
  console.log(data)
  const url = window.location.origin // Domain
  const userValue = data.user_name /// Value of name user
  const nameValue = data.name /// Value of name user
  const lstNameValue = data.last_name /// Value of name user
  const phoneValue = parseInt(data.phone) /// Value of phone user
  const emailValue = data.email // Value of email user
  const passValue = data.pass // Value of password

  const res = await fetch(`${url}/user/client/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      urlhost: url,
      user: userValue,
      name: nameValue,
      lastName: lstNameValue,
      email: emailValue,
      phone: phoneValue,
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

logInForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  const data = Object.fromEntries(
    new FormData(e.target)
  )
  const url = window.location.origin // Domain
  const emailValue = data.email // Value of email user
  const passValue = data.pass // Value of password

  const res = await fetch(`${url}/user/client/signin`, {
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
