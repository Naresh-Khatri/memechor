import axios from "axios";

export default function getImgBuffer(URL) {
  return new Promise((resolve, reject) => {
    axios.get(URL, { responseType: "arraybuffer" }).then((res) => {
      const imgbuffer = Buffer.from(res.data, "binary");
      resolve(imgbuffer);
    });
  });
}
