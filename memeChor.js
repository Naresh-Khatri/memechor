import axios from "axios";

export default async function chor() {
  let postsJSON = await axios.get(
    "https://www.reddit.com/r/ProgrammerHumor/hot.json"
  );

  let randNum = getRandomInt(0, postsJSON.data.data.children.length - 1);

  //only allow jpg for now
  while (
    postsJSON.data.data.children[randNum].data.url_overridden_by_dest.slice(
      -4
    ) !== ".jpg"
  ) {
    console.log(
      "not a jpg:",
      postsJSON.data.data.children[randNum].data.url_overridden_by_dest.slice(
        -4
      )
    );
    randNum = getRandomInt(0, postsJSON.data.data.children.length - 1);
  }
  const post = {
    photoURL: postsJSON.data.data.children[randNum].data.url_overridden_by_dest,
    caption: postsJSON.data.data.children[randNum].data.title,
  };
  console.log(post);
  return post;
}

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
