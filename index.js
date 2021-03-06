/**
* Main file.
* Connecting all files and modules used.
* Creating an instance of the bot class.
* @author V1ns3nt0
*/

const { Telegraf } = require('telegraf')
const {
  Extra,
  Markup,
  Stage,
  session
} = Telegraf
const config = require('./config/default.json');
const stickers = require('./stickers');
const SceneGenerator = require('./Scenes');
const messages = require('./messages');
const getGlass = require('./getGlass');

const mess = Object.values(messages);
const values = Object.values(stickers);

const bot = new Telegraf(config.token);



/**
* Registering all the scenes.
* Enabling sessions and middleware to work with them.
* @author V1ns3nt0
*/

const curScene = new SceneGenerator();
const greetingScene = curScene.greetingScene();
const confessionScene = curScene.confessionScene();
const getSongsScene = curScene.getSongScene();
const recomendAnimeGlassScene = curScene.recomendAnimeGlassScene();
const recomendMangaGlassScene = curScene.recomendMangaGlassScene();

const stage = new Stage([greetingScene, confessionScene, getSongsScene, recomendAnimeGlassScene, recomendMangaGlassScene]);

bot.use(session())
bot.use(stage.middleware())



/**
* This handler is triggered when the bot is launched.
* From it, the user gets to the greeting scene, and then to the confession scene.
* @author V1ns3nt0
*/

bot.start(async (ctx) => {
  await ctx.reply('Welcome, stranger');
  await ctx.scene.enter('name');
});



/**
* This handler is triggered when the user sends a command /help.
* It displays a message and a special keyboard with buttons that launch a scene
* corresponding to the command that the user has selected.
* @author V1ns3nt0
*/

bot.help((ctx) => {
  return ctx.reply(`I was called the master of the glass factory for a reason. Press any of the buttons and i'll give you an advice.
Young ${ctx.from.first_name}, you can also send me a sticker or we can just have a little talk.`,
  Markup.inlineKeyboard([
    [Markup.callbackButton("Search a song", 'getSongsScene')],
    [Markup.callbackButton("Recommend an anime glass", "recomendAnimeGlass")],
    [Markup.callbackButton("Recommend a manga glass", "recomendMangaGlassScene")]
  ]).extra()
  );
});



/**
* This handler is responsible for the event when the user sends a sticker.
* In this case, the bot sends a random sticker from the file stickers.json in response.
* @author V1ns3nt0
*/

bot.on('sticker', (ctx) => bot.telegram.sendSticker(ctx.message.chat.id, values[parseInt(Math.random() * values.length)]));



/**
* This handler is triggered when the user clicks the "Search a song" button
* from the suggested keyboard in the command /help, and calls the corresponding scene.
* @author V1ns3nt0
*/

bot.action('getSongsScene', async (ctx) => {
  await ctx.scene.enter('song');
});



/**
* This handler is triggered when the user clicks the "Recommend an anime glass"
* button from the suggested keyboard in the command /help, and calls the corresponding scene.
* @author V1ns3nt0
*/

bot.action('recomendAnimeGlass', async (ctx) => {
  await ctx.scene.enter('anime');
});



/**
* This handler is triggered when the user clicks the "Recommend a manga glass"
* button from the suggested keyboard in the command /help, and calls the corresponding scene.
* @author V1ns3nt0
*/

bot.action('recomendMangaGlassScene', async (ctx) => {
  await ctx.scene.enter('manga');
});



/**
* This handler is triggered after clicking on one of the special keyboard
* buttons from the "anime" scene. The name of the action is parsed, where we
* find out what genre the user has chosen. After that, we make a request to the
* API using the "recomendGlass" function from the file getGlass.js. We get
* a response, select a random element, and send it to the user. Leaving the stage.
* @author V1ns3nt0
*/

bot.action(/recomend_anime*/, async (ctx) => {
  let params = ctx.update.callback_query.data.split('_');
  await ctx.reply('I need some time for thinking recomendations for you.');
  getGlass.recomendGlass(params[1], params[2]).then(async res => {
    await ctx.reply('Please wait');
    let ranime = res.anime[Math.floor(Math.random() * res.anime.length)];
    await ctx.reply('Almost finish...');
    let message = `Title: ${ranime.title}.
Synopsis: ${ranime.synopsis}
Link: ${ranime.url} \n\n`
    ctx.reply(`I found something. \n ${message}`);
  });
  await ctx.scene.leave();
});



/**
* This handler is triggered after clicking on one of the special keyboard
* buttons from the "manga" scene. The name of the action is parsed, where we
* find out what genre the user has chosen. After that, we make a request to the
* API using the "recomendGlass" function from the file getGlass.js. We get
* a response, select a random element, and send it to the user. Leaving the stage.
* @author V1ns3nt0
*/

bot.action(/recomend_manga*/, async (ctx) => {
  let params = ctx.update.callback_query.data.split('_');
  await ctx.reply('I need some time for thinking recomendations for you.');
  getGlass.recomendGlass(params[1], params[2]).then(async res => {
    await ctx.reply('Please wait');
    let rmanga = res.manga[Math.floor(Math.random() * res.manga.length)];
    await ctx.reply('Almost finish...');
    let message = `Title: ${rmanga.title}.
Synopsis: ${rmanga.synopsis}
Link: ${rmanga.url} \n\n`
    ctx.reply(`I found something. \n ${message}`);
  });
  await ctx.scene.leave();
});



/**
* These handlers are triggered when the user sends a specific keyword.
* @author V1ns3nt0
*/

bot.hears('hi', (ctx) => ctx.reply('Hey there'));
bot.hears('Why', (ctx) => ctx.reply('Because its funny'));
bot.hears('Почему', (ctx) => ctx.reply('Because its funny'));



/**
* This handler is responsible for the event when the user sends any message.
* In this case, the bot sends a random phrase from the file messages.json in response.
* @author V1ns3nt0
*/

bot.on('message', (ctx) => ctx.reply(mess[parseInt(Math.random() * mess.length)]));

bot.launch()
