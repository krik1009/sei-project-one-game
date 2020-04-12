function init() {
  // * 1. create grid + position pac, gh 1-4 and food 1-2
  const gameGrid = document.querySelector('#game-board')
  const cells = []

  const width = 10
  const height = 10
  const cellCount = width * height

  // set food array
  // ! calc food 1 position
  const foodOnePosition = [1, 2, 3, 6, 7, 8, 91, 92, 93, 96, 97, 98, 10, 13, 16, 19, 20, 23, 26, 29, 70, 73, 76, 79, 80, 83, 86, 89, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 41, 43, 46, 48, 51, 53, 56, 58]
  const foodTwoPosition = [0, width - 1, width * (height - 1), width * height - 1]
  // ! def in css, interval 3 sec, random position
  let foodSpPosition = []
  const foodArray = foodOnePosition.concat(foodTwoPosition).concat(foodSpPosition)

  // // def class for food?
  // class Foods {
  //   constructor(name, position, score) {
  //     this.name = name
  //     this.position = position
  //     this.score = score
  //   }
  //   increaseScore(score) {
  //     this.score += score
  //   }
  //   displayScore() {
  //     this.score
  //   }
  // }
  // const foodOne = new Foods('foodOne', foodOnePosition, 1)
  // const foodTwo = new Foods('foodTwo', foodTwoPosition, 5)
  // const foodSp = new Foods('foodSp', foodSpPosition, 10)

  // set pac and gh
  let pacOnePosition = foodOnePosition[ Math.floor( Math.random() * (foodOnePosition.length - 1 ))]
  let ghPosition = [(height / 2 - 1) * width + (width / 2 - 1), (height / 2 - 1) * width + width / 2, (height / 2) * width + (width / 2 - 1), (height / 2) * width + width / 2]

  function createGrid(pac, gh, foodOne, foodTwo) {
    for (let i = 0; i <= cellCount - 1; i++) {
      const cell = document.createElement('div')
      cell.textContent = i
      gameGrid.appendChild(cell)
      cells.push(cell)
    }
    // position pac and gh1-4
    cells[pac].classList.add('pac1-start')
    cells[gh[0]].classList.add('gh1-start')
    cells[gh[1]].classList.add('gh2-start')
    cells[gh[2]].classList.add('gh3-start')
    cells[gh[3]].classList.add('gh4-start')

    // position food1 food2
    for (let j = 0; j <= foodOne.length - 1; j++) {
      cells[foodOne[j]].classList.add('food-one')
      if (foodOne[j] === pacOnePosition) {
        cells[foodOne[j]].classList.remove('food-one') // remove food 1 in cell w pac
      }
    }
    for (let k = 0; k <= foodTwo.length - 1; k++) {
      cells[foodTwo[k]].classList.add('food-two')
    }
  }
  createGrid(pacOnePosition, ghPosition, foodOnePosition, foodTwoPosition)


  // * 2. start game - start pac animation
  const start = document.querySelector('#start')
  function startGame() {
    cells[pacOnePosition].classList.remove('pac1-start')
    cells[pacOnePosition].classList.add('pac1-eat1')
    // let timerPacMotion = setInterval( () => {
    //   console.log('test1')
    //   cells[pacOnePosition].classList.add('pac1-eat1') //! error
    //   cells[pacOnePosition].classList.remove('pac1-eat1')
    //   cells[pacOnePosition].classList.add('pac1-eat2')
    //   cells[pacOnePosition].classList.remove('pac1-eat2')
    //   console.log('test2')
    // }, 500)

    // if (ghPosition.forEach( item => {return item === pacOnePosition})) {
    //   clearInterval(timerPacMotion)
    //   return
    // }
     
  }
  start.addEventListener('click', startGame)
  

  // * 3. move pac w arrow keys, 
  // * 4. remove food and add score
  // ! 5. move gh
  const currentScore = document.querySelector('#current-score')
  const scoreTable = { 'food-one': 1, 'food-two': 5, 'food-special': 10 }
  const keyCodePac = { 39: +1, 37: -1, 38: -height, 40: +height } // keyCode - pacPosition

  function handleKeyUp(event) {
    cells[pacOnePosition].classList.remove('pac1-eat1') //first remove pac
    cells[pacOnePosition].classList.remove('pac1-eat2')

    // move pac by arrow keys following food items
    //! rotate pac, keep background color, error-skip 2 cells at the same time btwn food 1 and 2 ... use class?
    if (Object.keys(keyCodePac).some( item => {return Number(item) === event.keyCode} )) {
      // 1. food 1
      if (foodOnePosition.includes(pacOnePosition + keyCodePac[event.keyCode])) {
        pacOnePosition = pacOnePosition + keyCodePac[event.keyCode] // move pac on food map
        
        if (cells[pacOnePosition].classList.value === 'food-one') {
          // remove food item
          cells[pacOnePosition].classList.remove('food-one') 
          // update foodOneRemain array to avoid score double count - no need?
          const foodOneRemain = []
          foodOneRemain.push(pacOnePosition)
          // add score
          currentScore.textContent = parseInt(currentScore.textContent) + parseInt(scoreTable['food-one'])
        }
      }
      // 2. food 2
      if (foodTwoPosition.includes(pacOnePosition + keyCodePac[event.keyCode])) {
        pacOnePosition = pacOnePosition + keyCodePac[event.keyCode] // move pac on food map
        
        if (cells[pacOnePosition].classList.value === 'food-two') {
          // remove food item
          cells[pacOnePosition].classList.remove('food-two') 
          // update foodOneRemain array to avoid score double count - no need?
          const foodTwoRemain = []
          foodTwoRemain.push(pacOnePosition)
          // add score
          currentScore.textContent = parseInt(currentScore.textContent) + parseInt(scoreTable['food-two'])

          // ! here = activate high-score mode --
        }
      }
    } else {
      console.log('invalid operation')
    }
  
    cells[pacOnePosition].classList.add('pac1-eat2') // ! pac1-eat = def by css animation
  }
  document.addEventListener('keyup', handleKeyUp)
  


  // * 6. display foodSp randomly every n sec - add high-score mode

  // * 7. game-over 1. win full score, 2. eaten by gh, 3. reset button
  // * 8. update the highest score
  const reset = document.querySelector('#reset')

  const highScore = document.querySelector('#highest-score')
  const scoreRecord = [] //! score memory, push current score when reset or game over
 

  // * 9. level option
  // * 10. 2 player mode 

  // * 11. background music (w mute, unmute)
  // ! use value to siwch sounds by start, normal mode, high-score mode, gameover 
}

window.addEventListener('DOMContentLoaded', init)