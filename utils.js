import tags from "./tags.js";

function getRandomTagsString(size = 30) {
  //get unique random tags
  let randomTagsArray = [];
  while (randomTagsArray.length < size) {
    const randomTag = tags[Math.floor(Math.random() * tags.length)];
    if (!randomTagsArray.includes(randomTag)) randomTagsArray.push(randomTag);
  }
  return randomTagsArray.join(" ");
}
export { getRandomTagsString };