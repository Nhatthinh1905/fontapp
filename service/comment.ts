import axios from "axios";
import { commentUrl } from './api';
import { Comment } from "../interface/Comment";

export const getCommentInTrack = async (id:String) => {
    try{
    const response = await axios.get(commentUrl+ `/all/${id}`);
        const data = await response.data;

        return data;
    }catch (error) {
        console.error('Error fetching :', error);
      }
}
export const addCommentApi = (content:String,trackId:String) => {
    const addComment = axios({
      method: "POST",
      url: commentUrl.concat("/add"),
      params: { content, trackId },
      headers: {
        "Content-Type": "application/json",
      },
    });
    return addComment;
  };