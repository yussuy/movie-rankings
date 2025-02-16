class MovieRanking {
    constructor() {
        this.api = new MovieAPI();
        this.movieListElement = document.getElementById('movieList');
        this.updateTimeElement = document.getElementById('updateTime');
        this.countdownElement = document.getElementById('countdown');
        this.updateInterval = 5000; // 改为 5 秒
        this.remainingTime = this.updateInterval;
    }

    formatBoxOffice(amount) {
        return new Intl.NumberFormat('zh-CN', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(amount);
    }

    createMovieElement(movie, rank) {
        const movieItem = document.createElement('div');
        movieItem.className = `movie-item ${movie.isDynamic ? 'dynamic' : ''}`;
        
        const flagsHtml = movie.flagUrls.map(url => 
            `<img src="${url}" alt="" class="country-flag" />`
        ).join(' ');
        
        movieItem.innerHTML = `
            <div class="rank">${rank}</div>
            <div class="movie-info">
                <div class="movie-title">${movie.title}</div>
                <div class="movie-details">
                    ${movie.releaseYear}年上映 
                    <span class="country-flags">${flagsHtml}</span>
                </div>
            </div>
            <div class="box-office-info">
                <div class="box-office rmb">¥${new Intl.NumberFormat('zh-CN').format(movie.boxOfficeRMB)}</div>
                <div class="box-office usd">${this.formatBoxOffice(movie.boxOfficeUSD)}</div>
            </div>
        `;
        
        return movieItem;
    }

    updateCountdown() {
        const minutes = Math.floor(this.remainingTime / 60000);
        const seconds = Math.floor((this.remainingTime % 60000) / 1000);
        this.countdownElement.textContent = 
            `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    startCountdown() {
        const timer = setInterval(() => {
            this.remainingTime -= 1000;
            if (this.remainingTime <= 0) {
                this.remainingTime = this.updateInterval;
            }
            this.updateCountdown();
        }, 1000);
    }

    async updateRanking() {
        const { movies, exchangeRateInfo } = await this.api.getAllMovies();
        this.movieListElement.innerHTML = '';
        
        movies.forEach((movie, index) => {
            const movieElement = this.createMovieElement(movie, index + 1);
            this.movieListElement.appendChild(movieElement);
        });

        this.updateTimeElement.textContent = new Date().toLocaleString('zh-CN');
        this.remainingTime = this.updateInterval; // 重置倒计时
        this.updateCountdown();
        
        // 更新汇率信息
        document.getElementById('exchangeRate').textContent = exchangeRateInfo;
    }

    start() {
        // 初始加载
        this.updateRanking();
        this.startCountdown();
        
        // 每5秒更新一次
        setInterval(() => this.updateRanking(), this.updateInterval);
    }
}

// 启动应用
document.addEventListener('DOMContentLoaded', () => {
    const app = new MovieRanking();
    app.start();
}); 