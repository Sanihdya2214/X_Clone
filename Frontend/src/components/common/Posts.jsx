import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { POSTS } from "../../utils/db/dummy";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const Posts = ({feedType}) => {
 // const isLoading = false;
    
  const getPostEndPoint = () => {
    
    switch (feedType) {
      case "following":
        return "/api/post/following"
       

      case "ForYou":
        return "/api/post/all"
      
      default:
        return "/api/post/all"

    }

  }
   const Post_Endpoint = getPostEndPoint();

  const { data:posts, isLoading,refetch,isFetching } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
        try {
           const res = await fetch(Post_Endpoint);
           const data = await res.json();

           if (!res.ok) {
             throw new Error(data.error || "Something went wrong");
          }
          
          return data;
        } catch (error) {
            throw new Error(error)
        } 
     }
  })

     useEffect(() => {
        
       refetch()
     
     }, [refetch,feedType])
     

  return (
    <>
      {isLoading || isFetching && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && !isFetching && posts?.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {!isLoading &&!isFetching&& posts && (
        <div>
          {posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};
export default Posts;
