Depois de dar o clone no projeto, acesse a pasta do bot e digite:

#npm i

depois crie um arquivo chamado config.js

exports.config = {
    TOKEN: 'YOUR_TOKEN', 
    URL_TEMPO: `https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='*nome_municipio*')&format=json`,
    NUDES: 'medias/nudes.jpg',
    GEMIDAO: 'medias/gemidao.mp3'
}

depois é so executar e procurar o bot que criou no telegram

#npm run dev (nodemon)
#npm run production (pm2)

