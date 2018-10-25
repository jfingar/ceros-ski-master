export default class Skier {

    constructor() {
        this.direction = 5;
        this.mapX = 0;
        this.mapY = 0;
        this.speed = 8;
        this.gameMap = null;
    }

    move() {
        switch(this.direction) {
            case 2:
                this.mapX -= Math.round(this.speed / 1.4142);
                this.mapY += Math.round(this.speed / 1.4142);

                this.gameMap.placeNewObstacle(this.direction);
                break;
            case 3:
                this.mapY += this.speed;
                this.gameMap.placeNewObstacle(this.direction);
                break;
            case 4:
                this.mapX += this.speed / 1.4142;
                this.mapY += this.speed / 1.4142;
                this.gameMap.placeNewObstacle(this.direction);
                break;
        }
    }

    checkIfHitObstacle() {
        let skierAssetName = this.getSkierAsset();
        let skierImage = this.gameMap.loadedAssets[skierAssetName];
        let skierRect = {
            left: this.mapX + this.gameMap.gameWidth / 2,
            right: this.mapX + skierImage.width + this.gameMap.gameWidth / 2,
            top: this.mapY + skierImage.height - 5 + this.gameMap.gameHeight / 2,
            bottom: this.mapY + skierImage.height + this.gameMap.gameHeight / 2
        };

        let collision = _.find(this.gameMap.obstacles, obstacle => {
            let obstacleImage = this.gameMap.loadedAssets[obstacle.type];
            let obstacleRect = {
                left: obstacle.x,
                right: obstacle.x + obstacleImage.width,
                top: obstacle.y + obstacleImage.height - 5,
                bottom: obstacle.y + obstacleImage.height
            };

            return this.gameMap.intersectRect(skierRect, obstacleRect);
        });

        if(collision) {
            this.direction = 0;
        }
    }

    drawSkier() {
        let skierAssetName = this.getSkierAsset();
        let skierImage = this.gameMap.loadedAssets[skierAssetName];
        let x = (this.gameMap.gameWidth - skierImage.width) / 2;
        let y = (this.gameMap.gameHeight - skierImage.height) / 2;

        this.gameMap.canvasContext.drawImage(skierImage, x, y, skierImage.width, skierImage.height);
    }

    getSkierAsset() {
        let skierAssetName;
        switch(this.direction) {
            case 0:
                skierAssetName = 'skierCrash';
                break;
            case 1:
                skierAssetName = 'skierLeft';
                break;
            case 2:
                skierAssetName = 'skierLeftDown';
                break;
            case 3:
                skierAssetName = 'skierDown';
                break;
            case 4:
                skierAssetName = 'skierRightDown';
                break;
            case 5:
                skierAssetName = 'skierRight';
                break;
        }
        return skierAssetName;
    };
}