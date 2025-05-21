const searchBox = document.querySelector('.search-box')
const iconsearch = document.querySelector('.icon-search')
const cancelBtn = document.querySelector('.cancel-icon')
const searchInput = document.querySelector('.input-search')
const searchData = document.querySelector('.search-data')
iconsearch.onclick = () => {
  searchBox.classList.add('active')
  iconsearch.classList.add('active')
  searchInput.classList.add('active')
  cancelBtn.classList.add('active')
  searchInput.focus()
  if (searchInput.value != '') {
    const values = searchInput.value
    searchData.classList.remove('active')
    searchData.innerHTML = 'You just typed ' + "<span style='font-weight: 500;'>" + values + '</span>'
  } else {
    searchData.textContent = ''
  }
}
cancelBtn.onclick = () => {
  searchBox.classList.remove('active')
  iconsearch.classList.remove('active')
  searchInput.classList.remove('active')
  cancelBtn.classList.remove('active')
  searchData.classList.toggle('active')
  searchInput.value = ''
}
