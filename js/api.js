class MovieAPI {
    constructor() {
        // 只保留动态电影的初始数据，以防API请求失败时使用
        this.dynamicMovie = {
            id: 17,
            title: "哪吒之魔童闹海",
            releaseYear: 2025,
            boxOfficeRMB: 11677682912,
            isDynamic: true,
            country: "CN"
        };
    }

    // 获取电影国家代码
    getCountryCode(movieName) {
        // 返回 ISO 3166-1 alpha-2 国家代码
        if (movieName === "哪吒之魔童闹海") return "CN";
        if (movieName === "超级马里奥兄弟大电影") return "US,JP";
        if (movieName === "哈利·波特与死亡圣器（下）") return "GB,US";
        if (movieName === "阿凡达") return "US";
        if (movieName === "复仇者联盟4：终局之战") return "US";
        if (movieName === "阿凡达：水之道") return "US";
        if (movieName === "泰坦尼克号") return "US";
        if (movieName === "星球大战7：原力觉醒") return "US";
        if (movieName === "复仇者联盟3：无限战争") return "US";
        if (movieName === "蜘蛛侠：英雄无归") return "US";
        if (movieName === "头脑特工队2") return "US";
        if (movieName === "侏罗纪世界") return "US";
        if (movieName === "狮子王") return "US";
        if (movieName === "复仇者联盟") return "US";
        if (movieName === "速度与激情7") return "US";
        if (movieName === "壮志凌云：独行侠") return "US";
        if (movieName === "冰雪奇缘2") return "US";
        if (movieName === "芭比") return "US";
        if (movieName === "复仇者联盟2：奥创纪元") return "US";
        if (movieName === "黑豹") return "US";
        if (movieName === "死侍与金刚狼") return "US";
        if (movieName === "星球大战8：最后的绝地武士") return "US";
        if (movieName === "侏罗纪世界2") return "US";
        if (movieName === "冰雪奇缘") return "US";
        if (movieName === "钢铁侠3") return "US";
        if (movieName === "美女与野兽") return "US";
        if (movieName === "超人总动员2") return "US";
        if (movieName === "速度与激情8") return "US";
        if (movieName === "小黄人大眼萌") return "US";
        if (movieName === "美国队长3") return "US";
        
        return "US"; // 默认美国
    }

    // 生成国旗图片 URL
    getCountryFlagUrl(countryCode) {
        // 如果是多个国家，用逗号分隔
        return countryCode.split(',').map(code => 
            `https://flagcdn.com/24x18/${code.toLowerCase()}.png`
        );
    }

    // 从猫眼获取所有票房数据
    async getAllMovies() {
        try {
            const response = await fetch('/api/boxoffice');
            const data = await response.json();
            
            if (data.success && data.data && data.data.list) {
                // 保存汇率信息
                const rateInfo = data.data.tips.match(/汇率采用.*人民币/)[0];
                this.exchangeRateInfo = `注：票房数据来自猫眼电影。内地票房数据实时更新，包括点映及预售票房。港澳台及海外票房为统计数据，每小时更新。\n${rateInfo}`;
                
                // 获取汇率值
                const rateMatch = data.data.tips.match(/1美元≈([\d.]+)人民币/);
                const exchangeRate = rateMatch ? parseFloat(rateMatch[1]) : 7.2514;
                
                // 转换所有电影数据，保持猫眼的排序顺序
                const movies = data.data.list.map(movie => {
                    const countryCode = this.getCountryCode(movie.movieName);
                    return {
                        id: movie.movieId,
                        title: movie.movieName,
                        releaseYear: movie.releaseTime,
                        boxOfficeRMB: movie.rawValue,
                        boxOfficeUSD: Math.floor(movie.rawValue / exchangeRate),
                        isDynamic: movie.movieName === "哪吒之魔童闹海",
                        countryCode: countryCode,
                        flagUrls: this.getCountryFlagUrl(countryCode)
                    };
                });

                return {
                    movies: movies, // 直接使用猫眼的排序，移除 sort
                    exchangeRateInfo: this.exchangeRateInfo
                };
            }
            
            throw new Error('获取票房数据失败');
            
        } catch (error) {
            console.error('获取票房数据失败:', error);
            // 如果API请求失败，返回空数组
            return {
                movies: [],
                exchangeRateInfo: "数据加载失败"
            };
        }
    }
} 