import { useState } from "react";
import { useDispatch } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";
import { postAdded } from "./postsSlice";


const AddPostForm = () => {
    const dispatch = useDispatch();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    //const [userId, setUserId] = useState('');

    const onTitleChanged = e => setTitle(e.target.value);//set title 
    const onContentChanged = e => setContent(e.target.value);//set content
    //const onAuthorChanged = e => setUserId(e.target.value);//set author

    const onSavePostClicked = () => {
        if (title && content ) {
            dispatch(postAdded({
                id: nanoid(),
                title,
                content
            }))
            setTitle('');
            setContent('');
        }
    }

  return (
    <section>
            <h2>Add a New Post</h2>
            <form>
                <label htmlFor="postTitle">Post Title:</label>
                <input
                    type="text"
                    id="postTitle"
                    name="postTitle"
                    value={title}
                    onChange={onTitleChanged}
                />
              {/*   <label htmlFor="postAuthor">Author:</label>
                <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
                    <option value=""></option>
                    {usersOptions}
                </select> */}
                <label htmlFor="postContent">Content:</label>
                <textarea
                    id="postContent"
                    name="postContent"
                    value={content}
                    onChange={onContentChanged}
                />
                <button
                    type="button"
                    onClick={onSavePostClicked}
                    /* disabled={!canSave} */
                >Save Post</button>
            </form>
        </section>
  )
}

export default AddPostForm