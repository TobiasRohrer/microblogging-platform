export type ActiveView =
  | { type: "TIMELINE" }
  | { type: "ACCOUNT"; username: string }
  | { type: "FOLLOWERS"; username: string }
  | { type: "FOLLOWING"; username: string }
  | { type: "POST"; username: string; postId: number };

export interface Account {
  id: number;
  name: string;
  email: string;
  followersCount: number;
  followingCount: number;
  posts: Post[];
  following: boolean;
}

export interface Post {
  id: number;
  content: string;
  postDate: string;
  authorId: number;
  authorName: string;
  parentPost: Post;
  likes: number;
  views: number;
  reposts: number;
  bookmarks: number;
  isLiked: boolean;
}
