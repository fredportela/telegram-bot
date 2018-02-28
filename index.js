const TelegramBot = require( 'node-telegram-bot-api' )
const request = require('request')
const promise = require('request-promise')

const { config } = require('./config.js')

const bot = new TelegramBot( config.TOKEN, { polling: true } )

bot.onText( /\/echo (.+)/, (msg, match) => sendEcho(msg, match));
bot.onText( /\/gemidao/, sendGemidao);
bot.onText(/\/help/, (msg, match) => sendHelp(msg, match));
bot.onText( /\/nudes/, sendNudes);
bot.onText( /\/tempo (.+)/, (msg, match) => sendTempoCidade(msg, match));

bot.onText( /(.*)como(.*)tempo|(.*)tempo(.*)hoje(.*)/, (msg, match) => sendTempoMinhaCidade(msg, match));

bot.onText(/oi|ola|oie/, (msg, match) => sendOi(msg, match));
bot.onText(/(.*)eu estou(.*)|(.*)eu me sinto(.*)/, (msg, match) => sendSimpatia(msg, match));

bot.onText(/(.*)seu nome(.*)|(.*)como se chama(.*)/, (msg, match) => sendMeuNome(msg, match));
bot.onText(/(.*)meu nome(.*)|(.*)como eu(.*)chamo(.*)/, (msg, match) => sendSeuNome(msg, match));
bot.onText(/(.*)nudes(.*)|(.*)foto nua(.*)|(.*)pelado(.*)/, sendNudes);
bot.onText(/(.*)ouvir(.*)voz(.*)|(.*)sua(.*)voz/, sendGemidao);
bot.onText(/(.*)foto(.*)|(.*)self(.*)/, sendFoto);

var retornaTempoCidade = function(cidade){
  const url_previsao = config.URL_TEMPO.replace('*nome_municipio*', cidade)
  var options = { method: 'GET', uri: url_previsao, body: { some: 'payload' }, json: true };

  return promise(options);
}

var sendTempoCidade = function(msg, match){
  const cidade = match[1]
  retornaTempoCidade(cidade).then(function(tempo_json){
    const canal = tempo_json.query.results.channel;
    const location = canal.location;
    const atmosfera = canal.atmosphere;
    const condicao = canal.item.condition;
    const previsao = canal.item.forecast;
    const descricao = canal.item.description;
  
    var mensagem = location.city+'/'+location.region;
    mensagem += " com "+ atmosfera.humidity +'% de humidade'
    mensagem += `\nTemperatura atual: ${Math.round((Number(condicao.temp)/2.866),2)}ºC`
    mensagem += `\nMínima: ${Math.round((Number(previsao[0].low)/2.866),2)}ºC`
    mensagem += `\nMáxima: ${Math.round((Number(previsao[0].high)/2.866),2)}ºC`
  
    bot.sendMessage( msg.chat.id, mensagem)
  }).catch(function (err) {
    bot.sendMessage( msg.chat.id, `Previsão do tempo para '${cidade}' não encontrada!`)
  });
}

var sendOi = function(msg){
  bot.sendMessage( msg.chat.id, `Olá ${msg.chat.first_name}! Como você está?`)
};

var sendSimpatia = function(msg){
  bot.sendMessage( msg.chat.id, `Que bom que vc se sente bem!`)
};

var sendMeuNome = function(msg, match){
  bot.sendMessage(msg.chat.id, `${msg.chat.first_name}, meu nome é Bote Cachaça!`)
}

var sendSeuNome = function(msg, match){
  bot.sendMessage(msg.chat.id, `Seu nome é ${msg.chat.first_name} ${msg.chat.last_name}, mais todos te chamam de ${msg.chat.username}!`)
}

var sendHelp = function(msg){
  let mensagem = "Comandos\n";
  mensagem += "/nudes/\n";
  mensagem += "/tempo cidade,uf\n";
  bot.sendMessage(msg.chat.id, mensagem)
}

function sendGemidao(msg) {
  const audio = `${__dirname}/${config.GEMIDAO}`;
  bot.sendAudio(msg.chat.id, audio, { title: 'audio', caption: 'minha voz'});  
}

function sendNudes(msg) {
  const photo = `${__dirname}/${config.NUDES}`;
  bot.sendPhoto(msg.chat.id, photo, { caption: "Meu nudes!"});
}

function sendFoto(msg) {
  const photo = `${__dirname}/${config.NUDES}`;
  bot.sendPhoto(msg.chat.id, photo, { caption: "Minha Foto!"});
}

var sendEcho = function(msg, match){
  bot.sendMessage( msg.chat.id, match[ 1 ] )
}

var sendTempoMinhaCidade = function(msg, match){
  retornaTempoCidade('Brasilia,DF').then(function(tempo_json){
    const canal = tempo_json.query.results.channel;
    const location = canal.location;
    const atmosfera = canal.atmosphere;
    const condicao = canal.item.condition;
    const previsao = canal.item.forecast;
    const descricao = canal.item.description;
  
    var mensagem = `Aqui em ${location.city}/${location.region} onde eu moro`
    mensagem += ` a Temperatura atual esta em ${Math.round((Number(condicao.temp)/2.866),2)}ºC`
    mensagem += ` com Mínima prevista de ${Math.round((Number(previsao[0].low)/2.866),2)}ºC`
    mensagem += ` e Máxima de ${Math.round((Number(previsao[0].high)/2.866),2)}ºC`
  
    bot.sendMessage( msg.chat.id, mensagem)
  }).catch(function (err) {
    bot.sendMessage( msg.chat.id, `Previsão do tempo para '${cidade}' não encontrada!`)
  });
}


