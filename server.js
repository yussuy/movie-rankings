const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

// 增强调试日志
app.use((req, res, next) => {
    console.log('Request URL:', req.url);
    console.log('Request Headers:', req.headers);
    next();
});

// 配置静态文件目录
app.use('/', express.static(path.join(__dirname)));

// 代理接口
app.get('/api/boxoffice', async (req, res) => {
    try {
        console.log('开始请求猫眼 API...');
        const response = await axios.get('https://piaofang.maoyan.com/i/api/rank/globalBox/historyRankList?WuKongReady=h5', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'zh-CN,zh;q=0.9',
                'Connection': 'keep-alive',
                'Cookie': 'WuKongReady=h5'
            },
            timeout: 10000
        });
        console.log('猫眼 API 响应状态:', response.status);
        res.json(response.data);
    } catch (error) {
        console.error('代理请求失败详细信息:');
        console.error('错误消息:', error.message);
        if (error.response) {
            console.error('错误响应状态:', error.response.status);
            console.error('错误响应头:', error.response.headers);
            console.error('错误响应数据:', error.response.data);
        }
        res.status(500).json({ 
            error: '获取数据失败', 
            message: error.message,
            details: error.response ? error.response.data : null
        });
    }
});

// 添加错误处理中间件
app.use((err, req, res, next) => {
    console.error('服务器错误:', err);
    res.status(500).send('Server Error');
});

// 修改监听配置，监听所有 IP
app.listen(3000, '0.0.0.0', () => {
    console.log('服务器运行在 http://0.0.0.0:3000');
    console.log('静态文件目录:', path.join(__dirname));
}); 