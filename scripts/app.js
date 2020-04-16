function init() {
  // dom elements
  const gameGrid = document.querySelector('#game-board')
  const start = document.querySelector('#start')
  const reset = document.querySelector('#reset')
  const options = document.querySelectorAll('option')

  // grid and cell
  const cells = []
  const width = 10
  const height = 10
  const cellCount = width * height

  // food 1 2 sp
  // ! calc food 1 position
  const foodOnePosition = [1, 2, 3, 6, 7, 8, 91, 92, 93, 96, 97, 98, 
    10, 13, 16, 19, 20, 23, 26, 29, 70, 73, 76, 79, 
    80, 83, 86, 89, 30, 
    31, 32, 33, 34, 35, 36, 37, 38, 39, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 
    41, 43, 46, 48, 51, 53, 56, 58]
  const foodTwoPosition = [0, width - 1, width * (height - 1), width * height - 1]
  const foodSpPosition = []
  foodSpPosition.push(foodOnePosition[Math.floor(Math.random() * (foodOnePosition.length - 1))])
  let foodEaten = []
  const foodArray = foodOnePosition.concat(foodTwoPosition)
  
  // route
  const routePacGh = foodArray

  // pac, ghosts
  let pacOnePosition = foodOnePosition[ Math.floor( Math.random() * (foodOnePosition.length - 1 ))] //starting position for pac1
  const ghPositionInitial = [(height / 2 - 1) * width + (width / 2 - 1), 
    (height / 2 - 1) * width + width / 2, 
    (height / 2) * width + (width / 2 - 1), 
    (height / 2) * width + width / 2]

  const ghPosition = [(height / 2 - 1) * width + (width / 2 - 1), 
    (height / 2 - 1) * width + width / 2, 
    (height / 2) * width + (width / 2 - 1), 
    (height / 2) * width + width / 2] // update constantly

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
  // const fullScore = parseInt((foodOnePosition.length * scoreTable['food1'] 
  // + foodTwoPosition.length * scoreTable['food2'] 
  // + foodSpPosition.length * (scoreTable['foodsp'] - scoreTable['food1']))) // deduct food1 score

  
  // f move pac and get food, update score
  let highScoreMode = false
  function foodScore(num) { // num = 1, 2, sp
    if (cells[pacOnePosition].classList.value.includes(`food${num}`)) {
      // remove foods
      cells[pacOnePosition].classList.remove(`food${num}`)
      // turn on high score mode
      if (num === 2) highScoreMode = true
      // push the food to eaten array
      foodEaten.push(pacOnePosition)
      // add score
      currentScore.textContent = parseInt(currentScore.textContent) + parseInt(scoreTable[`food${num}`])
    }
  }
  function wait(ms) {
    const startTime = new Date().getTime()
    let endTime = startTime
    while (endTime < startTime + ms) {
      endTime = new Date().getTime()
    }
  }

  // def movement
  const keyCodePac = { 39: +1, 37: -1, 38: -height, 40: +height } // keyCode - pacPosition
  const ghDirection = [+1, -1, +width, -width] // feasible direction
  const distance = [+3, -3, +3 * width, 3 * -width] // social distancing //! level

  // f move gh randomly
  function moveGhRandom(num) { // num = 0, 1, 2, 3
    cells[ghPosition[num]].classList.remove(`gh${num}`, 'ghsp')

    if (foodEaten.every( item => item !== ghPosition[num])) { // not display eaten food
      if (foodOnePosition.some( item => item === ghPosition[num])) { cells[ghPosition[num]].classList.add('food1')}
      if (foodTwoPosition.some( item => item === ghPosition[num])) { cells[ghPosition[num]].classList.add('food2')}
      if (foodSpPosition.some( item => item === ghPosition[num])) { cells[ghPosition[num]].classList.add('foodsp')}
    }

    const newPositionArray = []
    for (let i = 0; i <= ghDirection.length - 1; i++) {
      if (distance.some( item => item === ghPosition[num] - pacOnePosition)) { // if gh comes 3 cells away from pac, gh turns away as far as direction is true
        if (setBoundary(ghPosition[num], -ghDirection[i])) {
          newPositionArray.push(-ghDirection[i])
        }
      } else if (setBoundary(ghPosition[num], ghDirection[i])) {
        newPositionArray.push(ghDirection[i])
      }
    }

    ghPosition[num] += newPositionArray[Math.round(Math.random() * (newPositionArray.length - 1))]

    cells[ghPosition[num]].classList.remove('food1', 'food2', 'foodsp')
    cells[ghPosition[num]].classList.add(`gh${num}`)

    if (highScoreMode) {
      cells[ghPosition[num]].classList.replace(`gh${num}`, 'ghsp')
    }
  }
  const level = 1000 - options.forEach( item => Object.keys(options)[item] * 100) 
  

  

  // *************
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
    cells[pacOnePosition].classList.remove('ghsp')
    highScoreMode = false

    // ! level 
    const gh0Move = setInterval( () => { moveGhRandom(0) }, 1000)
    const gh1Move = setInterval( () => { moveGhRandom(1) }, 1000)
    const gh2Move = setInterval( () => { moveGhRandom(2) }, 1000)
    const gh3Move = setInterval( () => { moveGhRandom(3) }, 1000)
    const pacAnimation = setInterval( () => {
      cells[pacOnePosition].classList.replace('pac1-eat', 'pac1-start')
    }, 1000)
    // if (setBoundary( pacOnePosition, 1)){
    //   cells[pacOnePosition].classList.remove('pac1-eat')
    //   pacOnePosition += 1
    //   cells[pacOnePosition].classList.add('pac1-eat')
    // }

    // * 3. reset game
    // f game reset (activate when 1. fullscore, 2. collision, 3. reset button ) 
    function resetGame() {
      // gh returns to initial cell
      for (let i = 0; i <= ghPosition.length - 1; i++) {
        cells[ghPosition[i]].classList.remove(`gh${i}`)
        ghPosition[i] = ghPositionInitial[i]
        cells[ghPosition[i]].classList.add(`gh${i}`)
      }

      // pac return to initial place w serious face
      cells[pacOnePosition].classList.remove('pac1-eat', 'pac1-highscore')
      pacOnePosition = foodOnePosition[ Math.floor( Math.random() * (foodOnePosition.length - 1 ))] 
      cells[pacOnePosition].classList.add('pac1-start')

      // food return
      for (let j = 0; j <= foodOnePosition.length - 1; j++) {
        cells[foodOnePosition[j]].classList.remove('foodsp')
        cells[foodOnePosition[j]].classList.add('food1')
      }
      for (let k = 0; k <= foodTwoPosition.length - 1; k++) {
        cells[foodTwoPosition[k]].classList.add('food2')
      }
      for (let i = 0; i <= foodSpPosition.length - 1; i++) {
        cells[foodSpPosition[i]].classList.replace('foodsp', 'food1')
      }
      foodOnePosition.concat(foodSpPosition)
      // empty food eaten
      foodEaten = []

      // display pac1
      cells[pacOnePosition].classList.remove('food1', 'food2', 'foodsp', 'ghsp') 
      cells[pacOnePosition].classList.add('pac1-starting')
      routePacGh.forEach( item => cells[item].classList.remove('ghsp'))

      // reset current score, update score record
      scoreRecord.push(parseInt(currentScore.textContent))
      highScore.textContent = Math.max(...scoreRecord) 
      currentScore.textContent = 0

      routePacGh.forEach( item => cells[item].classList.replace('route-highscore', 'route') )

      clearInterval(gh0Move)
      clearInterval(gh1Move)
      clearInterval(gh2Move)
      clearInterval(gh3Move)
      clearInterval(pacAnimation)
      clearInterval(pacHighScoreAnimation)
    }
    reset.addEventListener('click',resetGame)

    // * 2.  move pac -> score
    function playGame(event) {
      // change pac face
      cells[pacOnePosition].classList.remove('pac1-start','pac1-highscore', 'ghsp')
      cells[pacOnePosition].classList.replace('pac1-start','pac1-eat')

      // add score
      if (Object.keys(keyCodePac).some( item => Number(item) === event.keyCode )) {
        if (foodArray.includes(pacOnePosition + keyCodePac[event.keyCode])) {
          if (setBoundary(pacOnePosition, keyCodePac[event.keyCode])) {
            cells[pacOnePosition].classList.remove('pac1-eat')
            console.log(pacOnePosition)
            pacOnePosition += keyCodePac[event.keyCode] // move pac
            console.log(pacOnePosition)
            console.log(keyCodePac[event.keyCode])
            console.log(keyCodePac)
            foodScore(1)
            foodScore(2)
            cells[pacOnePosition].classList.add('pac1-eat')
            //! rotate pac, animate pac js
            // cells[pacOnePosition].style.transform = `rotate((${event.keyCode} - 39) * 90)deg))`
            // cells[pacOnePosition].style = `transform: rotate(90 * (39 - ${event.keyCode}))`
            


            // activate high score mode for 5 sec
            if (highScoreMode) {
              // food sp appear
              cells[foodSpPosition[0]].classList.replace('food1', 'foodsp')
    
              // change gh face
              for (let i = 0; i <= ghPosition.length - 1; i++) {
                cells[ghPosition[i]].classList.replace(`gh${i}`, 'ghsp')
              }
  
              // change pac face
              const pacHighScoreAnimation = setInterval( () => {
                cells[pacOnePosition].classList.replace('pac1-start', 'pac1-highscore')
              }, 1000)
              
              // cells[pacOnePosition].classList.replace('pac1-eat', 'pac1-highsc
  
              // when pac eat gh, gh go back to the initial position
              for (let i = 0; i <= ghPosition.length - 1; i++) {
                if (ghPosition[i] === pacOnePosition) {
                  cells[ghPosition[i]].classList.remove('ghsp')
                  ghPosition[i] = ghPositionInitial[i]
                  cells[ghPositionInitial[i]].classList.add(`gh${i}`)
                  clearInterval(`gh${i}Move`)
                  return
                }
              }
  
              // if pac eats sp add score
              foodScore('sp')
  
              // change route color
              routePacGh.forEach( item => cells[item].classList.replace('route', 'route-highscore') )
            }
              // deactivate high-score mode
              // wait(5000)
              // highScoreMode = false
              // return
          }
        
        }
      } else console.log('invalid input')

      // game over 1. full score, 2. eaten
      if (foodEaten.length === foodArray.length) {
        window.alert('You WIN!!!')
        const tryAgain = window.confirm('Try again?')
        if (tryAgain) {
          resetGame()
          startGame()
        } else {
          resetGame()
          setTimeout( startGame(), 5000 )
        }
      }
      
      if (ghPosition.some( item => item === pacOnePosition )) {
        window.alert('You Lose...')
        const tryAgain = window.confirm('Try again?')
        if (tryAgain) {
          resetGame()
          startGame()
        } else {
          resetGame()
          setTimeout( startGame(), 5000 )
        }
      }
    }
    document.addEventListener('keydown', playGame)

  }
  start.addEventListener('click', startGame)


  
  
  // * 9. level option
  // * 10. 2 player mode 
  // * 11. background music (w mute, unmute)
  // ! use value - start, normal mode, high-score mode, gameover 
}

window.addEventListener('DOMContentLoaded', init)