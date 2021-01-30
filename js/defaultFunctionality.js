/* global Element */

Element.prototype.siblingElements = function () {
  if (this.parentNode === null) return []

  return [...this.parentNode.children].filter(el => el !== this)
}

const DROPDOWN_SHOW_CLASS = 'show'

// at initialization
document.querySelectorAll('[data-toggle="dropdown"]').forEach(item => {
  // say that all collapsible element not expanded
  item.ariaExpanded = false

  // add click listener to toggle dropdowns
  item.addEventListener('click', () => {
    toggleDropdown(item)
  })
})

// function made to toggle my item and untoggle all others
function toggleDropdown (item) {
  if (!item.ariaExpanded) { // if I am not expanded, go untoggle all other siblings
    item.parentNode.siblingElements().filter(el => el.classList.contains(DROPDOWN_SHOW_CLASS)).forEach(otherParent => { // you do not need to filter other with show class because it will be removed anyway
      otherParent.querySelector('[data-toggle="dropdown"]').ariaExpanded = false
      otherParent.classList.remove(DROPDOWN_SHOW_CLASS)
    })
  }

  // then toggle me
  item.ariaExpanded = !item.ariaExpanded
  item.parentNode.classList.toggle(DROPDOWN_SHOW_CLASS)
}

document.querySelectorAll('[data-toggle="collapse"]').forEach(item => {
  item.dataset.expanded = false
  item.addEventListener('click', () => {
    toggleMenu(item)
  })
})

function toggleMenu (item) {
  let expandNow = true
  if (item.dataset.expanded === 'true') expandNow = false

  item.classList.toggle('collapsed', expandNow)
  getNextElement(item, item.dataset.target).classList.toggle('show', expandNow)
  item.dataset.expanded = expandNow
}

function getNextElement (element, selector) {
  let next = element.nextElementSibling
  while (next) {
    if (next.matches(selector)) return next
    next = next.nextElementSibling
  }
}

document.querySelectorAll('[data-ride="carousel"]').forEach(item => {
  const indicators = item.querySelector('.carousel-indicators').children
  const itemCount = indicators.length
  let currentItem = 0
  let blocking = false

  item.querySelector('[data-slide="prev"]').addEventListener('click', e => {
    e.preventDefault()
    if (currentItem === 0) goToSlide(item, itemCount - 1)
    else goToSlide(item, currentItem - 1)
  })

  item.querySelector('[data-slide="next"]').addEventListener('click', e => {
    e.preventDefault()
    if (currentItem === itemCount - 1) goToSlide(item, 0)
    else goToSlide(item, currentItem + 1)
  })

  setTimeout(function loop () {
    if (currentItem === itemCount - 1) goToSlide(item, 0)
    else goToSlide(item, currentItem + 1)
    setTimeout(loop, 5000)
  }, 5000)

  for (const child of indicators) {
    child.addEventListener('click', () => {
      goToSlide(item, parseInt(child.dataset.slideTo, 10))
    })
  }

  function goToSlide (carousel, index) {
    if (!blocking && index !== currentItem) {
      blocking = true

      const carouselIIndicators = carousel.querySelector('.carousel-indicators').children
      const carouselItems = carousel.querySelector('.carousel-inner').children

      carouselIIndicators.item(currentItem).classList.remove('active')
      carouselIIndicators.item(index).classList.add('active')

      let itemKeyLeftRight = ''
      let itemKeyPrevNext = ''
      if (index > currentItem) {
        itemKeyLeftRight = 'carousel-item-left'
        itemKeyPrevNext = 'carousel-item-next'
      } else {
        itemKeyLeftRight = 'carousel-item-right'
        itemKeyPrevNext = 'carousel-item-prev'
      }

      carouselItems.item(index).classList.add(itemKeyPrevNext)
      carouselItems.item(currentItem).classList.add(itemKeyLeftRight)
      setTimeout(() => {
        carouselItems.item(index).classList.remove(itemKeyPrevNext)
        carouselItems.item(currentItem).classList.remove(itemKeyLeftRight)
        carouselItems.item(index).classList.add('active')
        carouselItems.item(currentItem).classList.remove('active')
        currentItem = index

        blocking = false
      }, 600)
    }
  }
})
