# Ceros Ski Code Challenge

Welcome to the Ceros Code Challenge - Ski Edition!

For this challenge, we have included some base code for Ceros Ski, our version of the classic Windows game SkiFree. If
you've never heard of SkiFree, Google has plenty of examples. Better yet, you can play our version here: 
http://ceros-ski.herokuapp.com/  

We understand that everyone has varying levels of free time, so take a look through the requirements below and let us 
know when you will have something for us to look at (we also get to see how well you estimate and manage your time!). 
Previous candidates have taken about 8 hours to complete our challenge. We feel this gives us a clear indicator of your
technical ability and a chance for you to show us how much you give a shit (one of Ceros's core values!) about the position
you're applying for. If anything is unclear, don't hesitate to reach out.

Requirements:
* The base game that we've sent you is not what we would consider production ready code. In fact, it's pretty far from
  it. As part of our development cycle, all code must go through a review. We would like you to perform a review
  on the base code and fix/refactor it. Is the codebase maintainable, unit-testable, and scalable? What design patterns 
  could we use? 
  
  **We will be judging you based upon how you update the code & architecture.**
* There is a bug in the game. Well, at least one bug that we know of. Use the following bug report to debug the code
  and fix it.
  * Steps to Reproduce:
    1. Load the game
    1. Crash into an obstacle
    1. Press the left arrow key
  * Expected Result: The skier gets up and is facing to the left
  * Actual Result: Giant blizzard occurs causing the screen to turn completely white (or maybe the game just crashes!)
* The game's a bit boring as it is. Add a new feature to the game to make it more enjoyable. We've included some ideas for
  you below (or you can come up with your own new feature!). You don't need to do all of them, just pick something to show 
  us you can solve a problem on your own. 
  * Implement jumps. The asset file for jumps is already included. All you gotta do is make the guy jump. We even included
      some jump trick assets if you wanted to get really fancy!
  * Add a score. How will you know that you're the best Ceros Skier if there's no score? Maybe store that score
      somewhere so that it is persisted across browser refreshes.
  * Feed the hungry Rhino. In the original Ski Free game, if you skied for too long, a yeti would chase you
      down and eat you. In Ceros Ski, we've provided assets for a Rhino to catch the skier.
* Update this README file with your comments about your work; what was done, what wasn't, features added & known bugs.
* Provide a way for us to view the completed code and run it, either locally or through a cloud provider
* Be original. Don’t copy someone else’s game implementation!

Bonus:
* Provide a way to reset the game once the game is over
* Provide a way to pause and resume the game
* Skier should get faster as the game progresses
* Deploy the game to a server so that we can play it without setting something up ourselves. We've included a 
  package.json and web.js file that will enable this to run on Heroku. Feel free to use those or use your own code to 
  deploy to a cloud service if you want.
* Write unit tests for your code

And don't think you have to stop there. If you're having fun with this and have the time, feel free to add anything else
you want and show us what you can do! 

We are looking forward to see what you come up with!

****************************
### Jason Fingar Notes
****************************

### Environment & Deployment changes
- Converted to Webpack environment / added Webpack config featuring babel loader and style loader, to allow compilation of ES6 code and module bundling.
- Production output is a single minified js resource.
- Added webpack-dev-server for hot reloading to speed development.

### Code Refactor
- Organized into a (ES6) Modular design, to add structure and maintainability:
    - App (parent) module that initializes the skier and map, and starts the game loop
    - Skier module
    - GameMap module
    - ScoreBoard module

### Bug Fix - turning left after falling causes app to crash

- Console output: Uncaught TypeError: Cannot read property 'width' of undefined Skier.js line 53
- Debug analysis:
	- Collisions with obstacles causes the skier direction to be set to 0
	- Keypress of left arrow causes the skier direction to decrement by 1, resulting in a value of -1 for skier direction
	- There is no case in "getSkierAsset" function for -1, causing skierAssetName to return null
- Fix: Implemented logic to handle the scenario where the current skier direction is 0 (skier is crashed) on arrow key press.

### Implement new feature: Score Board

- Added a "ScoreBoard" module that displays and operates a timer, and also keeps track of top 5 high scores
- Timer starts when the skier is pointed down
- Timer pauses if the skier stops (without hitting an obstacle) and resumes if he then keeps going
- Timer stops and resets when the skier hits an obstacle, and displays time on scoreboard if it is top-5 longest timespans without crashing.
- Scoreboard times are persisted to local storage, and can be cleared by clicking the "clear" link on the scoreboard.

### Implemented new feature: Pause Game

- Pressing the "p" key toggles pause / unpause
- added visual display toward center of screen to show paused state clearly