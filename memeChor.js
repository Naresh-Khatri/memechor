import fs from "fs";

export default function chor() {
  return new Promise(async (resolve, reject) => {
    try {
      let posts = await fs.promises.readFile("./dailyPosts.json", "utf-8");
      posts = JSON.parse(posts);
      let i;
      for (i = 0; i < posts.length; i++) {
        if (posts[i].posted === false) {
          posts[i].posted = true;
          await fs.promises.writeFile(
            "./dailyPosts.json",
            JSON.stringify(posts)
          );
          resolve(posts[i]);
          break;
        }
      }
      if (i === posts.length) {
        reject("no new memes");
        return;
      }
    } catch (err) {
      reject("error reading dailyPosts.json: ", err);
    }
  });
}
