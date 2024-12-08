import axios from "axios";
import { trackUrl } from "./api";
export const getAllTrackApi = async () => {
  try {
    const response = await axios.get(trackUrl.concat("/all"));
    const data = await response.data;
    return data;
  } catch (error) {
    console.error("Error fetching tracks:", error);
  }
};
export const uploadTrackApi = async ({
  title,
  artist,
  imageFile,
  mp3File,
}: any) => {
  try {
    const formData = new FormData();

    formData.append("title", title);
    formData.append("artist", artist);
    formData.append("imgFile", imageFile);
    formData.append("mp3File", mp3File);

    const response = await axios.post(trackUrl.concat("/upload"), formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error uploading track:", error);
    throw error;
  }
};
export const deleteTrackApi = async (id: string) => {
  await axios({
    method: "DELETE",
    url: trackUrl + "/delete",
    params: { id },
    headers: {
      "Content-Type": "application/json",
    },
  });
}
export const searchTrack =async (keyword:string) => {
  try{
      const searchTrackRequest = axios({
          method: "GET",
          url: trackUrl.concat("/search"),
          params: {keyword},
        });
        return searchTrackRequest;
  }catch (error){
      console.error('Error fetching :', error);
  }
}
