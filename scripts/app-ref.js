
// dom elements
// const gameGrid = document.querySelector('#game-board')
// const start = document.querySelector('#start')
// const reset = document.querySelector('#reset')
// const options = document.querySelectorAll('option')

// route, cell
const cells = []
const width = 10
const height = 10
const cellCount = width * height
const route = [
  0, 1, 2, 3, 6, 7, 8, 91, 92, 93, 96, 97, 98, 
  10, 13, 16, 19, 20, 23, 26, 29, 70, 73, 76, 79, 80, 83, 86, 89, 30, 
  31, 32, 33, 34, 35, 36, 37, 38, 39, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 
  41, 43, 46, 48, 51, 53, 56, 58, 9, 99, 90
]

// f add/remove css style? 
function addClassStyle(cellId, newStyle) {
  cells[cellId].classList.add(newStyle)
}
function removeClassStyle(cellId, oldStyle) {
  cells[cellId].classList.remove(oldStyle)
}
function replaceClassStyle(cellId, oldStyle, newStyle) {
  cells[cellId].classList.replace(oldStyle, newStyle)
}

// pac
class Pac {
  constructor(num, initPosition) {
    this.name = `pac${num}-${action}`
    this.position = initPosition
    this.style = `pac${num}-${action}`
  }
}
const pacOneStart = new Pac( 1, 'start', food1.initPosition[Math.floor( Math.random() * (food1.initPosition.length - 1 ))] ) 


// gh0-4
class Ghosts {
  constructor(num, initPosition) {
    this.name = `gh${num}`
    this.initPosition = initPosition
    this.style = `gh${num}`
  }
  // move randomly
  moveRandom(num) { // num = 0, 1, 2, 3
    cells[ghPosition[num]].classList.remove(`gh${num}`, 'ghsp')

    if (foodEaten.every( item => item !== ghPosition[num])) { // not display eaten food
      if (foodOnePosition.some( item => item === ghPosition[num])) addClassStyle(ghPosition[num], 'food1')
      if (foodTwoPosition.some( item => item === ghPosition[num])) addClassStyle(ghPosition[num], 'food2')
      if (foodSpPosition.some( item => item === ghPosition[num])) addClassStyle(ghPosition[num], 'foodsp')
    }

    const newPositionArray = []
    for (let i = 0; i <= ghDirection.length - 1; i++) {
      if (setBoundary(ghPosition[num], ghDirection[i])) {
        newPositionArray.push(ghDirection[i])
      }
    }
    ghPosition[num] += newPositionArray[Math.round(Math.random() * (newPositionArray.length - 1))]

    cells[ghPosition[num]].classList.remove('food1', 'food2', 'foodsp')
    addClassStyle(ghPosition[num], `gh${num}`)
  }
}
const gh0 = new Ghosts(0, (height / 2 - 1) * width + (width / 2 - 1))
const gh1 = new Ghosts(1, (height / 2 - 1) * width + width / 2)
const gh2 = new Ghosts(2, (height / 2) * width + (width / 2 - 1))
const gh3 = new Ghosts(3, (height / 2) * width + width / 2)


// food 1 2 sp
// ! calc food 1 position
class Foods { // num = 1, 2, sp
  constructor(num, initPosition, score) {
    this.name = `food${num}`
    this.initPosition = initPosition
    this.style = `gh${num}`
    this.score = score
  }
}
const foodOne = new Foods(1, [1, 2, 3, 6, 7, 8, 91, 92, 93, 96, 97, 98, 
  10, 13, 16, 19, 20, 23, 26, 29, 70, 73, 76, 79, 80, 83, 86, 89, 30, 
  31, 32, 33, 34, 35, 36, 37, 38, 39, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 
  41, 43, 46, 48, 51, 53, 56, 58], 1)
const foodTwo = new Foods(2, [0, width - 1, width * (height - 1), width * height - 1], 5)
const foodSp = new Foods('sp', '', 10)


