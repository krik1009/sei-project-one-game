function init() {
  // dom elements
  const gameGrid = document.querySelector('#game-board')
  const start = document.querySelector('#start')
  const reset = document.querySelector('#reset')

  // grid and cell
  const cells = []
  const width = 10
  const height = 10
  const cellCount = width * height

  const foodOnePosition = [1, 2, 3, 6, 7, 8, 91, 92, 93, 96, 97, 98, 
    10, 13, 16, 19, 20, 23, 26, 29, 70, 73, 76, 79, 
    80, 83, 86, 89, 30, 
    31, 32, 33, 34, 35, 36, 37, 38, 39, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 
    41, 43, 46, 48, 51, 53, 56, 58]
  const foodTwoPosition = [0, width - 1, width * (height - 1), width * height - 1]
  let foodSpPosition = []
  foodSpPosition.push(foodOnePosition[Math.floor(Math.random() * (foodOnePosition.length - 1))])
  let foodEaten = []
  const foodArray = foodOnePosition.concat(foodTwoPosition)
  
  // route
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

  // pac, ghosts
  let pacOnePosition = foodOnePosition[ Math.floor( Math.random() * (foodOnePosition.length - 1 ))] //starting position for pac1
  const ghPositionInitial = [(height / 2 - 1) * width + (width / 2 - 1), 
    (height / 2 - 1) * width + width / 2, 
    (height / 2) * width + (width / 2 - 1), 
    (height / 2) * width + width / 2]

  let ghPosition = [(height / 2 - 1) * width + (width / 2 - 1), 
    (height / 2 - 1) * width + width / 2, 
    (height / 2) * width + (width / 2 - 1), 
    (height / 2) * width + width / 2] // update constantly

  // f add/remove style
  function addClassStyle(cellId, newStyle) {
    cells[cellId].classList.add(newStyle)
  }
  function removeClassStyle(cellId, oldStyle) {
    cells[cellId].classList.remove(oldStyle)
  }
  function replaceClassStyle(cellId, oldStyle, newStyle) {
    cells[cellId].classList.replace(oldStyle, newStyle)
  }

  // def score
  const currentScore = document.querySelector('#current-score')
  const highScore = document.querySelector('#highest-score')
  const scoreRecord = [0]
  const scoreTable = { 'food1': 1, 'food2': 5, 'foodsp': 10 }
  // const fullScore = parseInt((foodOnePosition.length * scoreTable['food1'] 
  // + foodTwoPosition.length * scoreTable['food2'] 
  // + foodSpPosition.length * (scoreTable['foodsp'] - scoreTable['food1']))) // deduct food1 score

  
  // f get food, score, high score mode
  function foodScore(num) { // num = 1, 2, sp
    if (cells[pacOnePosition].classList.contains(`food${num}`)) {
      // remove foods
      removeClassStyle(pacOnePosition,`food${num}`)
      // push the food to eaten array
      foodEaten.push(pacOnePosition)
      // add score
      currentScore.textContent = parseInt(currentScore.textContent) + parseInt(scoreTable[`food${num}`])
    }
  }

  let startTime = 0
  let endTime = 0

  // f audio sound
  const audio = document.querySelector('audio')
  function playSound(mode) { //start, gameover, normal, highscore
    audio.src = `./assets/audio/${mode}-mode.mp3`
    audio.play()
  }
  // mute
  const muteBtn = document.querySelector('#mute')
  function muteBGM() {
    clearTimeout(unmuteSound)
    audio.src = ''
    audio.play()
    const unmuteSound = setTimeout( () => { playSound('normal') }, 100000)
  }
  muteBtn.addEventListener('click', muteBGM)
  


  // def movement
  const keyCodePac = { 39: +1, 37: -1, 38: -height, 40: +height } // keyCode - pacPosition
  const ghDirection = [+1, -1, +width, -width] // feasible direction

  // f move gh randomly
  function moveGhRandom(num) { // num = 0, 1, 2, 3
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

  // return to default setting
  function returnToDefault() {
    // gh returns to initial cell
    ghPosition.forEach( item => removeClassStyle(item, 'ghsp'))
    for (let i = 0; i <= ghPosition.length - 1; i++) {
      ghPosition[i] = ghPositionInitial[i]
      addClassStyle(ghPosition[i], `gh${i}`)
    }

    // pac return to initial place
    cells[pacOnePosition].classList.remove('pac1-eat', 'pac1-highscore')
    pacOnePosition = foodOnePosition[ Math.floor( Math.random() * (foodOnePosition.length - 1 ))] 
    cells[pacOnePosition].classList.add('pac1-start')

    // food items return to the initial position
    foodOnePosition.forEach( item => removeClassStyle(item, 'foodsp') )
    foodSpPosition.forEach( item => removeClassStyle(item, 'foodsp') )
    foodOnePosition.forEach( item => addClassStyle(item, 'food1') )
    foodTwoPosition.forEach( item => addClassStyle(item, 'food2') )

    foodOnePosition.concat(foodSpPosition)
    // empty food eaten, foodsp
    foodEaten = []

    // display pac1
    removeClassStyle(pacOnePosition, 'food1')
    removeClassStyle(pacOnePosition, 'food2')
    removeClassStyle(pacOnePosition, 'foodsp')
    removeClassStyle(pacOnePosition, 'ghsp')
    addClassStyle(pacOnePosition,'pac1-starting')
    routePacGh.forEach( item => removeClassStyle(item, 'ghsp') )

    // reset current score, update score record
    scoreRecord.push(parseInt(currentScore.textContent))
    highScore.textContent = Math.max(...scoreRecord) 
    currentScore.textContent = 0

    routePacGh.forEach( item => cells[item].classList.replace('route-highscore', 'route') )
  }

  // *************
  // * 1. create grid + set pac, gh, food
  function createGrid(pac, gh, foodOne, foodTwo) {
    for (let i = 0; i <= cellCount - 1; i++) {
      const cell = document.createElement('div')
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



  // * 2. start and reset the game
  function startGame() {
    const startObj = new Date()
    startTime = startObj.getTime()

    cells[pacOnePosition].classList.remove('ghsp', 'foodsp')
    playSound('start')

    const gh0Move = setInterval( () => { moveGhRandom(0) }, 500)
    const gh1Move = setInterval( () => { moveGhRandom(1) }, 500)
    const gh2Move = setInterval( () => { moveGhRandom(2) }, 500)
    const gh3Move = setInterval( () => { moveGhRandom(3) }, 500)  
    const pacAnimation = setInterval( () => {
      addClassStyle(pacOnePosition, 'pac1-start')
    }, 1000)
    // reset game  reset button
    function resetGame() {
      const endObj = new Date()
      endTime = endObj.getTime()
      // clearInterval(soundTrackStart)
      clearInterval(gh0Move)
      clearInterval(gh1Move)
      clearInterval(gh2Move)
      clearInterval(gh3Move)
      clearInterval(pacAnimation)
      // clearInterval(pacHighScoreAnimation)
      returnToDefault()
    }
    reset.addEventListener('click', resetGame)
  }
  start.addEventListener('click', startGame)


  // * 3. play game - move pac and get score
  function playGame(event) {
    //play bgm
    playSound('normal')

    // change pac face
    cells[pacOnePosition].classList.remove('pac1-start','pac1-highscore', 'ghsp')
    cells[pacOnePosition].classList.replace('pac1-start','pac1-eat')

    // add score, turn on/off high score mode
    if (routePacGh.includes(pacOnePosition + keyCodePac[event.keyCode]) // on the route
    && setBoundary(pacOnePosition, keyCodePac[event.keyCode])) {  // feasible path to go
  
      removeClassStyle(pacOnePosition, 'pac1-eat')

      foodScore(1)
      foodScore(2)
      foodScore('sp')
      
      pacOnePosition += keyCodePac[event.keyCode] // move pac
      addClassStyle(pacOnePosition, 'pac1-highscore')

 
      // ! rotate pac
      //object.style.transform="rotate(7deg)"
      const rotateDeg = (event.keyCode - 39) * 90
      cells[pacOnePosition].classList.forEach( item => item.style = `transform: ${rotateDeg}deg`) //! object
      
      // // ! activate high score mode for 5 sec
      // if ( (cells[pacOnePosition].classList.contains('food2')
      // && foodTwoPosition.some( item => item === pacOnePosition))) {
      //   const returnToNormalMode = setTimeout( () => {
      //     removeClassStyle(pacOnePosition, 'pac1-highscore')
      //     removeClassStyle(foodSpPosition, 'foodsp')
      //     ghPosition.forEach( item => removeClassStyle(item, 'ghsp') )
          
      //     routePacGh.forEach( item => removeClassStyle(item, 'route-highscore') )
      //     foodSpPosition = []
      //   }, 5000) // ! level

      //   clearTimeout(returnToNormalMode)

      //   addClassStyle(pacOnePosition, 'pac1-highscore') 
      //   addClassStyle(foodSpPosition[0], 'foodsp')
      //   ghPosition.forEach( item => addClassStyle(item, 'ghsp'))
      //   routePacGh.forEach( item => addClassStyle(item, 'route-highscore'))
        
      //   // when pac encounters gh, gh return to initial position and normal face
      //   if (ghPosition[0] === pacOnePosition) {
      //     removeClassStyle(ghPosition[0], 'ghsp')
      //     ghPosition[0] = ghPositionInitial[0]
      //     addClassStyle(ghPosition[0], 'gh0')
      //   }
      //   if (ghPosition[1] === pacOnePosition) {
      //     removeClassStyle(ghPosition[1], 'ghsp')
      //     ghPosition[1] = ghPositionInitial[1]
      //     addClassStyle(ghPosition[1], 'gh1')
      //   }
      //   if (ghPosition[2] === pacOnePosition) {
      //     removeClassStyle(ghPosition[2], 'ghsp')
      //     ghPosition[2] = ghPositionInitial[2]
      //     addClassStyle(ghPosition[2], 'gh2')
      //   }
      //   if (ghPosition[3] === pacOnePosition) {
      //     removeClassStyle(ghPosition[3], 'ghsp')
      //     ghPosition[3] = ghPositionInitial[3]
      //     addClassStyle(ghPosition[3], 'gh3')
      //   }
      // }

    } else console.log('invalid input')


    // restart game when 1. full score, 2. lost
    if (foodEaten.length === foodArray.length) {
      window.alert('You WIN!!!')
      const tryAgain = window.confirm('Try again?')
      if (tryAgain) {
        returnToDefault()
        playSound('start')
      } else location.reload()
    }

    if (ghPosition.some( item => item === pacOnePosition )) {
      playSound('gameover')
      window.alert('You Lose...')
      const tryAgain = window.confirm('Try again?')
      if (tryAgain) {
        returnToDefault()
        playSound('start')
      } else location.reload()
    }
  }
  document.addEventListener('keyup', playGame)


  // * high score mode
  // * level option
  // * 2 player mode 
  // * mute/unmute background music mute
  // * 
}

window.addEventListener('DOMContentLoaded', init)