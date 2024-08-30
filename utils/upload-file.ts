import axios from "axios";
import { localhostStorage } from "../keys";

const skyUploadImage = async (filesUri: string[],userId:string) => {
  try {
    const data = new FormData();
    for (let i = 0; i < filesUri.length; i++) {
      data.append('file', {
        //@ts-ignore
        uri: filesUri[i],
        type: "image/jpeg",
        name: `${userId}.jpeg`,
      } as any);
    }
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    const res = await axios.post(`${localhostStorage}/file/multiple/${userId}`, data, config);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}
const skyUploadVideo = async (filesUri: string[],userId:string) => {
  try {
    const data = new FormData();
    for (let i = 0; i < filesUri.length; i++) {
      data.append('file', {
        //@ts-ignore
        uri: filesUri[i],
        type: "video/mp4",
        name: `${userId}.mp4`,
      } as any);
    }
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    const res = await axios.post(`${localhostStorage}/file/multiple/${userId}`, data, config);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export {
  skyUploadImage,
  skyUploadVideo
}