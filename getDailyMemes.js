import axios from "axios";
import fs from "fs";
import 'dotenv/config'

export default async function getDailyMemes() {
  const subreddit = process.env.SUBREDDIT;
  const URLs = [
    "https://www.reddit.com/r/" + subreddit + "/hot.json",
    "https://www.reddit.com/r/" + subreddit + "/top.json",
    "https://www.reddit.com/r/" + subreddit + "/new.json",
    "https://www.reddit.com/r/" + subreddit + "/rising.json",
  ];
  const promises = URLs.map((url) => axios.get(url));
  const results = await Promise.allSettled(promises);

  //idk where value is coming from
  const uniquePosts = [];
  results.forEach((result) => {
    const posts = result.value.data.data.children;
    if (!posts) return;
    const filteredPosts = getFilteredPosts(posts);
    filteredPosts.forEach((post) => {
      //dont want to add duplicates
      if (uniquePosts.includes(post)) return;
      //get todays date
      const date = new Date();
      const todaysDate = `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}`;
      //create new post obj and append
      const newPost = {
        id: post.data.id,
        photoURL: post.data.url,
        title: post.data.title,
        author: post.data.author,
        link: "http://reddit.com" + post.data.permalink,
        addedData: todaysDate,
        posted: false,
      };
      uniquePosts.push(newPost);
    });
  });
  //now uniquePosts has all unique posts of today
  let prevPosts = await fs.promises.readFile("postsCollection.json", "utf8");
  prevPosts = JSON.parse(prevPosts);
  uniquePosts.forEach((uniquePost) => {
    if (prevPosts.find((prevPost) => prevPost.id == uniquePost.id)) {
      // console.log(uniquePost.photoURL)
      return;
    }
    prevPosts.push(uniquePost);
  });
  //write to file
  fs.writeFile("postsCollection.json", JSON.stringify(prevPosts), (err) => {
    if (err) console.log(err);
    console.log(
      `${uniquePosts.length} NEW maymayzz added! 🎉\nTotal ${prevPosts.length} in collection`
    );
  });
}

const getFilteredPosts = (posts) => {
  return posts.filter(
    (post) =>
      //filter out non-jpg-image posts
      post.data.url.slice(-4) == ".jpg" &&
      //filter out nsfw posts
      post.data.whitelist_status == "all_ads"
  );
};
getDailyMemes();
