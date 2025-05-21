class DataGallery {
  element
  items
  copyItems
  selected
  pagination
  numberOfEntries

  constructor (selector) {
    this.element = selector

    this.items = []
    this.pagination = {
      total: 0,
      noItemsPerPage: 0,
      noPages: 0,
      current: 0,
      pointer: 0,
      diff: 0,
      lastPageBeforeDots: 0,
      noButtonsBeforeDots: 0
    }
    this.selected = []
    this.numberOfEntries = ''
  }

  async parse () {
    await this.waitForElement()
    const list = [...this.element.children]
    list.forEach(list => {
      const idApi = list.getAttribute('song-id')
      const imgElement = [...list.children][0]
      const img = imgElement.getAttribute('src')
      const titleElement = [...list.children][1]
      const title = titleElement.textContent
      const imgArtistElement = [...list.children][2]
      const imgArtist = imgArtistElement.getAttribute('src')
      const artistNameElement = [...list.children][3]
      const artistName = artistNameElement.textContent

      const item = {
        id: this.generateUUID(),
        values: []
      }
      const valuesObj = {}
      valuesObj.id_api = idApi
      valuesObj.title_song = title
      valuesObj.img_thumbnail_url = img
      valuesObj.name_artist = artistName
      valuesObj.img_artist = imgArtist

      item.values.push(valuesObj)
      this.items.push(item)
    })

    this.numberOfEntries = this.itemsPerPage(list)
    this.makeGallery(parseInt(this.numberOfEntries))
  }

  makeGallery (entries) {
    this.copyItems = [...this.items]

    this.initPagination(this.items.length, entries)

    const container = document.createElement('ul')
    container.id = this.element.id
    container.className = this.element.className
    this.element.innerHTML = ''
    this.element.replaceWith(container)
    this.element = container

    this.renderLi()
    this.renderButtons()
    this.renderPages()
    this.renderSearch()
  }

  initPagination (total, entries) {
    this.pagination.total = total
    this.pagination.noItemsPerPage = entries
    this.pagination.noPages = Math.ceil(this.pagination.total / this.pagination.noItemsPerPage)
    this.pagination.current = 1
    this.pagination.pointer = 0
    this.pagination.diff = this.pagination.noItemsPerPage - (this.pagination.total % this.pagination.noItemsPerPage)
  }

  generateUUID () {
    return crypto.randomUUID()
  }

  waitForElement () {
    return new Promise((resolve) => {
      const checkElement = () => {
        if (this.element && this.element.children.length > 0) {
          resolve()
        } else {
          setTimeout(checkElement, 100)
        }
      }

      checkElement()
    })
  }

  itemsPerPage (element) {
    const sampleElement = element[0]
    const sampleElementWidth = sampleElement.offsetWidth
    const sampleElementHeight = sampleElement.offsetHeight

    const gallery = document.querySelector('.gallery')
    const windowWidth = gallery.clientWidth
    const itemsPerRow = Math.floor(windowWidth / sampleElementWidth)
    const itemsPerPage = Math.floor(window.innerHeight / sampleElementHeight) * itemsPerRow
    return itemsPerPage
  }

  renderLi () {
    this.element.innerHTML = ''
    let i = 0
    const { pointer, total } = this.pagination
    const limit = this.pagination.current * this.pagination.noItemsPerPage

    for (i = pointer; i < limit; i++) {
      if (i === total) break
      const { id, values } = this.copyItems[i]
      const checked = this.isChecked(id)

      let data = ''
      values.forEach(song => {
        data += `
          <li id="${id}" song-id="${song.id_api}" class="song-card">
            <div class="checkbox-container"><input type="checkbox" class="check-input" ${checked ? 'checked' : '""'}></div>
            <div class="menu-opt" song-id="${song.id_api}">
                <button class="btn-tool delete"><i class="fi fi-rr-trash"></i></button>
            </div>
            <button class="btn-opt" ><i class="fi fi-br-menu-dots-vertical"></i></button>
            <img src="${song.img_thumbnail_url}" alt="Song Image" class="song-img">
            <div class="song-details">
              <h3 class="song-title">${song.title_song}</h3>
              <div class="artist-info">
                <img src="${song.img_artist}" alt="Artist Image" class="artist-img" style="width: 25px; height: 25px; border-radius: 50%;">
                <span class="artist-name">${song.name_artist}</span>
              </div>
            </div>
            <button song-id="${song.id_api}" class="btn-song">view</button>
          </li>
        `
      })
      this.element.innerHTML += `${data}`
    }
    document.querySelectorAll('.check-input').forEach(checkbox => {
      checkbox.addEventListener('click', e => {
        const element = e.target
        const id = element.parentElement.parentElement.id

        if (element.checked) {
          const item = this.getItem(id)
          this.selected.push(item)
        } else {
          this.removeSelected(id)
        }
      })
    })

    this.renderDeleted()
  }

  renderPages () {
    const pageUl = document.querySelector('.pages')
    let pages = ''

    const buttonsToShow = this.pagination.noButtonsBeforeDots
    const currentIndex = this.pagination.current

    let limI = Math.max(currentIndex - 2, 1)
    let limS = Math.min(currentIndex + 2, this.pagination.noPages)

    const missingButtons = buttonsToShow - (limI - limS)

    if (Math.max(limI - missingButtons, 0)) {
      limI = limI - missingButtons
    } else if (Math.min(limS + missingButtons, this.pagination.noPages) !== this.pagination.noPages) {
      limS = limS + missingButtons
    }

    if (limS < (this.pagination.noPages - 2)) {
      pages += this.getIteratedButtons(limI, limS)
      pages += '<li><span class="more">...</span></li>'
      pages += this.getIteratedButtons(this.pagination.noPages - 1, this.pagination.noPages)
    } else {
      pages += this.getIteratedButtons(limI, this.pagination.noPages)
    }

    pageUl.innerHTML = `<ul class="pages-list">${pages}</ul>`
    const containerPageBtn = document.querySelectorAll('.pages .pages-list li button')
    containerPageBtn.forEach(button => {
      button.addEventListener('click', e => {
        this.pagination.current = parseInt(e.target.getAttribute('data-page'))
        this.pagination.pointer = (this.pagination.current * this.pagination.noItemsPerPage) - this.pagination.noItemsPerPage
        this.renderLi()
        this.renderButtons()
        this.renderPages()
      })
    })
  }

  renderSearch () {
    const contaienrSearch = document.querySelector('.input-search')
    contaienrSearch.addEventListener('input', e => {
      const query = e.target.value.trim().toLowerCase()

      if (query === '') {
        this.copyItems = [...this.items]
        this.initPagination(this.copyItems.length, parseInt(this.numberOfEntries))
        this.renderLi()
        this.renderButtons()
        this.renderPages()
        return
      }

      this.search(query)

      this.initPagination(this.copyItems.length, parseInt(this.numberOfEntries))
      this.renderLi()
      this.renderButtons()
      this.renderPages()
    })
  }

  search (query) {
    const res = []

    this.copyItems = [...this.items]

    for (let i = 0; i < this.copyItems.length; i++) {
      const { values } = this.copyItems[i]

      for (let j = 0; j < values.length; j++) {
        const data = values[j]

        if (data.title_song.toLowerCase().indexOf(query) >= 0) {
          res.push(this.copyItems[i])
          break
        }
        if (data.name_artist.toLowerCase().indexOf(query) >= 0) {
          res.push(this.copyItems[i])
          break
        }
      }
    }
    this.copyItems = [...res]
  }

  renderButtons () {
    const btnOptList = this.element.querySelectorAll('.btn-opt')
    const btnSelect = document.querySelector('.select-btn')
    const btnCancel = document.querySelector('#cancel-btn')
    const allSelectBtn = this.element.querySelectorAll('.checkbox-container')
    const containerActions = document.querySelector('.actions-container')

    if (this.items.length > 0) {
      btnSelect.classList.add('open')
    } else {
      btnSelect.classList.remove('open')
    }

    btnOptList.forEach(btnOpt => {
      btnOpt.addEventListener('click', () => {
        const allMenuList = this.element.querySelectorAll('.menu-opt')

        allMenuList.forEach(menuOpt => {
          if (menuOpt.classList.contains('open') && menuOpt !== btnOpt.previousElementSibling) {
            menuOpt.classList.remove('open')
          }
        })

        const menuOpt = btnOpt.previousElementSibling

        if (!menuOpt.classList.contains('open')) {
          menuOpt.classList.add('open')
        } else {
          menuOpt.classList.remove('open')
        }
      })
    })

    if (btnSelect.classList.contains('active')) {
      containerActions.classList.add('open')
      allSelectBtn.forEach(selectBtn => {
        selectBtn.classList.add('open')
      })
    }

    btnSelect.addEventListener('click', () => {
      btnSelect.classList.add('active')
      containerActions.classList.add('open')
      allSelectBtn.forEach(selectBtn => {
        selectBtn.classList.add('open')
      })
    })
    btnCancel.addEventListener('click', () => {
      allSelectBtn.forEach(selectBtn => {
        selectBtn.classList.remove('open')
      })
      containerActions.classList.remove('open')
      btnSelect.classList.remove('active')
    })
  }

  renderDeleted () {
    const deleleteBtn = document.querySelectorAll('.delete')

    deleleteBtn.forEach(btn => {
      btn.addEventListener('click', async e => {
        const song = e.target
        const id = song.offsetParent.offsetParent.id
        const songId = song.offsetParent.getAttribute('song-id')

        const url = window.location.origin

        const res = await fetch(`${url}/song/lyric/${songId}`, {
          method: 'DELETE'
        })
        const data = await res.json()
        if (!res.ok) {
          return Swal.fire({
            icon: data.status,
            title: data.message
          })
        } else {
          Swal.fire({
            icon: data.status,
            title: data.message,
            timer: 2500,
            showConfirmButton: false
          })
        }
        this.deleteItem(id)

        this.initPagination(this.copyItems.length, parseInt(this.numberOfEntries))
        this.renderLi()
        this.renderButtons()
        this.renderPages()
      })
    })
  }

  isChecked (id) {
    const items = this.selected
    let res = false

    if (items.length === 0) return false
    items.forEach(item => {
      if (item.id === id) res = true
    })

    return res
  }

  getItem (id) {
    const res = this.items.filter(item => item.id === id)

    if (res.length === 0) return null
    return res[0]
  }

  removeSelected (id) {
    const res = this.selected.filter(item => item.id !== id)
    this.selected = [...res]
  }

  deleteItem (id) {
    const res = []

    this.copyItems = [...this.items]

    for (let i = 0; i < this.copyItems.length; i++) {
      if (this.copyItems[i].id !== id) {
        res.push(this.copyItems[i])
      }
    }
    this.copyItems = [...res]
    this.items = [...this.copyItems]
  }

  getIteratedButtons (start, end) {
    let res = ''

    for (let i = start; i <= end; i++) {
      if (i === this.pagination.current) {
        res += `<li><span class="active">${i}</span></li>`
      } else {
        res += `<li><button data-page="${i}">${i}</button></li>`
      }
    }

    return res
  }
}
document.addEventListener('DOMContentLoaded', function () {
  const selector = document.querySelector('#user-gallery')
  const dg = new DataGallery(selector)
  dg.parse()
})
const btnLibrarySection = document.getElementById('btn-library')
btnLibrarySection.addEventListener('DOMContentLoaded', function () {
  const selector = document.querySelector('#user-gallery')
  const dg = new DataGallery(selector)
  dg.parse()
})
