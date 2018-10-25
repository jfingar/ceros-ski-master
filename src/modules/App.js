import Skier from './Skier';
import GameMap from './GameMap';
import ScoreBoard from './ScoreBoard';
import $ from "jquery";

export default class App {

    constructor() {
        this.gameMap = new GameMap();
        this.skier = new Skier();
        this.scoreBoard = new ScoreBoard();
        this.gameIsPaused = false;

        let storedScores = window.localStorage.getItem("bestScores");
        if(storedScores) {
            this.scoreBoard.topFiveTimes = JSON.parse(storedScores);
            this.scoreBoard.renderTopScores();
        }
    }

    setupKeyhandler() {
        $(window).keydown(event => {
            switch(event.which) {
                case 37: // left
                    if(this.skier.direction === 1) {
                        this.skier.mapX -= this.skier.speed;
                        this.gameMap.placeNewObstacle(this.skier.direction);
                    }
                    else if(this.skier.direction === 0) {
                        this.skier.direction = 1;
                    }
                    else {
                        this.skier.direction--;
                    }
                    event.preventDefault();
                    break;
                case 39: // right
                    if(this.skier.direction === 5) {
                        this.skier.mapX += this.skier.speed;
                        this.gameMap.placeNewObstacle(this.skier.direction);
                    }
                    else if(this.skier.direction === 0) {
                        this.skier.direction = 5;
                    }
                    else {
                        this.skier.direction++;
                    }
                    event.preventDefault();
                    break;
                case 38: // up
                    if(this.skier.direction === 1 || this.skier.direction === 5) {
                        this.skier.mapY -= this.skier.speed;
                        this.gameMap.placeNewObstacle(6);
                    }else if(this.skier.direction === 0) {
                        this.skier.direction = 5;
                    }
                    event.preventDefault();
                    break;
                case 40: // down
                    this.skier.direction = 3;
                    event.preventDefault();
                    break;
                case 80: // p (pause game)
                    this.togglePausedState();
                    event.preventDefault();
                    break;
            }
        });
    }

    togglePausedState() {
        this.gameIsPaused = !this.gameIsPaused;
        this.scoreBoard.stopTimer();
        if($('#paused').is(':visible')) {
            $('#paused').hide();
        } else {
            $('#paused').show();
        }
    }

    manageScoreboard() {
        if(this.skier.direction > 1 && this.skier.direction < 5) {
            this.scoreBoard.startTimer();
        } else if(this.skier.direction === 0) {
            this.scoreBoard.stopTimer();
            this.scoreBoard.recordTime();
            this.scoreBoard.resetTimer();
        } else {
            this.scoreBoard.stopTimer();
        }
    }
}