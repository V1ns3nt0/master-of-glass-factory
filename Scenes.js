/**
* File with all scenes.
* Connecting all files and modules used.
* Declaring arrays with different responses for different answers.
* @author V1ns3nt0
*/

const Scene = require('telegraf/scenes/base');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const stickers = require('./stickers');
const getSongs = require('./getSong');


let arrGreeting = [
  "Good name,", "Nice to meet you,", "I feel in your name an unbridled power and will to live,",
  "Hmm, I think that's a good name for you,",
];
let arrRejectGreet = [
  "I won't continue the conversation until you introduce yourself", "You've come all this way just to be quiet. Well, go ahead",
];

let confessionCheck = ['yes', 'of course', 'yup', 'да', 'конечно', 'ага'];
let confessionTrue = [
  "Ha-Ha-Ha! I knew I was right about you!", "Keep it up, my young friend",
  "Subarashii!",
];
let confessionReject = [
  "I think you need to think about your answer", "MMM, are you sure?",
  `You know, I think you made a mistake, so you wrote something other than "Yes"`
];



/**
* The main class is the scene generator.
* @author V1ns3nt0
*/

class SceneGenerator {

  /**
  * This is the very first scene that starts when the bot starts.
  * In it, the user must enter their name. And until he does, he can't go any further
  * From this scene, the user immediately goes to the confession scene
  * @return {name}
  * @author V1ns3nt0
  */

  greetingScene() {
    const name = new Scene('name');
    name.enter((ctx) => ctx.reply('Can you introduce yourself? What can I call you?'));
    name.on('text', async (ctx) => {
        const name = ctx.message.text;
        if (name && typeof name === 'string') {
            await ctx.reply(`${arrGreeting[Math.floor(Math.random() * arrGreeting.length)]} ${name}`);
            await ctx.reply(`Ha-ha, good trying, ${ctx.from.first_name}! I like you, you know!`);
            await ctx.reply(`Ahem... Okay, let's continue our conversation. I need to ask you something very important, ${ctx.from.first_name}.`);
            await ctx.reply(`This question will decide your future, so think carefully before you answer me.`);
            await ctx.reply(`Okey. Are you ready?`);
            ctx.scene.enter('confession');
        } else {
            await ctx.reply(`${arrRejectGreet[Math.floor(Math.random() * arrRejectGreet.length)]}`);
            await ctx.scene.reenter();
        }
    });
    name.on('sticker', (ctx) => ctx.reply(`${arrRejectGreet[Math.floor(Math.random() * arrRejectGreet.length)]}`));
    return name;
  }



  /**
  * This is the second scene. It asks the user a question. And he can't get out
  * of it until he says Yes. Different response options are allowed. They are
  * specified in the "confessionCheck" array.
  * @return {confession}
  * @author V1ns3nt0
  */

  confessionScene() {
    const confession = new Scene('confession');
    confession.enter( async (ctx) => {
      await ctx.reply(`Do you like Asian culture? Do you watch anime or read manga?`);
      await ctx.reply(`The answer is either "Yes" or " No"`);
    });
    confession.on('text', async (ctx) => {
        const confession = ctx.message.text;
        if (confession && confessionCheck.includes(confession.toLowerCase())) {
          await ctx.reply(`${confessionTrue[Math.floor(Math.random() * confessionTrue.length)]}`);
          await ctx.reply(`Good job, ${ctx.from.first_name}! You have been initiated and can now proudly bear the title of my friend, disciple and listener!`);
          await ctx.reply(`Send /help to make sure of my skill`);
          await ctx.scene.leave();
        } else {
          await ctx.reply(`${confessionReject[Math.floor(Math.random() * confessionReject.length)]}`);
          await ctx.scene.reenter();
        }
    });
    confession.on('sticker', (ctx) => ctx.reply(`${confessionReject[Math.floor(Math.random() * confessionReject.length)]}`));
    return confession;
  }



  /**
  * The user clicks on the "Search a song" button and gets into this scene.
  * They are asked to enter the name of the song or artist. After that, a request
  * is made to the API using the "searchSong" function from the file getSong.js.
  * The received response is formed as a list and sent back to the user.
  * @return {song}
  * @author V1ns3nt0
  */

