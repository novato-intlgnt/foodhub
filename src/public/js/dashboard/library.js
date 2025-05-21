document.addEventListener('DOMContentLoaded', async function () {
  const userGallery = document.getElementById('user-gallery')
  const url = window.location.origin

  const res = await fetch(`${url}/song`, {
    method: 'GET'
  })

  const result = await res.json()
  const songData = result.data
  if (result.status === 'warning') {
    return Swal.fire({
      icon: result.status,
      title: result.message
    })
  }

  userGallery.innerHTML = `
      ${songData.map(song => `
        <li class="song-card" song-id="${song.id_api}">
          <img src="${song.img_thumbnail_url}" alt="Song Image" class="song-img">
          <h3 class="song-title">${song.title_song}</h3>
          <img src="${song.img_artist}" alt="Artist Image" class="artist-img" style="width: 25px; height: 25px; border-radius: 50%;">
          <span class="artist-name">${song.name_artist}</span>
        </li>
      `)
      .join('')}
`
})
