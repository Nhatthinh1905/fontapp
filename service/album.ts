
import axios from "axios";
import { albumUrl } from "./api";

export const getAllAlbumApi = async () => {
    try{
    const response = await axios.get(albumUrl.concat("/all"));
        const data = await response.data;

        return data;
    }catch (error) {
        console.error('Error fetching:', error);
      }
}

export const getTracksbyAlbumIdApi =async (id:Number) => {
    try{
    const response = await axios.get(albumUrl+'/'+id+'/tracks');
    const data = await response.data;

        return data;
    }catch (error){
        console.error('Error fetching :', error);
    }
}
export const searchAlbum =async (keyword:string) => {
    try{
        const searchAlbumRequest = axios({
            method: "GET",
            url: albumUrl.concat("/search"),
            params: {keyword},
          });
          return searchAlbumRequest;
    }catch (error){
        console.error('Error fetching :', error);
    }
}

