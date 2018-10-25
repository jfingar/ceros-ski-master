import _ from "lodash";
import $ from "jquery";
import ImageAssets from "../image_assets";

export default class GameMap {

    constructor() {
        this.gameWidth = window.innerWidth;
        this.gameHeight = window.innerHeight;
        this.obstacleTypes = ['tree', 'treeCluster', 'rock1', 'rock2'];
        this.obstacles = [];
        this.assets = ImageAssets;
        this.loadedAssets = {};
        this.canvasContext = this.renderCanvasElement();
        this.skier = null;
    }

    renderCanvasElement() {
        let canvas = $('<canvas></canvas>')
            .attr('width', this.gameWidth * window.devicePixelRatio)
            .attr('height', this.gameHeight * window.devicePixelRatio)
            .css({
                width: this.gameWidth + 'px',
                height: this.gameHeight + 'px'
            });
        $('body').append(canvas);

        return canvas[0].getContext('2d');
    }

    clearCanvas() {
        this.canvasContext.clearRect(0, 0, this.gameWidth, this.gameHeight);
    }

    drawObstacles() {
        let newObstacles = [];

        _.each(this.obstacles, obstacle => {
            let obstacleImage = this.loadedAssets[obstacle.type];
            let x = obstacle.x - this.skier.mapX - obstacleImage.width / 2;
            let y = obstacle.y - this.skier.mapY - obstacleImage.height / 2;

            if(x < -100 || x > this.gameWidth + 50 || y < -100 || y > this.gameHeight + 50) {
                return;
            }

            this.canvasContext.drawImage(obstacleImage, x, y, obstacleImage.width, obstacleImage.height);

            newObstacles.push(obstacle);
        });

        this.obstacles = newObstacles;
    }

    placeNewObstacle(direction) {
        let shouldPlaceObstacle = _.random(1, 8);
        if(shouldPlaceObstacle !== 8) {
            return;
        }

        let leftEdge = this.skier.mapX;
        let rightEdge = this.skier.mapX + this.gameWidth;
        let topEdge = this.skier.mapY;
        let bottomEdge = this.skier.mapY + this.gameHeight;

        switch(direction) {
            case 1: // left
                this.placeRandomObstacle(leftEdge - 50, leftEdge, topEdge, bottomEdge);
                break;
            case 2: // left down
                this.placeRandomObstacle(leftEdge - 50, leftEdge, topEdge, bottomEdge);
                this.placeRandomObstacle(leftEdge, rightEdge, bottomEdge, bottomEdge + 50);
                break;
            case 3: // down
                this.placeRandomObstacle(leftEdge, rightEdge, bottomEdge, bottomEdge + 50);
                break;
            case 4: // right down
                this.placeRandomObstacle(rightEdge, rightEdge + 50, topEdge, bottomEdge);
                this.placeRandomObstacle(leftEdge, rightEdge, bottomEdge, bottomEdge + 50);
                break;
            case 5: // right
                this.placeRandomObstacle(rightEdge, rightEdge + 50, topEdge, bottomEdge);
                break;
            case 6: // up
                this.placeRandomObstacle(leftEdge, rightEdge, topEdge - 50, topEdge);
                break;
        }
    }

    placeRandomObstacle(minX, maxX, minY, maxY) {
        let obstacleIndex = _.random(0, this.obstacleTypes.length - 1);

        let position = this.calculateOpenPosition(minX, maxX, minY, maxY);

        this.obstacles.push({
            type : this.obstacleTypes[obstacleIndex],
            x : position.x,
            y : position.y
        })
    }

    calculateOpenPosition(minX, maxX, minY, maxY) {
        let x = _.random(minX, maxX);
        let y = _.random(minY, maxY);

        let foundCollision = _.find(this.obstacles, obstacle => {
            return x > (obstacle.x - 50) && x < (obstacle.x + 50) && y > (obstacle.y - 50) && y < (obstacle.y + 50);
        });

        if(foundCollision) {
            return this.calculateOpenPosition(minX, maxX, minY, maxY);
        }
        else {
            return { x, y };
        }
    }

    loadAssets() {
        let assetPromises = [];

        _.each(this.assets, (asset, assetName) => {
            let assetImage = new Image();
            let assetDeferred = new $.Deferred();

            assetImage.onload = () => {
                assetImage.width /= 2;
                assetImage.height /= 2;

                this.loadedAssets[assetName] = assetImage;
                assetDeferred.resolve();
            };
            assetImage.src = asset;

            assetPromises.push(assetDeferred.promise());
        });

        return $.when.apply($, assetPromises);
    }

    intersectRect(r1, r2) {
        return !(r2.left > r1.right ||
            r2.right < r1.left ||
            r2.top > r1.bottom ||
            r2.bottom < r1.top);
    }

    placeInitialObstacles() {
        let numberObstacles = Math.ceil(_.random(5, 7) * (this.gameWidth / 800) * (this.gameHeight / 500));

        let minX = -50;
        let maxX = this.gameWidth + 50;
        let minY = this.gameHeight / 2 + 100;
        let maxY = this.gameHeight + 50;

        for(let i = 0; i < numberObstacles; i++) {
            this.placeRandomObstacle(minX, maxX, minY, maxY);
        }

        this.obstacles = _.sortBy(this.obstacles, obstacle => {
            let obstacleImage = this.loadedAssets[obstacle.type];
            return obstacle.y + obstacleImage.height;
        });
    };
}