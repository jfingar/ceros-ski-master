import $ from 'jquery';

export default class ScoreBoard {

    constructor() {
        this.currentTime = 0.00;
        this.lastTime = null;
        this.currentInterval = null;
        this.topFiveTimes = [];
        $('#clear-scores').on('click', () => this.clearScoreboard());
    }

    startTimer() {
        if(!this.currentInterval) {
            this.currentInterval = setInterval(() => {
                this.currentTime = Math.round((this.currentTime + .01) * 100) / 100;
                $('#timer').text(this.currentTime.toFixed(2));
            }, 10);
        }
    }

    stopTimer() {
        if(this.currentInterval) {
            clearInterval(this.currentInterval);
            this.currentInterval = null;
        }
    }

    resetTimer() {
        if(this.currentTime > 0.00) {
            this.stopTimer();
            this.lastTime = this.currentTime;
            this.currentTime = 0.00;
            $('#timer').text(this.currentTime.toFixed(2));
            $('#last-run-val').text(this.lastTime.toFixed(2) + ' seconds');
        }
    }

    recordTime() {
        if(this.currentTime > 0.00) {
            this.topFiveTimes.push(this.currentTime);
            this.topFiveTimes.sort((a, b) => b - a);
            this.topFiveTimes = this.topFiveTimes.slice(0, 5);
            this.persistScores();
            this.renderTopScores();
        }
    }

    renderTopScores() {
        $('#best-scores-list').html("");
        this.topFiveTimes.forEach((time, index) => {
            let scoreRowTemplate = `<div class="score-row">
                                        <div class="score-col-1">#${index + 1}</div>
                                        <div class="score-col-2">${time.toFixed(2)} seconds</div>
                                        <div style="clear: both;"></div>
                                    </div>`;
            $('#best-scores-list').append(scoreRowTemplate);
        });
    }

    persistScores() {
        window.localStorage.setItem("bestScores", JSON.stringify(this.topFiveTimes));
    }

    clearScoreboard() {
        this.topFiveTimes = [];
        $('#best-scores-list').html("");
        window.localStorage.setItem("bestScores", JSON.stringify([]));
    }
}