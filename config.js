const { TOKEN_KEY } = require('./token')

exports.config = {
    TOKEN: TOKEN_KEY,
    URL_TEMPO: `https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='*nome_municipio*')&format=json`,
    NUDES: 'medias/nudes.jpg',
    GEMIDAO: 'medias/gemidao.mp3',
    FILHO: 'medias/filho.jpg'
}