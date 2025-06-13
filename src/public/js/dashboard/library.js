document.addEventListener('DOMContentLoaded', async function () {
  const userGallery = document.getElementById('user-gallery')
  const url = window.location.origin

  const res = await fetch(`${url}/stall/products/`, {
    method: 'GET'
  })

})
