// Card array
var cardsArray = [
  { 'name': 'trainer', 'img': 'images/trainer.jpg' },
  { 'name': 'squirtle', 'img': 'images/squirtle.jpg' },
  { 'name': 'rain', 'img': 'images/rain_form.jpg' },
  { 'name': 'ponyta', 'img': 'images/ponyta.jpg' },
  { 'name': 'pige', 'img': 'images/pige.jpg' },
  { 'name': 'pica', 'img': 'images/pic.jpg' },
  { 'name': 'art', 'img': 'images/art.jpg' },
  { 'name': 'Vulpix', 'img': 'images/vulpix.jpg' },
  { 'name': 'Cud', 'img': 'images/cud.jpg' },
  { 'name': 'MChar', 'img': 'images/M_char.jpg' },
  { 'name': 'JPuff', 'img': 'images/J_puff.jpg' },
  { 'name': 'Grav', 'img': 'images/Grav_MK.jpg' }
];

// Game state variables
var score = 0;
var moves = 0;
var combo = 0;
var matchedPairs = 0;
var totalPairs = cardsArray.length;
var timerStarted = false;
var timerSeconds = 0;
var timerInterval;

// Game elements
var game = document.getElementById('game-board');
var grid = document.createElement('section');
grid.setAttribute('class', 'grid');
game.appendChild(grid);

// Duplicate and shuffle cards
var gameGrid = cardsArray.concat(cardsArray);
gameGrid = gameGrid.sort(function() {
  return 0.5 - Math.random();
});

// Create cards
for (var i = 0; i < gameGrid.length; i++) {
  var card = document.createElement('div');
  card.classList.add('card');
  card.dataset.name = gameGrid[i].name;

  var front = document.createElement('div');
  front.classList.add('front');

  var back = document.createElement('div');
  back.classList.add('back');
  back.style.backgroundImage = `url(${gameGrid[i].img})`;

  grid.appendChild(card);
  card.appendChild(front);
  card.appendChild(back);
}

// Game state
var count = 0;
var previousTarget = null;
var firstGuess = '';
var secondGuess = '';
var delay = 800;
var isClickable = true;

// Sound effects (using Web Audio API)
var audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSound(frequency, duration, type = 'sine') {
  var oscillator = audioContext.createOscillator();
  var gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = frequency;
  oscillator.type = type;

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
}

function playFlipSound() {
  playSound(400, 0.1, 'sine');
}

function playMatchSound() {
  playSound(523.25, 0.15, 'sine');
  setTimeout(() => playSound(659.25, 0.15, 'sine'), 100);
  setTimeout(() => playSound(783.99, 0.3, 'sine'), 200);
}

function playWrongSound() {
  playSound(200, 0.2, 'sawtooth');
}

function playVictorySound() {
  var notes = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
  notes.forEach((note, index) => {
    setTimeout(() => playSound(note, 0.3, 'sine'), index * 100);
  });
}

// Timer functions
function startTimer() {
  if (!timerStarted) {
    timerStarted = true;
    timerInterval = setInterval(function() {
      timerSeconds++;
      updateTimerDisplay();
    }, 1000);
  }
}

function updateTimerDisplay() {
  var minutes = Math.floor(timerSeconds / 60);
  var seconds = timerSeconds % 60;
  var display = (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  document.getElementById('timer').textContent = display;
}

function stopTimer() {
  clearInterval(timerInterval);
  timerStarted = false;
}

// Update stats display
function updateScore(points) {
  score += points;
  document.getElementById('score').textContent = score;
}

function updateMoves() {
  moves++;
  document.getElementById('moves').textContent = moves;
}

function updateCombo() {
  document.getElementById('combo').textContent = combo;
}

// Particle effect
function createParticles(x, y) {
  var colors = ['#ffeb3b', '#ff5722', '#e91e63', '#9c27b0', '#3f51b5', '#00bcd4'];
  for (var i = 0; i < 20; i++) {
    var particle = document.createElement('div');
    particle.classList.add('particle');
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];

    var tx = (Math.random() - 0.5) * 200;
    var ty = (Math.random() - 0.5) * 200;
    particle.style.setProperty('--tx', tx + 'px');
    particle.style.setProperty('--ty', ty + 'px');

    document.body.appendChild(particle);

    setTimeout(function(p) {
      p.remove();
    }, 1000, particle);
  }
}

