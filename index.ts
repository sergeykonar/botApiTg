import TelegramBot from 'node-telegram-bot-api';

// replace the value below with the Telegram token you receive from @BotFather
const token: string = '6562462799:AAERQfeKeAd_wjBekNYWJwFyvuiaHqBYM6U';

const url = "https://tranquil-selkie-6cdd3c.netlify.app/"

import express, { Request, Response, response } from "express";
import dotenv from "dotenv";
import { request } from 'http';


dotenv.config();
const app = express();

app.use(express.json())

const PORT = process.env.PORT;

app.get("/", (request, response) => { 
  response.status(200).send("Hello World");
}); 

app.post("/send", async (request, response) => {
  const {queryId, text} = request.body;
  
  await bot.answerWebAppQuery(queryId, {
    type: 'article',
    id: queryId,
    title: "Success",
    input_message_content: {
      message_text: "Ура"
    }
  })
  return response.status(200)
})

app.listen(PORT, () => { 
  console.log("Server running at PORT: ", PORT); 
}).on("error", (error) => {
  // gracefully handle error
  throw new Error(error.message);
})

// Create a bot that uses 'polling' to fetch new updates
const bot: TelegramBot = new TelegramBot(token, { polling: true });

const inlineKeyboard = {
  keyboard: [
      [
          {
              text: 'Open Web App',
              web_app: {
                  url: url
              }
          }
      ],
      [
        {
          text: 'Open Web App',
          web_app: {
              url: url
          }
      }
      ]
  ]
};

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg: TelegramBot.Message, match: RegExpExecArray | null) => {
  if (!match) return;

  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId: number = msg.chat.id;
  const resp: string = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of messages.
bot.on('message', (msg: TelegramBot.Message) => {
  const chatId: number = msg.chat.id;
  console.log(msg)
  // send a message to the chat acknowledging receipt of their message
  if (msg.text == "/start") {
      bot.sendMessage(chatId, "Click the button below to open the web app:", {
          reply_markup: inlineKeyboard
      });
  } else if (msg.web_app_data?.data != null){
    let text = `Searching for ${msg.web_app_data?.data!}`
    bot.sendMessage(chatId, `${text}\nFound ${msg.web_app_data.data.length} items`)
  }
});