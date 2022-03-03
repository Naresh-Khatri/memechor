import axios from "axios";

export default function getImgBuffer(URL) {
  return new Promise(async (resolve, reject) => {
    try{
      const resImg = await axios.get(URL, { responseType: "arraybuffer" });
      const imgbuffer = Buffer.from(resImg.data, "binary");
      resolve(imgbuffer);
    }
    catch(err){
      reject({message:"Image probably removed"});
    }
  });
}
