import fs from "fs";

fs.readFile("./test.json", "utf-8", (err, data) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("data: ", data);
});