// Confetti effect
function createConfetti() {
  var colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
  for (var i = 0; i < 100; i++) {
    setTimeout(function() {
      var confetti = document.createElement('div');
      confetti.classList.add('confetti');
      confetti.style.left = Math.random() * window.innerWidth + 'px';
      confetti.style.top = '-10px';
      confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.width = (Math.random() * 10 + 5) + 'px';
      confetti.style.height = (Math.random() * 10 + 5) + 'px';

      document.body.appendChild(confetti);

      setTimeout(function(c) {
        c.remove();
      }, 3000, confetti);
    }, i * 30);
  }
}

// Match function
var match = function() {
  var selected = document.querySelectorAll('.selected');
  for (var i = 0; i < selected.length; i++) {
    selected[i].classList.add('match');

    // Create particles at card position
    var rect = selected[i].getBoundingClientRect();
    createParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
  }

  matchedPairs++;
  combo++;
  updateCombo();

  // Calculate score based on combo
  var points = 100 * combo;
  updateScore(points);

  playMatchSound();

  // Check if game is won
  if (matchedPairs === totalPairs) {
    setTimeout(showVictoryScreen, 800);
  }
};

// Reset guesses function
var resetGuesses = function() {
  firstGuess = '';
  secondGuess = '';
  count = 0;
  previousTarget = null;

  var selected = document.querySelectorAll('.selected');
  for (var i = 0; i < selected.length; i++) {
    selected[i].classList.remove('selected');
    selected[i].classList.remove('wrong');
  }
  isClickable = true;
};

// Show victory screen
function showVictoryScreen() {
  stopTimer();
  playVictorySound();
  createConfetti();

  document.getElementById('final-score').textContent = score;
  document.getElementById('final-moves').textContent = moves;
  document.getElementById('final-time').textContent = document.getElementById('timer').textContent;

  var victoryScreen = document.getElementById('victory-screen');
  victoryScreen.classList.add('show');
}

// Grid click event
grid.addEventListener('click', function(event) {
  var clicked = event.target;

  // Start timer on first click
  startTimer();

  // Prevent invalid clicks
  if (!isClickable ||
      clicked.nodeName === 'SECTION' ||
      clicked === previousTarget ||
      clicked.parentNode.classList.contains('match') ||
      clicked.parentNode.classList.contains('selected')) {
    return;
  }

  // Play flip sound
  playFlipSound();

  if (count < 2) {
    count++;

    if (count === 1) {
      firstGuess = clicked.parentNode.dataset.name;
      clicked.parentNode.classList.add('selected');
    } else {
      secondGuess = clicked.parentNode.dataset.name;
      clicked.parentNode.classList.add('selected');
      updateMoves();
    }

    // Check for match
    if (firstGuess !== '' && secondGuess !== '') {
      isClickable = false;

      if (firstGuess === secondGuess) {
        setTimeout(match, delay);
        setTimeout(resetGuesses, delay);
      } else {
        // Wrong match - reset combo
        combo = 0;
        updateCombo();
        playWrongSound();

        // Add shake animation
        var selected = document.querySelectorAll('.selected');
        for (var i = 0; i < selected.length; i++) {
          selected[i].classList.add('wrong');
        }

        setTimeout(resetGuesses, delay);
      }
    }
  }
  previousTarget = clicked;
});

// Reset game function
function resetGame() {
  // Stop timer
  stopTimer();

  // Reset all variables
  score = 0;
  moves = 0;
  combo = 0;
  matchedPairs = 0;
  timerSeconds = 0;
  timerStarted = false;

  // Update displays
  document.getElementById('score').textContent = '0';
  document.getElementById('moves').textContent = '0';
  document.getElementById('combo').textContent = '0';
  document.getElementById('timer').textContent = '00:00';

  // Hide victory screen
  document.getElementById('victory-screen').classList.remove('show');

  // Reload page for fresh start
  location.reload();
}

// Reset button event listeners
var resetButtons = document.querySelectorAll('.reset-game');
resetButtons.forEach(function(button) {
  button.addEventListener('click', resetGame);
});
