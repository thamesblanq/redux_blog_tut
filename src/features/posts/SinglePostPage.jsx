import { useSelector } from "react-redux/";
import { selectPostById } from "./postsSlice";

import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import ReactionsButton from "./ReactionsButton";
import { useParams, Link } from "react-router-dom";

const SinglePostPage = () => {
    //retrieve postId
    const { postId }= useParams();

    //get post
    const post = useSelector((state) =>  selectPostById(state, Number(postId)))

    //check for no post || post not available
    if(!post) {
        return (
            <section>
                <h2>Post not Found!</h2>
            </section>
        )
    } 
    
    return (
        <article>
                <h2>{post.title}</h2>
                <p>{post.body}</p>
                <p className="postCredit">
                    <Link to={`/post/edit/${post.id}`}>Edit Post</Link>
                    <PostAuthor userId={post.userId}/>
                    <TimeAgo timestamp={post.date}/>
                </p>
                <ReactionsButton post={post}/>
        </article>
    )


}

export default SinglePostPage