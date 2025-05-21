const listSongs = document.getElementById('list-songs')
const explorerForm = document.getElementById('form-explorer')
explorerForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  const data = Object.fromEntries(
    new FormData(e.target)
  )
  const url = window.location.origin // Domain

  // Values of form
  const artistValue = data.artistNet
  const songValue = data.songNet

  const res = await fetch(`${url}/song/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      urlhost: url,
      song: songValue,
      artist: artistValue
    })
  })

  const result = await res.json()
  const dataSong = result.data
  if (!res.ok) {
    return Swal.fire({
      icon: result.status,
      title: result.message
    })
  }
  listSongs.innerHTML = `
      ${dataSong.map(song => `
        <li class="items-songs">
          <img class="img-song" src="${song.result.song_art_image_thumbnail_url}" alt="${song.result.title}">
          <h3>${song.result.title}</h3>
          <div class="container-artist">
<img class="img-artist" src="${song.result.primary_artist.image_url}" alt="${song.result.primary_artist.name}">
            <p>${song.result.primary_artist.name}</p>
          </div>
          <button class="submit-song" data-id="${song.result.id}">get lyrics</button>
        </li>
      `)
      .join('')}
  `
})

listSongs.addEventListener('click', async (e) => {
  const clickedElement = e.target
  const url = window.location.origin // Domain
  const songId = clickedElement.getAttribute('data-id')

  const res = await fetch(`${url}/song/lyric/${songId}`, {
    method: 'POST'
  })
  const result = await res.json()
  if (!res.ok) {
    return Swal.fire({
      icon: result.status,
      title: result.message
    })
  } else {
    const btnLibrary = document.getElementById('btn-library')
    const userGallery = document.getElementById('user-gallery')

    btnLibrary.addEventListener('click', async function () {
      const res = await fetch(`${url}/song`, {
        method: 'GET'
      })

      const result = await res.json()
      const songData = result.data
      if (!res.ok) {
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
          <iframe src="${song.video_song}"></iframe>
        </li>
      `)
      .join('')}
  `
      const selector = document.querySelector('#user-gallery')
      const dg = new DataGallery(selector)
      dg.parse()
    })
    return Swal.fire({
      icon: result.status,
      title: result.message
    })
  }
})
