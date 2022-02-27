import axios from "axios";
import fs from "fs";

export default async function getDailyMemes() {
  const URLs = [
    "https://www.reddit.com/r/ProgrammerHumor/hot.json",
    "https://www.reddit.com/r/ProgrammerHumor/top.json",
    "https://www.reddit.com/r/ProgrammerHumor/new.json",
    "https://www.reddit.com/r/ProgrammerHumor/rising.json",
  ];
  const promises = URLs.map((url) => axios.get(url));
  const results = await Promise.allSettled(promises);

  //idk where value is coming from
  const uniquePosts = [];
  results.forEach((result) => {
    const posts = result.value.data.data.children;
    if (!posts) return;
    const filteredPosts = getFilteredPostsWithJpg(posts);
    filteredPosts.forEach((post) => {
      //dont want to add duplicates
      if (uniquePosts.find((post) => post.photoURL == post.data ?? url)) return;
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
        posted:false
      };
      uniquePosts.push(newPost);
    });
  });
  //now uniquePosts has all unique posts of today
  let prevPosts = await fs.promises.readFile("postsCollection.json", "utf8");
  prevPosts = JSON.parse(prevPosts);
  uniquePosts.forEach((uniquePost) => {
    if (prevPosts.find((prevPost) => prevPost.id == uniquePost.id)) return;
    prevPosts.push(uniquePost);
  });
  //write to file
  fs.writeFile("postsCollection.json", JSON.stringify(prevPosts), (err) => {
    if (err) console.log(err);
    console.log("NEW maymayzz added!");
  });
}

const getFilteredPostsWithJpg = (posts) => {
  return posts.filter((post) => post.data.url.slice(-4) == ".jpg");
};
