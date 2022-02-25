import axios from "axios";
import fs from "fs";

export default async function getDailyMemes() {
  let res = await axios.get(
    "https://www.reddit.com/r/ProgrammerHumor/hot.json"
  );
  const hotPosts = [];
  res.data.data.children.forEach((element) => {
    const post = {
      photoURL: element.data.url_overridden_by_dest,
      caption: element.data.title,
      link: "http://reddit.com" + element.data.permalink,
      posted: false,
    };
    //ignore posts without photoURL, only jpg
    if (post.photoURL && post.photoURL.slice(-4) == ".jpg") hotPosts.push(post);
  });
  fs.writeFile("./dailyPosts.json", JSON.stringify(hotPosts), (err) => {
    if (err) console.log(err);
  });
}
