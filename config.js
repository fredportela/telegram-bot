const { TOKEN_KEY, API_TOKEN } = require('./token')

exports.config = {
    TOKEN: TOKEN_KEY,
    URL_TEMPO: `http://api.openweathermap.org/data/2.5/weather?q=*nome_municipio*&appid=${API_TOKEN}&lang=pt_br&units=metric`,
    NUDES: 'medias/nudes.jpg',
    GEMIDAO: 'medias/gemidao.mp3',
    FILHO: 'medias/filho.jpg'
}
