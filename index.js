import { IgApiClient } from "instagram-private-api";
import { scheduleJob } from "node-schedule";
import "dotenv/config";

import chor from "./memeChor.js";
import getImgBuffer from "./getImgBuffer.js";

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

    let publishResult = null
    //publish chori ka meme
    publishResult = await ig.publish.photo({
      file: await getImgBuffer(post.photoURL),
      // caption: post.caption,
    });
    if (publishResult.status === "ok") {
      console.log("Published post✅");
    }

    //call chor to get a random post
    const story = await chor();
    console.log("story: ", story);

    //publish chori ka meme as a story
    publishResult = await ig.publish.story({
      file: await getImgBuffer(post.photoURL),
      // caption: post.caption,
    });
    if (publishResult.status === "ok") {
      console.log("Published story✅");
    }
  } catch (err) {
    console.log(err);
  }
}
main();

scheduleJob("*/30 * * * *", main);
