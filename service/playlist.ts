import axios from 'axios';
import { playlistUrl } from './api';
import { Playlist } from '../interface/Playlist';
export const getAllPlaylistApi = async () => {
    try{
    const response = await axios.get(playlistUrl);
        const data = await response.data;

        return data;
    }catch (error) {
        console.error('Error fetching:', error);
      }
}
export const createNewPlaylistApi = ({ name, description }: Playlist) => {
    const createNewPlaylist = axios({
      method: "POST",
      url: playlistUrl.concat("/create"),
      params: { name, description },
      headers: {
        "Content-Type": "application/json",
      },
    });
    return createNewPlaylist;
  };
  export const deletePlaylistApi = async (id: string) => {
    try {
       await axios.delete(playlistUrl + `/delete/${id}`);

    } catch (error) {
      console.error('Error fetching:', error);
    }
  }
  export const getTrackinPlaylistApi = async (id:string) => {
    try{
    const response = await axios.get(playlistUrl+ `/${id}/tracks`);
        const data = await response.data;

        return data;
    }catch (error) {
        console.error('Error fetching:', error);
      }
}
export const addTrackToPlaylist =async (playListId:number,trackId:number) => {
  try{
    const response = await axios.post(playlistUrl+ `/${playListId}/addTrack/${trackId}`);
    
        return response;
    }catch (error) {
        throw error;
      }
}

export const removeTrackToPlaylist =async (playListId:number,trackId:number) => {
  try{
    const response = await axios.post(playlistUrl+ `/${playListId}/removeTrack/${trackId}`);
    
        return response;
    }catch (error) {
        throw error;
      }
}