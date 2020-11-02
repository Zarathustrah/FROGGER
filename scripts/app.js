function init() {

  const startScreen = document.querySelector('start-screen')
  const start = document.querySelector('.start')
  const grid = document.querySelector('.grid')
  const livesTally = document.querySelector('#lives')
  const scoreTally = document.querySelector('#score')
  const livesScoreDisplay = document.querySelector('lives-score')
  

  const cells = []
  const width = 11
  const height = 14
  const gridCellCount = width * height
  let lives = 5
  let playerCount = 5
  const playerHome = 0
  let score = 0
  let playerIndex = 9
  let obstaclesLeft = [142, 139, 136, 120, 117, 114, 98]
  let obstaclesRight = [121, 124, 127, 99, 102, 105]
  let platformsLeft = [65, 64, 60, 59, 56, 55, 43, 42, 41, 40, 36, 35, 34, 33, 21, 20, 19, 15, 14, 13 ]
  let platformsRight = [44, 45, 48, 49, 51, 52, 22, 23, 24, 28, 29, 30]
  let waterCells = []
  let roadCells = []
  const homeBases = [0, 3, 5, 7, 10]
  let moveObstaclesInterval 
  let movePlatformsInterval
  const gameWon = false
  let gameLost = false
  let resultStatus = ''
  // const collision = false
  

  // **** INITIATE GAME GRID

  // function createIntroPage() {
  //   grid.style.display = 'none'
  //   start.style.visibility = 'hidden'
  //   livesScoreDisplay.style.visibility = 'hidden'
  //   startScreen.style.display = 'flex'
  // }

  // function removeIntroPage() {


  // }

  function createGrid() {
    for (let i = 0; i < gridCellCount; i += 1) {
      const cell = document.createElement('div')
      cells.push(cell)
      cell.innerHTML = i 
      grid.appendChild(cell)
    }
    moveObstacles()
    moveObstaclesInterval = setInterval(moveObstacles, 500)
    movePlatforms()
    movePlatformsInterval = setInterval(movePlatforms, 800)
    displayHomeBases()
    addPlayer()
    
  }

  createGrid()








  

  

  // **** OBSTACLES, PLATFORMS, BASES

  function displayObstacles() {
    cells.forEach(cell => cell.classList.remove('obstacle-left', 'obstacle-right'))
    obstaclesLeft.forEach(obstacle => cells[obstacle].classList.add('obstacle-left'))
    obstaclesRight.forEach(obstacle => cells[obstacle].classList.add('obstacle-right'))
    displayRoad()
  }
  
  function displayPlatforms() {
    cells.forEach(cell => cell.classList.remove('platform-left', 'platform-right'))
    platformsLeft.forEach(platform => cells[platform].classList.add('platform-left'))
    platformsRight.forEach(platform => cells[platform].classList.add('platform-right'))
    displayWater()
  }
  
  function displayRoad() {
    cells.forEach(cell => cell.classList.remove('road'))
    roadCells = Array.from({ length: width * 5 }, (a, b) => b + 88)
    roadCells = roadCells.filter(road => !obstaclesLeft.includes(road) && !obstaclesRight.includes(road))
    roadCells.forEach(road => cells[road].classList.add('road'))
  }
  
  function displayWater() {
    cells.forEach(cell => cell.classList.remove('water'))
    waterCells = Array.from({ length: 5 * width }, (a, b) => b + width)
    waterCells = waterCells.filter(water => !platformsLeft.includes(water) && !platformsRight.includes(water))
    waterCells.forEach(water => cells[water].classList.add('water'))
    waterCollision()
  }
  
  function displayHomeBases() {
    cells.forEach(cell => cell.classList.remove('home-base'))
    homeBases.forEach(base => cells[base].classList.add('home-base'))
  }
  
  function moveObstacles() {
    obstaclesLeft = obstaclesLeft.map(obstacle => {
      if (obstacle % width > 0) {
        return obstacle - 1
      } else {
        return obstacle + (width - 1)
      }
    }) 
    obstaclesRight = obstaclesRight.map(obstacle => {
      if (obstacle % width < width - 1) {
        return obstacle + 1
      } else {
        return obstacle - (width - 1)
      }
    })
    displayObstacles()
    obstacleCollision()
  }  

  function movePlatforms() {
    platformsLeft = platformsLeft.map(platform => {
      if (platform % width > 0) {
        return platform - 1
      } else {
        return platform + (width - 1)
      }
    }) 
    platformsRight = platformsRight.map(platform => {
      if (platform % width < width - 1) {
        return platform + 1
      } else {
        return platform - (width - 1)
      }
    })
    displayPlatforms()
    carryPlayerLeft()
    carryPlayerRight()
  }

  function carryPlayerLeft() {
    if (platformsLeft.includes(playerIndex) && playerIndex % width > 0) {
      playerIndex -= 1
      addPlayer()
    }
  }

  function carryPlayerRight() {
    if (platformsRight.includes(playerIndex) && playerIndex % width < width - 1) {
      playerIndex += 1
      addPlayer()
    }
  }
  


  // **** PLAYER MOVEMENT

  function handleMovePlayer(e) {
    cells[playerIndex].classList.remove('player')
    switch (e.keyCode) {
      case 39:
        if (playerIndex % width < width - 1) playerIndex++
        break
      case 37: 
        if (playerIndex % width !== 0) playerIndex--
        break
      case 38: 
        if (playerIndex - width >= 0) playerIndex -= width
        break
      case 40: 
        if (playerIndex + width < width * height) playerIndex += width
        break
      default: 
        console.log('invalid')
    }
    
    addPlayer()
    obstacleCollision()
    waterCollision()
    addPoints(100)
    playerWon()   
  }
 
  function addPlayer() {
    cells[playerIndex].classList.remove('player')
    cells[playerIndex].classList.add('player')
  }

  // **** CHECK WIN/LOSS


  function displayLives() {
    livesTally.innerHTML = lives
  }

  function obstacleCollision() {
    obstaclesLeft.forEach(obstacle => {
      if (playerIndex === obstacle) {
        playerHit()
      } 
    })
    obstaclesRight.forEach(obstacle => {
      if (playerIndex === obstacle) {
        playerHit()
      } 
    })
  }

  function waterCollision() {
    waterCells.forEach(water => {
      if (water === playerIndex) {
        playerHit()
      }
    })
  }

  function playerHit() {
    lives -= 1
    playerIndex = 148
    addPlayer()
    displayLives()
    playerLost()
  }

  function resetPlayer() {
    playerIndex = 148
    addPlayer()
  }


  function playerWon() {
    if (homeBases.includes(playerIndex)) {
      playerCount -= 1
      addPoints(500)
      resetPlayer()
            
      if (playerCount > 1 && playerHome !== 5) {
        resetPlayer()
      } else {
        addPoints(1000)
        // endGame()
        // displayResult()
      }

    }
    
  }

  function playerLost() {
    if (lives === 0) {
      gameLost = true
      endGame()
      // displayResult()
      console.log('Game Over!')
    }
     
  }

  function endGame() {
    while (grid.firstChild) {
      grid.removeChild(grid.firstChild)
    }

    resultStatus = document.createElement('h3')
    grid.appendChild(resultStatus)
    if (gameWon) {
      resultStatus.innerHTML = `You win!<br> You scored ${score} points!`
    } else if (gameLost) {
      resultStatus.innerHTML = `Game Over!<br> You scored ${score} points`
    }
  }

  










  

  // function endGame() {
  //   if (lives === 0 || ) {

  //   }
  // }

  // * SCORING

  
  function addPoints(points) {
    if (playerIndex <= 142) {
      score += points
      displayScore()
    }
    
  }

  function displayScore() {
    scoreTally.innerHTML = score
  }


  
  
  
 
  
  
  
  // createIntroPage()
 










  document.addEventListener('keydown', handleMovePlayer)

}
window.addEventListener('DOMContentLoaded', init)