export interface User {
  _id: string;
  email: string;
  username: string;
  avatarImage: string;
  isAvatarImageSet: boolean;
}

export interface ProjectMessages {
  fromSelf: boolean;
  message: string;
}
