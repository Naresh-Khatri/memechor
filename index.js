import { IgApiClient } from "instagram-private-api";
import { scheduleJob } from "node-schedule";
import "dotenv/config";

import chor from "./memeChor.js";
import getImgBuffer from "./getImgBuffer.js";
import getDailyMemes from "./getDailyMemes.js";
import { getRandomTagsString } from "./utils.js";

//login to instagram
const ig = new IgApiClient();
ig.state.generateDevice(process.env.IG_USERNAME);

const loggedInUser = await ig.account.login(
  process.env.IG_USERNAME,
  process.env.IG_PASSWORD
);
console.log("login successful!🔐");

async function main() {
  try {
    //call chor to get a random post
    const post = await chor();
    console.log("post: ", post);

    let publishResult = null;
    // publish chori ka meme
    publishResult = await ig.publish.photo({
      file: await getImgBuffer(post.photoURL),
      caption: `${post.caption}\n.\n.\nOriginal post: ${
        post.link
      }\n.\n.\n${getRandomTagsString(30)}`,
    });
    if (publishResult.status === "ok") {
      console.log("Published post✅");
    }

    // const story = await chor();
    // console.log("story: ", story);

    //publish chori ka meme as a story
    // publishResult = await ig.publish.story({
    //   file: await getImgBuffer(post.photoURL),
    //   // caption: post.caption,
    // });
    // if (publishResult.status === "ok") {
    //   console.log("Published story✅");
    // }
  } catch (err) {
    console.log(err);
  }
}
// for (let i = 0; i < 20; i++) {
main();
// }

scheduleJob("*/30 * * * *", main);
scheduleJob("0 0 * * *", getDailyMemes());
