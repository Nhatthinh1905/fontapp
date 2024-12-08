import { Track } from "./Track";
import { UserProfile } from "./UserProfile";

export interface Comment {
    user: UserProfile;
    content: string;
    timestamp: string;
    trackId:String
  }