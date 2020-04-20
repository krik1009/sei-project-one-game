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



  // route and boundary
  class Route {
    constructor(name, position) {
      this.name = name
      this.position = position
      this.style = name
      this.highScoreStyle = `${name}-highscore`
    }
    highScoreMode() {
      removeClassStyle(this.position, this.style)
      addClassStyle(this.position, this.highScoreStyle)
    }
  }
  const route = new Route('route', [ // ! level, calc
    0, 1, 2, 3, 6, 7, 8, 9,
    10, 13, 16, 19,
    20, 23, 26, 29, 
    30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 
    41, 43, 46, 48, 
    51, 53, 56, 58,
    60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 
    70, 73, 76, 79, 
    80, 83, 86, 89, 
    90, 91, 92, 93, 96, 97, 98, 99])

  // f set boundary for gh/pac - move if true
  function setBoundary(id, direction) {  
    if ( (id % width === width - 1 && direction === +1)
    || (id % width ===  0 && direction === -1)
    || (Math.floor(id / height) === 0 && direction === -height)
    || (Math.floor(id / height) === height - 1 && direction === +height)
    || !route.position.some( item => item === id + direction)) {
      return false
    } else {
      return true
    }
  }
  


  // food (1, 2, sp)
  class Food {
    constructor(name, score, initPosition) {
      this.name = `food${name}`
      this.score = score
      this.initPosition = initPosition
      this.style = `food${name}`
    }
    foodScore() { // f get food, score, high score mode
      if (cells[pacOne.position].classList.contains(this.style)) {
        removeClassStyle(pacOne.position, this.style) // remove foods
        // push the food to eaten array
        foodEaten.push(pacOne.position)
        // add score
        currentScore.textContent = parseInt(currentScore.textContent) + this.score
      }
    }
  }
  const foodOne = new Food(1, 1, [ // ! calc init position
    1, 2, 3, 6, 7, 8, 
    10, 13, 16, 19, 
    20, 23, 26, 29, 
    30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 
    41, 43, 46, 48, 
    51, 53, 56, 58,
    60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 
    70, 73, 76, 79, 
    80, 83, 86, 89,    
    91, 92, 93, 96, 97, 98])
  const foodTwo = new Food(2, 5, [0, width - 1, width * (height - 1), width * height - 1])
  const foodSp = new Food('sp', 10, foodOne.initPosition[Math.floor(Math.random() * (foodOne.initPosition.length - 1))] )
  let foodEaten = []
  

  // pacman //! two player mode
  class Pacman { // start, eat, highscore
    constructor(name, position) {
      this.name = `pac${name}`
      this.position = position
      this.initStyle = `pac${name}-start`
      this.eatStyle = `pac${name}-eat`
      this.highScoreStyle = `pac${name}-highscore`
    }
    pacEatingAnim() { //! not working (cannot read error)
      removeClassStyle(this.postion, this.initStyle)
      addClassStyle(this.position, this.eatStyle)
    }
    highScoreMode() {
      removeClassStyle(this.postion, this.initStyle)
      addClassStyle(this.position, this.highScoreStyle)
    }
  }
  const pacOne = new Pacman(1, foodOne.initPosition[ Math.floor( Math.random() * (foodOne.initPosition.length - 1 ))])



  // *********************************************************
  // ghost (0, 1, 2, 3)
  class Ghost {
    constructor(name, position) {
      this.name = `gh${name}`
      this.position = position
      this.style = `gh${name}`
    }
    moveGhRandom() { // f move gh randomly 
      removeClassStyle(this.position, this.style)
      if (foodEaten.every( item => item !== this.position )) { // not display eaten food
        if (foodOne.initPosition.some( item => item === this.position )) addClassStyle(this.position, 'food1')
        if (foodTwo.initPosition.some( item => item === this.position)) addClassStyle(this.position, 'food2')
        if (foodSp.initPosition === this.position) addClassStyle(this.position, 'foodsp')
      }

      const newPositionArray = []
      const ghDirection = [+1, -1, +width, -width] // feasible direction
      for (let i = 0; i <= ghDirection.length - 1; i++) {
        if (setBoundary(this.position, ghDirection[i])) newPositionArray.push(ghDirection[i])
      }
      this.position += newPositionArray[Math.round(Math.random() * (newPositionArray.length - 1))]

      removeClassStyle(this.position, 'food1')
      removeClassStyle(this.position, 'food2')
      removeClassStyle(this.position, 'foodsp')
      addClassStyle(this.position, this.style)
    }
    highScoreMode() {
      removeClassStyle(this.position, this.style)
      addClassStyle(this.position, 'ghsp')
    }
  }
  const ghZero = new Ghost(0, (height / 2 - 1) * width + (width / 2 - 1))
  const ghOne = new Ghost(1, (height / 2 - 1) * width + width / 2)
  const ghTwo = new Ghost(2, (height / 2) * width + (width / 2 - 1))
  const ghThree = new Ghost(3,(height / 2) * width + width / 2)


  // f add/remove style
  function addClassStyle(cellId, newStyle) {
    cells[cellId].classList.add(newStyle)
  }
  function removeClassStyle(cellId, oldStyle) {
    cells[cellId].classList.remove(oldStyle)
  }

 
  // def score
  const currentScore = document.querySelector('#current-score')
  const highScore = document.querySelector('#highest-score')
  const scoreRecord = [0]
  // const fullScore = parseInt((foodOne.initPosition.length * foodOne.score 
  // + foodTwo.initPosition.length * foodTwo.score 
  // + foodSp.initPosition.length * (foodSp.score - foodOne.score))) // deduct food1 score

  

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
    const unmuteSound = setTimeout( () => { playSound('normal') }, 1000)
  }
  muteBtn.addEventListener('click', muteBGM)
  



  // return to default setting
  function returnToDefault() {
    // gh returns to initial cell
    removeClassStyle(ghZero.position, 'ghsp') // ! turn off high score mode??
    removeClassStyle(ghOne.position, 'ghsp')
    removeClassStyle(ghTwo.position, 'ghsp')
    removeClassStyle(ghThree.position, 'ghsp')

    removeClassStyle(ghZero.position, ghZero.style) 
    removeClassStyle(ghOne.position, ghOne.style)
    removeClassStyle(ghTwo.position, ghTwo.style)
    removeClassStyle(ghThree.position, ghThree.style)

    addClassStyle((height / 2 - 1) * width + (width / 2 - 1), ghZero.style)
    addClassStyle((height / 2 - 1) * width + width / 2, ghOne.style)
    addClassStyle((height / 2) * width + (width / 2 - 1), ghTwo.style)
    addClassStyle((height / 2) * width + width / 2, ghThree.style)


    // for (let i = 0; i <= ghPosition.length - 1; i++) {
    //   ghPosition[i] = ghPositionInitial[i]
    //   addClassStyle(ghPosition[i], `gh${i}`)
    // }

    // pac return to initial position
    clearInterval(pacOne.style)
    removeClassStyle(pacOne.position, pacOne.eatStyle)
    removeClassStyle(pacOne.position, 'pac1-highscore')
    pacOne.position = foodOne.initPosition[ Math.floor( Math.random() * (foodOne.initPosition.length - 1 ))] 
    addClassStyle(pacOne.position, pacOne.initStyle)
    // cells[pacOne.position].classList.remove('pac1-eat', 'pac1-highscore')
    // cells[pacOne.position].classList.add('pac1-start')

    // food items return to the initial position
    foodOne.initPosition.forEach( item => removeClassStyle(item, 'foodsp') )
    foodSp.initPosition.forEach( item => removeClassStyle(item, 'foodsp') )
    foodOne.initPosition.forEach( item => addClassStyle(item, 'food1') )
    foodTwo.initPosition.forEach( item => addClassStyle(item, 'food2') )

    foodOne.initPosition.concat(foodSp.initPosition)
    // empty food eaten, foodsp
    foodEaten = []

    // display pac1
    removeClassStyle(pacOne.position, foodOne.style) // ! do i need to remove the food style??? 
    removeClassStyle(pacOne.position, foodTwo.style)
    removeClassStyle(pacOne.position, foodSp.style)
    // removeClassStyle(pacOne.position, 'ghsp')
    addClassStyle(pacOne.position,pacOne.initStyle)
    route.position.forEach( item => removeClassStyle(item, 'ghsp') ) // ! replace it? turn off high-score mode?

    // reset current score, update score record
    scoreRecord.push(parseInt(currentScore.textContent))
    highScore.textContent = Math.max(...scoreRecord) 
    currentScore.textContent = 0

    route.position.forEach( item => removeClassStyle(item, route.highScoreStyle) ) //! turn off high-score mode?
    route.position.forEach( item => addClassStyle(item, route.style) ) 
    
    clearInterval(gameBGM)
  }


  let startTime = 0
  let endTime = 0





  // *******************************************************************************************
  // * 1. create grid + set pac, gh, food
  function createGrid() {
    for (let i = 0; i <= cellCount - 1; i++) {
      const cell = document.createElement('div')
      gameGrid.appendChild(cell)
      cells.push(cell)
      cell.textContent = i // for test
    }

    // add route style
    route.position.forEach( item => addClassStyle(item, route.style) )

    // add background image @ gh starting positions
    addClassStyle(ghZero.position, 'gh-starting')
    addClassStyle(ghOne.position, 'gh-starting')
    addClassStyle(ghTwo.position, 'gh-starting')
    addClassStyle(ghThree.position, 'gh-starting')

    // add pac and gh1-4
    addClassStyle(pacOne.position, pacOne.initStyle) // !! pac1-start not shown
    console.log(pacOne.initStyle)
    console.log(pacOne.position)
    console.log(cells[pacOne.position].classList)

    addClassStyle(ghZero.position, ghZero.style)
    addClassStyle(ghOne.position,  ghOne.style)
    addClassStyle(ghTwo.position,  ghTwo.style)
    addClassStyle(ghThree.position,  ghThree.style)

    // add food1 2
    removeClassStyle(foodSp.initPosition, foodSp.style)
    foodOne.initPosition.filter( item => item !== pacOne.postion ).forEach( item => addClassStyle(item, foodOne.style)) // remove f1 from cell w pac
    foodTwo.initPosition.forEach( item => addClassStyle(item, foodTwo.style))
  }
  createGrid()



  // *******************************************************************************************
  // * 2. start and reset the game
  let gameBGM = ''
  function startGame() {
    const startObj = new Date()
    startTime = startObj.getTime()
    playSound('start')

    removeClassStyle(pacOne.position, foodSp.style) //! address high score mode
    pacOne.style = setInterval( () => { pacOne.pacEatingAnim() }, 10) // !! ? 
    gameBGM = setInterval( () => { playSound('normal') }, 4000)

    // gh start to move
    const gh0Move = setInterval( () => { ghZero.moveGhRandom() }, 500)
    const gh1Move = setInterval( () => { ghOne.moveGhRandom() }, 500)
    const gh2Move = setInterval( () => { ghTwo.moveGhRandom() }, 500)
    const gh3Move = setInterval( () => { ghThree.moveGhRandom() }, 500)  

    // reset game  reset button
    function resetGame() {
      const endObj = new Date()
      endTime = endObj.getTime()
      // clearInterval(soundTrackStart)
      clearInterval(gh0Move)
      clearInterval(gh1Move)
      clearInterval(gh2Move)
      clearInterval(gh3Move)
      clearInterval(pacOne.style)
      clearInterval(gameBGM)
      returnToDefault()
    }
    reset.addEventListener('click', resetGame)
  }
  start.addEventListener('click', startGame)


  // *******************************************************************************************
  // * 3. play game
  //play bgm
  
  // def movement
  const keyCodePac = { 39: +1, 37: -1, 38: -height, 40: +height } // keyCode - pacPosition

  function playGameNormalMode(event) {
    // add score, turn on/off high score mode
    if (route.position.includes(pacOne.position + keyCodePac[event.keyCode]) // on the route
    && setBoundary(pacOne.position, keyCodePac[event.keyCode])) {  // feasible path
      removeClassStyle(pacOne.position, pacOne.style)

      foodOne.foodScore()
      foodTwo.foodScore()
      foodSp.foodScore()

      pacOne.position += keyCodePac[event.keyCode] // move pac

      const rotateDeg = (event.keyCode - 39) * 90
      pacOne.style.transform = `${rotateDeg}deg` //! ? ! rotate pac

      addClassStyle(pacOne.position, pacOne.style)

    } else console.log('invalid input')
  

    // restart game when 1. full score, 2. lost
    if (foodEaten.length === foodOne.initPosition.concat(foodTwo.initPosition)) {
      window.alert('You WIN!!!')
      const tryAgain = window.confirm('Try again?')
      if (tryAgain) {
        returnToDefault()
        playSound('start')
      } else location.reload()
    }

    if (ghZero.position === pacOne.position 
      || ghOne.position === pacOne.position 
      || ghTwo.position === pacOne.position 
      || ghThree.position === pacOne.position ) {
      playSound('gameover')
      window.alert('You Lose...')
      const tryAgain = window.confirm('Try again?')
      if (tryAgain) {
        returnToDefault()
        playSound('start')
      } else location.reload()
    }
  }
  document.addEventListener('keyup', playGameNormalMode)



  // ! highScoreMode - how to handle key up event
  const normalModeTime = setTimeout( () => { playGameNormalMode }, 5000)
  function playGameHighScoreMode(event) {
    if (foodSp.foodScore()) {
      clearTimeout(normalModeTime)

      pacOne.highScoreMode()
      ghZero.highScoreMode()
      ghOne.highScoreMode()
      ghTwo.highScoreMode()
      ghThree.highScoreMode()
      route.highScoreMode()
      
    
      if (route.position.includes(pacOne.position + keyCodePac[event.keyCode]) // on the route
      && setBoundary(pacOne.position, keyCodePac[event.keyCode])) {  // feasible path
        removeClassStyle(pacOne.position, pacOne.style)

        foodOne.foodScore()
        foodTwo.foodScore()
        foodSp.foodScore()

        pacOne.position += keyCodePac[event.keyCode] // move pac

        // ! rotate pac
        const rotateDeg = (event.keyCode - 39) * 90
        pacOne.style.transform = `${rotateDeg}deg` //! ? 

        addClassStyle(pacOne.position, pacOne.style)

        if (ghZero.position === pacOne.position) ghZero.position = (height / 2 - 1) * width + (width / 2 - 1)
        if (ghOne.position === pacOne.position) ghOne.position = (height / 2 - 1) * width + width / 2
        if (ghTwo.position === pacOne.position) ghTwo.position = (height / 2) * width + (width / 2 - 1)
        if (ghThree.position === pacOne.position) ghThree.position = (height / 2) * width + width / 2
      } else console.log('invalid input')
    }
  }
  document.addEventListener('keyup', playGameHighScoreMode)

  
  // * high score mode
  // * level option
  // * 2 player mode 
  // * mute/unmute background music mute
  // * 
}

window.addEventListener('DOMContentLoaded', init)