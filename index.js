const { Telegraf } = require('telegraf')
const {
  Extra,
  Markup,
  Stage,
  session
} = Telegraf
const config = require('./config/default.json');

const bot = new Telegraf(config.token);
const SceneGenerator = require('./Scenes');
const curScene = new SceneGenerator();
const greetingScene = curScene.greetingScene();
const confessionScene = curScene.confessionScene();
const getSongsScene = curScene.getSongScene();
const recomendAnimeGlassScene = curScene.recomendAnimeGlassScene();
const recomendMangaGlassScene = curScene.recomendMangaGlassScene();
const stickers = require('./stickers');
const values = Object.values(stickers);
const messages = require('./messages');
const getGlass = require('./getGlass');
const mess = Object.values(messages);
const stage = new Stage([greetingScene, confessionScene, getSongsScene, recomendAnimeGlassScene, recomendMangaGlassScene]);

bot.use(session())
bot.use(stage.middleware())

bot.start(async (ctx) => {
  await ctx.reply('Welcome, stranger');
  await ctx.scene.enter('name');
});
bot.on('sticker', (ctx) => bot.telegram.sendSticker(ctx.message.chat.id, values[parseInt(Math.random() * values.length)]));

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

bot.action('getSongsScene', async (ctx) => {
  await ctx.scene.enter('song');
});

bot.action('recomendAnimeGlass', async (ctx) => {
  await ctx.scene.enter('anime');
});

bot.action('recomendMangaGlassScene', async (ctx) => {
  await ctx.scene.enter('manga');
});

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
bot.hears('hi', (ctx) => ctx.reply('Hey there'));
bot.hears('Why', (ctx) => ctx.reply('Because its funny'));
bot.hears('Почему', (ctx) => ctx.reply('Because its funny'));
bot.on('message', (ctx) => ctx.reply(mess[parseInt(Math.random() * mess.length)]));
bot.launch()
