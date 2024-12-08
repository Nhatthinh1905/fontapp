import axios from 'axios';
import { artistUrl } from './api';

export const getAllArtistApi = async () => {
    try{
    const response = await axios.get(artistUrl.concat("/all"));
        const data = await response.data;

        return data;
    }catch (error) {
        console.error('Error fetching artists:', error);
      }
}
export const getTracksbyArtistIdApi =async (id:Number) => {
    try{
    const response = await axios.get(artistUrl+'/'+id+'/tracks');
    const data = await response.data;

        return data;
    }catch (error){
        console.error('Error fetching :', error);
    }
    
}
export const searchArtist =async (keyword:string) => {
    try{
        const searchArtistRequest = axios({
            method: "GET",
            url: artistUrl.concat("/search"),
            params: {keyword},
          });
          return searchArtistRequest;
    }catch (error){
        console.error('Error fetching :', error);
    }
}