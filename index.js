import { IgApiClient } from "instagram-private-api";
import { scheduleJob } from "node-schedule";
import "dotenv/config";

import chor from "./memeChor.js";
import getImgBuffer from "./getImgBuffer.js";

async function main() {
  try {
    const ig = new IgApiClient();
    ig.state.generateDevice(process.env.IG_USERNAME);

    const loggedInUser = await ig.account.login(
      process.env.IG_USERNAME,
      process.env.IG_PASSWORD
    );
    console.log("login successful!");

    //call chor to get a random post
    const post = await chor();
    console.log("post: ", post);

    //public chori ka meme
    const publishResult = await ig.publish.photo({
      file: await getImgBuffer(post.photoURL),
      caption: post.caption,
    });
    console.log(publishResult);
  } catch (err) {
    console.log(err);
  }
}

scheduleJob("* * * * *", main);
