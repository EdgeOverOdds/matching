var cardsArray = [
    {    'name': 'CSS',    'img': 'https://github.com/robgmerrill/img/blob/master/css3-logo.png?raw=true',  },
    {    'name': 'HTML',    'img': 'https://github.com/robgmerrill/img/blob/master/html5-logo.png?raw=true',  },
    {    'name': 'jQuery',    'img': 'https://github.com/robgmerrill/img/blob/master/jquery-logo.png?raw=true',  },
    {    'name': 'JS',    'img': 'https://github.com/robgmerrill/img/blob/master/js-logo.png?raw=true',  },
    {    'name': 'Node',    'img': 'https://github.com/robgmerrill/img/blob/master/nodejs-logo.png?raw=true',  },
    {    'name': 'Photo Shop',    'img': 'https://github.com/robgmerrill/img/blob/master/photoshop-logo.png?raw=true',  },
    {    'name': 'PHP',    'img': 'https://github.com/robgmerrill/img/blob/master/php-logo_1.png?raw=true',  },
    {    'name': 'Python',    'img': 'https://github.com/robgmerrill/img/blob/master/python-logo.png?raw=true',  },
    {    'name': 'Ruby',    'img': 'https://github.com/robgmerrill/img/blob/master/rails-logo.png?raw=true',  },
    {    'name': 'Sass',    'img': 'https://github.com/robgmerrill/img/blob/master/sass-logo.png?raw=true',  },
    {    'name': 'Sublime',    'img': 'https://github.com/robgmerrill/img/blob/master/sublime-logo.png?raw=true',  },
    {    'name': 'Wordpress',    'img': 'https://github.com/robgmerrill/img/blob/master/wordpress-logo.png?raw=true',  },
  ];

  // grab the div with an id of game-board and assign to a variable
  var game = document.getElementById('game-board')


  // create a section element and assign to variable grid
  var grid = document.createElement('section')


  // give section element the class of grid
  grid.setAttribute('class', 'grid')

  //append grid section to game-board
  game.appendChild(grid)

  //  duplicate the cards array
  var gameGrid = cardsArray.concat(cardsArray)
  //randomize the cards

  gameGrid = gameGrid.sort(function(){
      return 0.5 - Math.random(.5)
  })

  // loop through each item in cards array
  for (i = 0; i < gameGrid.length; i++){
    // on each item, create div assign to var card
    var card = document.createElement('div');
    // apply a card to the class of card
    card.classList.add('card');

    // set the data-name attribute of the div to the cardsArray value
    card.dataset.name=gameGrid[i].name;

    // add front and back of card
    var front = document.createElement('div')
    front.classList.add('front')

    var back = document.createElement('div')
    back.classList.add('back')
    back.style.backgroundImage = `url(${gameGrid[i].img})`

    // append card to grid
    grid.appendChild(card)
    card.appendChild(front)
    card.appendChild(back)

  }
  //counter to follow number of flipped cards.
  var count = 0
  // ensure same identical square isn't selected twice
  var previousTarget = null

  var firstGuess = ''
  var secondGuess = ''

  //set delay for flipping
  delay = 1200

  // add match for CSS
  var match = function(){
      var selected = document.querySelectorAll('.selected') //array like object with all elements of selected class
      // loop through the array like object in selected clas
      for (i = 0; i < selected.length; i++){
          selected[i].classList.add('match')
      }
  }



  var resetGuesses = function(){
    firstGuess = '';
    secondGuess = '';
    count = 0;
    previousTarget = null;
    
    var selected = document.querySelectorAll('.selected');
    for (i = 0; i < selected.length; i++){
        selected[i].classList.remove('selected')
    }
    }

  // add event listener to the grid
  grid.addEventListener('click', function(event){
    //declare a variable to tagert our clicked item
    var clicked = event.target;
    
    // keep from selecting blank area, previous matches, 
    
    if (clicked.nodeName == 'SECTION' || clicked === previousTarget || clicked.parentNode.classList.contains('match') || clicked.parentNode.classList.contains('selected')){return;
    }
    

    

    if (count <2 ){
        count ++;
        
        if (count === 1){
            firstGuess = clicked.parentNode.dataset.name
            clicked.parentNode.classList.add('selected')
        } else {
            secondGuess = clicked.parentNode.dataset.name
            clicked.parentNode.classList.add('selected')
            }
        //make sure both aren't empty
        if (firstGuess !== '' && secondGuess !== ''){
            //and the guesses match
            if (firstGuess === secondGuess){
                //run match function
                setTimeout(match, delay);
                setTimeout(resetGuesses, delay)
            } else {
                setTimeout(resetGuesses,delay)   
            }
        }
        }
   previousTarget = clicked; 

  } );