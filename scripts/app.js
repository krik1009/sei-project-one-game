function init() {
  // items
  
  const gameGrid = document.querySelector('#game-board')
  const reset = document.querySelector('#reset')
  const start = document.querySelector('#start')
  const options = document.querySelectorAll('option')

  // grid and cell
  const cells = []
  const width = 10
  const height = 10
  const cellCount = width * height

  // food items - food 1, 2, sp
  // ! calc food 1 position
  const foodOnePosition = [1, 2, 3, 6, 7, 8, 91, 92, 93, 96, 97, 98, 10, 13, 16, 19, 20, 23, 26, 29, 70, 73, 76, 79, 80, 83, 86, 89, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 41, 43, 46, 48, 51, 53, 56, 58]
  const foodTwoPosition = [0, width - 1, width * (height - 1), width * height - 1]
  const foodSpPosition = []
  const foodArray = foodOnePosition.concat(foodTwoPosition).concat(foodSpPosition)
  function foodSp() {
    // add foodSpPosition
    foodSpPosition.push(foodOnePosition[Math.floor(Math.random() * (foodOnePosition.length - 1))])
    // remove the sp from foodOnePosition
    foodOnePosition.filter( item => item !== foodSpPosition[0])
    // change style
    cells[foodSpPosition[0]].classList.remove('food1')
    cells[foodSpPosition[0]].classList.add('foodsp')
  } // activate in high-score mode

  // pac, gh
  let pacOnePosition = foodOnePosition[ Math.floor( Math.random() * (foodOnePosition.length - 1 ))] //starting position for pac1
  let ghPosition = [(height / 2 - 1) * width + (width / 2 - 1), (height / 2 - 1) * width + width / 2, (height / 2) * width + (width / 2 - 1), (height / 2) * width + width / 2]
 

  // set route for pac and gh
  const routePacGh = foodArray 

  // f set boundary for gh/pac - move if true
  function setBoundary(id, direction) {  
    if ( (id % width === width - 1 && direction === +1)
    || (id % width ===  0 && direction === -1)
    || (Math.floor(id / height) === 0 && direction === -height)
    || (Math.floor(id / height) === height - 1 && direction === +height)
    || !foodArray.some( item => item === id + direction)) {
      return false
    } else {
      return true
    }
  }

  // def score
  const currentScore = document.querySelector('#current-score')
  const highScore = document.querySelector('#highest-score')
  const scoreRecord = [0]
  const scoreTable = { 'food1': 1, 'food2': 5, 'foodsp': 10 }
  const fullScore = parseInt(foodOnePosition.length * scoreTable['food1'] + foodTwoPosition.length * scoreTable['food2'] + foodSpPosition.length * scoreTable['foodsp'])

  // def movement
  const keyCodePac = { 39: +1, 37: -1, 38: -height, 40: +height } // keyCode - pacPosition
  const ghDirection = [+1, -1, +width, -width] // feasible direction
  const distance = [+3, -3, +3 * width, 3 * -width] // social distancing

  // f move gh randomly
  function moveGhRandom(num) { // num = 0, 1, 2, 3
    cells[ghPosition[num]].classList.remove(`gh${num}`)
    if (foodOnePosition.some( item => item === ghPosition[num])) { cells[ghPosition[num]].classList.add('food1')}
    if (foodTwoPosition.some( item => item === ghPosition[num])) { cells[ghPosition[num]].classList.add('food2')}

    const newPositionArray = []
    for (let i = 0; i <= ghDirection.length - 1; i++) {
      if (setBoundary(ghPosition[num], ghDirection[i])) {
        newPositionArray.push(ghDirection[i])
      }
    }
    ghPosition[num] += newPositionArray[Math.round(Math.random() * (newPositionArray.length - 1))]
    if (distance.some( item => item === ghPosition[num] - pacOnePosition)) {
      ghPosition[num] = pacOnePosition + (- keyCodePac[event.keyCode]) // go oposite direction when gh is 3 cells away from the pac
    }
    cells[ghPosition[num]].classList.remove('food1', 'food2')
    cells[ghPosition[num]].classList.add(`gh${num}`)
  }

  // f game reset (1. fullscore, 2. collision, 3. reset button ) 
  function resetGame() {
    cells[ghPosition[0]].classList.remove('gh0')
    cells[ghPosition[1]].classList.remove('gh1')
    cells[ghPosition[2]].classList.remove('gh2')
    cells[ghPosition[3]].classList.remove('gh3')

    // gh return to the initial cell
    ghPosition[0] = (height / 2 - 1) * width + (width / 2 - 1)
    ghPosition[1] = (height / 2 - 1) * width + width / 2
    ghPosition[2] = (height / 2) * width + (width / 2 - 1)
    ghPosition[3] = (height / 2) * width + width / 2

    cells[ghPosition[0]].classList.add('gh0')
    cells[ghPosition[1]].classList.add('gh1')
    cells[ghPosition[2]].classList.add('gh2')
    cells[ghPosition[3]].classList.add('gh3')

    // pac return initial place, change face
    cells[pacOnePosition].classList.remove('pac1-eat')
    pacOnePosition = foodOnePosition[ Math.floor( Math.random() * (foodOnePosition.length - 1 ))] 
    cells[pacOnePosition].classList.add('pac1-start')

    // return foods
    for (let j = 0; j <= foodOnePosition.length - 1; j++) {
      cells[foodOnePosition[j]].classList.add('food1')
      if (foodOnePosition[j] === pacOnePosition) {
        cells[foodOnePosition[j]].classList.remove('food1') // remove food 1 in cell w pac
      }
    }
    for (let k = 0; k <= foodTwoPosition.length - 1; k++) {
      cells[foodTwoPosition[k]].classList.add('food2')
    }
    
    // reset current score, update score record
    scoreRecord.push(parseInt(currentScore.textContent))
    highScore.textContent = Math.max(...scoreRecord) 
    currentScore.textContent = 0
  }

  // * 1. create grid + starting positions of pac, gh1-4 and food 1, 2
  function createGrid(pac, gh, foodOne, foodTwo) {
    for (let i = 0; i <= cellCount - 1; i++) {
      const cell = document.createElement('div')
      cell.textContent = i
      gameGrid.appendChild(cell)
      cells.push(cell)
    }

    // add route style
    routePacGh.forEach( item => {
      return cells[item].classList.add('route')
    })

    // add style for pac starting position
    ghPosition.forEach( item => {
      return cells[item].classList.add('gh-starting')
    })

    // add pac and gh1-4
    cells[pac].classList.add('pac1-start')
    cells[gh[0]].classList.add('gh0')
    cells[gh[1]].classList.add('gh1')
    cells[gh[2]].classList.add('gh2')
    cells[gh[3]].classList.add('gh3')

    // add food1 2 
    for (let j = 0; j <= foodOne.length - 1; j++) {
      cells[foodOne[j]].classList.add('food1')
      if (foodOne[j] === pacOnePosition) {
        cells[foodOne[j]].classList.remove('food1') // remove food 1 in cell w pac
      }
    }
    for (let k = 0; k <= foodTwo.length - 1; k++) {
      cells[foodTwo[k]].classList.add('food2')
    }
  }
  createGrid(pacOnePosition, ghPosition, foodOnePosition, foodTwoPosition)


  // * 2. start game, move gh
  function startGame() {
    // ! call level value Object.keys(opstions) call array with 
    const interval = 1000 - options.forEach( item => Object.keys(options)[item] * 100) 
    const ghMove = setInterval( () => {
      moveGhRandom(0)
      moveGhRandom(1)
      moveGhRandom(2)
      moveGhRandom(3)
      
      if (currentScore > fullScore 
        || ghPosition[0] === (height / 2 - 1) * width + (width / 2 - 1)
        || ghPosition[1] === (height / 2 - 1) * width + width / 2
        || ghPosition[2] === (height / 2) * width + (width / 2 - 1)
        || ghPosition[3] === (height / 2) * width + width / 2 ) {
        clearInterval(ghMove)
        return
      }
    }, 300) //change gh speed based on level
  }
  start.addEventListener('click', startGame)


  // * 3. move pac w arrow keys -> score
  function playGame(event) {
    // change pac face
    cells[pacOnePosition].classList.remove('pac1-start')
    cells[pacOnePosition].classList.add('pac1-eat')

    // move pac and get food w arrow keys + update score 
    function foodScore(num) { // num = 1, 2, sp
      if (cells[pacOnePosition].classList.value.includes(`food${num}`)) {
        // remove foods
        cells[pacOnePosition].classList.remove(`food${num}`) 
        // add score
        currentScore.textContent = parseInt(currentScore.textContent) + parseInt(scoreTable[`food${num}`])
      }
    }

    //! rotate pac, animate pac js
    if (Object.keys(keyCodePac).some( item => Number(item) === event.keyCode )) {
      if (foodArray.includes(pacOnePosition + keyCodePac[event.keyCode])) {
        if (setBoundary(pacOnePosition, keyCodePac[event.keyCode])) {
          cells[pacOnePosition].classList.remove('pac1-eat')
          pacOnePosition = pacOnePosition + keyCodePac[event.keyCode] // move pac
          foodScore(1)
          foodScore(2)
          cells[pacOnePosition].classList.add('pac1-eat')
          cells[pacOnePosition].style.transform = `rotate((${event.keyCode} - 39) * 90)deg))`
          console.log(cells[pacOnePosition].style)

          // cells[pacOnePosition].style = `transform: rotate(90 * (39 - ${event.keyCode}))`
          // ! activate high-score mode : change gh/ foodsp --
        }
       

      }
    } else {
      console.log('invalid input')
    }

    // game over 1. full score, 2. eaten
    if (currentScore.textContent > fullScore) {
      window.alert('You WIN!!!')
      // update score record, reset current score
      resetGame()
    }
    if (ghPosition.some( item => item === pacOnePosition )) {
      window.alert('You Lose...')
      const tryAgain = window.confirm('Try again?')
      if (tryAgain) {
        setTimeout(resetGame(), 5000)
      } else { 
        location.reload() // ! avoid score reset?
      } 
    }
  }
  document.addEventListener('keyup', playGame)
  
  // * 3. reset game
  reset.addEventListener('click', resetGame)



  // * 9. level option
  // * 10. 2 player mode 
  // * 11. background music (w mute, unmute)
  // ! use value - start, normal mode, high-score mode, gameover 
}

window.addEventListener('DOMContentLoaded', init)