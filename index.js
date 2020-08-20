const TelegramBot = require('node-telegram-bot-api')
require('dotenv').config()
const request = require('request')
const promise = require('request-promise')
const moment = require('moment')
const { config } = require('./config.js')

const TelegramBaseController = TelegramBot.TelegramBaseController
const TextCommand = TelegramBot.TextCommand
const bot = new TelegramBot( config.TOKEN, { polling: true } )

bot.on('message', function(msg, match) {
  console.log(msg)
});

bot.onText( /\/echo (.+)/ig, (msg, match) => sendEcho(msg, match));
bot.onText(/\/help|\/start/ig, (msg, match) => sendHelp(msg, match));
bot.onText( /\/gemidao/ig, sendGemidao);
bot.onText( /\/nudes/ig, sendNudes);
bot.onText( /\/tempo (.+)/ig, (msg, match) => sendTempoCidade(msg, match));

bot.onText(/oi|ola|oie/ig, (msg, match) => sendOi(msg, match));
bot.onText(/(.*)eu estou(.*)|(.*)eu me sinto(.*)/ig, (msg, match) => sendSimpatia(msg, match));

bot.onText(/(.*)seu nome(.*)|(.*)como se chama(.*)/ig, (msg, match) => sendMeuNome(msg, match));
bot.onText(/(.*)meu nome(.*)|(.*)como eu(.*)chamo(.*)/ig, (msg, match) => sendSeuNome(msg, match));
bot.onText(/(.*)nudes(.*)|(.*)foto nua(.*)|(.*)pelado(.*)/ig, sendNudes);
bot.onText(/(.*)ouvir(.*)voz(.*)|(.*)sua(.*)voz/ig, sendGemidao);
bot.onText(/(.*)foto(.*)|(.*)self(.*)/ig, sendFoto);
bot.onText(/(.*)bom dia(.*)/ig, (msg, match) => sendBomDia(msg, match));
bot.onText(/(.*)boa tarde(.*)/ig, (msg, match) => sendBoaTarde(msg, match));
bot.onText(/(.*)boa noite(.*)/ig, (msg, match) => sendBoaNoite(msg, match));

bot.onText(/(.*)como(.*)tempo|(.*)tempo(.*)hoje(.*)/ig, (msg, match) => sendTempoMinhaCidade(msg, match));
bot.onText(/(.*)sua idade(.*)|(.*)quantos anos(.*)/ig, (msg, match) => minhaIdade(msg, match));
bot.onText(/(.*)tem(.*)filho(.*)|(.*)você(.*)filho(.*)|(.*)possui(.*)filho(.*)/ig, (msg, match) => temFilho(msg, match));

var sendHelp = function (msg) {
  let mensagem = `Comandos:\n`;
  mensagem += `\n/nudes`;
  mensagem += `\n/gemidao`;
  mensagem += `\n/tempo 'nome da cidade,uf'`;

  bot.sendMessage(msg.chat.id, mensagem)
}

var retornaTempoCidade = function(cidade){
  const url_previsao = config.URL_TEMPO.replace('*nome_municipio*', cidade)
  var options = { method: 'GET', uri: url_previsao, body: { some: 'payload' }, json: true };
  return promise(options);
}

var sendTempoCidade = function(msg, match){
  const cidade = match[1]
  retornaTempoCidade(cidade).then(function(tempo_json){
    const canal = tempo_json;
    const descricao = canal.weather[0].description;
  
    var mensagem = canal.name+'/'+canal.sys.country;
    mensagem += " com "+ canal.main.humidity +'% de humidade'
    mensagem += `\nTemperatura atual: ${canal.main.temp}ºC`
    mensagem += `\nMínima: ${canal.main.temp_min}ºC`
    mensagem += `\nMáxima: ${canal.main.temp_max}ºC`
  
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

function sendGemidao(msg) {
  const audio = `${__dirname}/${config.GEMIDAO}`;
  bot.sendAudio(msg.chat.id, audio, { title: 'audio', caption: 'minha voz'});  
}

function sendNudes(msg) {
  const photo = `${__dirname}/${config.NUDES}`;
  bot.sendPhoto(msg.chat.id, photo, { caption: "Meu nudes!"});
}

function temFilho(msg, match){
  const photo = `${__dirname}/${config.FILHO}`;
  bot.sendMessage(msg.chat.id, `Eu tenho filho sim! O nome dele é Bote Shot`)
  bot.sendPhoto(msg.chat.id, photo, { caption: "Meu filho!" });
}
function sendFoto(msg) {
  const photo = `${__dirname}/${config.NUDES}`;
  bot.sendPhoto(msg.chat.id, photo, { caption: "Minha Foto!"});
}

var sendBomDia = function (msg, match) {
  bot.sendMessage(msg.chat.id, `Bom Dia ${msg.chat.first_name}!`)
}

var sendBoaTarde = function (msg, match) {
  bot.sendMessage(msg.chat.id, `Boa Tarde ${msg.chat.first_name}!`)
}

var sendBoaNoite = function (msg, match) {
  bot.sendMessage(msg.chat.id, `Boa Noite ${msg.chat.first_name}!`)
}

var sendEcho = function(msg, match){
  bot.sendMessage( msg.chat.id, match[ 1 ] )
}

var sendTempoMinhaCidade = function(msg, match){

  retornaTempoCidade('Brasilia,DF').then(function(tempo_json){
    const canal = tempo_json;
    const descricao = canal.weather[0].description;
  
    var mensagem = `Aqui em ${canal.name}/${canal.sys.country} onde eu moro`
    mensagem += ` a Temperatura atual esta em ${canal.main.temp}ºC`
    mensagem += ` com Mínima prevista de ${canal.main.temp_min}ºC`
    mensagem += ` e Máxima de ${canal.main.temp_max}ºC`
    
    bot.sendMessage( msg.chat.id, mensagem)
  }).catch(function (err) {
    bot.sendMessage( msg.chat.id, `Previsão do tempo para 'Brasilia,DF' não encontrada!`)
  });
}

var diaAtual = function (msg, match) {
  let diaAtual = new Date(msg.date);
  bot.sendMessage(msg.chat.id, `Hoje é dia ${diaAtual}`)
}

var minhaIdade = function (msg, match){  
  let dataInicial = moment(new Date('2/27/2018'), 'DD/MM/YYYY')
  let dataAtual = moment(new Date(msg.date*1000), 'DD/MM/YYYY')
  let anos = moment(dataAtual).diff(dataInicial, 'years')
  let mes = moment(dataAtual).diff(dataInicial, 'months')
  let dias = moment(dataAtual).diff(dataInicial, 'days')
  let idade = 0;

  if (anos > 0){
    idade = `${years} ${(years > 1 ? 'anos' : 'ano')}`
  }else{
    if (mes > 0) {
      idade = `${mes} ${mes > 1 ? 'meses' : 'mês'}`
    }else{
      idade = `${dias} ${dias > 1 ? 'dias' : 'dia'}`
    }
  }
  
  bot.sendMessage(msg.chat.id, `Eu tenho ${idade}!`)
}
