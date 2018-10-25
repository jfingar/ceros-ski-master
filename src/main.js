import App from "./modules/App";
import './css/game.css';

const app = new App();
app.skier.gameMap = app.gameMap;
app.gameMap.skier = app.skier;

const gameLoop = () => {
    if(!app.gameIsPaused) {
        app.gameMap.canvasContext.save();

        // Retina support
        app.gameMap.canvasContext.scale(window.devicePixelRatio, window.devicePixelRatio);

        app.gameMap.clearCanvas();

        app.skier.move();

        app.skier.checkIfHitObstacle();

        app.skier.drawSkier();

        app.gameMap.drawObstacles();

        app.gameMap.canvasContext.restore();

        app.manageScoreboard();

        app.manageDifficultyLevel();
    }

    requestAnimationFrame(gameLoop);
}

app.setupKeyhandler();

app.gameMap.loadAssets().then(() => {
    app.gameMap.placeInitialObstacles();
    requestAnimationFrame(gameLoop);
});