  getSongScene() {
    const song = new Scene('song');
    song.enter((ctx) => ctx.reply(`Write name or artist of the song and i give you an answer`));
    song.on('text', async (ctx) => {
      const song = ctx.message.text;
      if (song) {
        await ctx.reply('Hmm, wakarimasu. Give me a few seconds');
        getSongs.searchSong(song).then(res => {
          if (res.data.length == 0) {
              ctx.reply('Nothig');
          } else {
            let message = ``;
            res.data.forEach((item, i) => {
              message = message + `${i+1}.) Title: ${item.title}. Artist: ${item.artist.name}
Link: ${item.link} \n\n`;
            });
            ctx.reply(`I found something. \n ${message}`);
          }
        });
        await ctx.scene.leave();
      } else {
        await ctx.reply('I dond understand');
        await ctx.scene.reenter();
      }
    });
    song.on('sticker', (ctx) => ctx.reply('You ask me for a favor, but you do it without respect.'));
    return song;
  }



  /**
  * The user clicks on the "Recommend an anime glass" button and gets into this scene.
  * Next, the user is asked to select a genre by clicking on one of the buttons.
  * Then the "recommend_anime*" handler is launched from the main index.js file.
  * @return {anime}
  * @author V1ns3nt0
  */

  recomendAnimeGlassScene() {
    const anime = new Scene('anime');
    anime.enter((ctx) => {
      return ctx.reply('Choose a genre',
      Markup.inlineKeyboard([
        [Markup.callbackButton("Action", "recomend_anime_1"),
        Markup.callbackButton("Adventure", "recomend_anime_2"),
        Markup.callbackButton("Comedy", "recomend_anime_4")],
        [Markup.callbackButton("Mystery", "recomend_anime_7"),
        Markup.callbackButton("Drama", "recomend_anime_8"),
        Markup.callbackButton("Fantasy", "recomend_anime_10")],
        [Markup.callbackButton("Game", "recomend_anime_11"),
        Markup.callbackButton("Historical", "recomend_anime_13"),
        Markup.callbackButton("Horror", "recomend_anime_14")],
        [Markup.callbackButton("Magic", "recomend_anime_16"),
        Markup.callbackButton("Music", "recomend_anime_19"),
        Markup.callbackButton("Romance", "recomend_anime_22")],
        [Markup.callbackButton("Shounen", "recomend_anime_27"),
        Markup.callbackButton("Psychological", "recomend_anime_40"),
        Markup.callbackButton("Thriller", "recomend_anime_41")],
      ]).extra()
    );
    });
    return anime;
  }



  /**
  * The user clicks on the "Recommend a manga glass" button and gets into this scene.
  * Next, the user is asked to select a genre by clicking on one of the buttons.
  * Then the "recommend_manga*" handler is launched from the main index.js file.
  * @return {manga}
  * @author V1ns3nt0
  */

  recomendMangaGlassScene() {
    const manga = new Scene('manga');
    manga.enter((ctx) => {
      return ctx.reply('Choose a genre',
      Markup.inlineKeyboard([
        [Markup.callbackButton("Action", "recomend_manga_1"),
        Markup.callbackButton("Adventure", "recomend_manga_2"),
        Markup.callbackButton("Comedy", "recomend_manga_4")],
        [Markup.callbackButton("Mystery", "recomend_manga_7"),
        Markup.callbackButton("Drama", "recomend_manga_8"),
        Markup.callbackButton("Fantasy", "recomend_manga_10")],
        [Markup.callbackButton("Game", "recomend_manga_11"),
        Markup.callbackButton("Historical", "recomend_manga_13"),
        Markup.callbackButton("Horror", "recomend_manga_14")],
        [Markup.callbackButton("Magic", "recomend_manga_16"),
        Markup.callbackButton("Music", "recomend_manga_19"),
        Markup.callbackButton("Romance", "recomend_manga_22")],
        [Markup.callbackButton("Shounen", "recomend_manga_27"),
        Markup.callbackButton("Psychological", "recomend_manga_40"),
        Markup.callbackButton("Thriller", "recomend_manga_45")],
      ]).extra()
    );
    });
    return manga;
  }
}

module.exports = SceneGenerator
