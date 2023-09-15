import { createSlice, createAsyncThunk, createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { sub } from 'date-fns';
import axios from "axios";

const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';
const postsAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.date.localeCompare(a.date)
})

const initialState = postsAdapter.getInitialState({
    status: 'idle', //'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    count: 0
})


//getting all posts from the URL
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const response = await axios.get(POSTS_URL)
    return response.data
})



//ANOTHER WAY OF FETCHING DATA FROM AN API ASYNCHRONOUSLY USING ASYNC() BUT SINE I'M USING REDUX, I'LL HAVE TO USE createAsyncThunk()
/* export const fetchAllPosts = async () => {
    const response = await axios.get(POSTS_URL)
    return response.data
} */


//posting a newPost to the URL
export const addNewPost = createAsyncThunk('posts/addNewPost', async (initialPost) => {
    const response = await axios.post(POSTS_URL, initialPost)
    return response.data
})

//EDITING POSTS ASYNC
export const updatePost = createAsyncThunk('posts/updatePost', async (initialPost) => {
    const { id } = initialPost;
    try{
        const response = await axios.put(`${POSTS_URL}/${id}`, initialPost)
        return response.data
    } catch(err){
        //return err.message
        return initialPost;//testing purposes.... the update doesnt work becaause the post id doesnt exist on the url database...
    }

})

//DELETING POSTS ASYNC
export const deletePost = createAsyncThunk('posts/deletePost', async (initialPost) => {
    const { id } = initialPost;
    try{
        const response = await axios.delete(`${POSTS_URL}/${id}`)
        if (response?.status === 200) return initialPost;
        return `${response?.status}: ${response?.statusText}`;
    } catch(err){
        return err.message
    }

})

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        reactionAdded(state, action) {
            const { postId, reaction } = action.payload
            const existingPost = state.entities[postId]
            if (existingPost) {
                existingPost.reactions[reaction]++
            }
        },
        increaseCount(state, action) {
            state.count = state.count + 1
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchPosts.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = 'succeeded'
                // Adding date and reactions
                let min = 1;
                const loadedPosts = action.payload.map(post => {
                    post.date = sub(new Date(), { minutes: min++ }).toISOString();
                    post.reactions = {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    }
                    return post;
                });

                // Add any fetched posts to the array
                postsAdapter.upsertMany(state, loadedPosts);
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            .addCase(addNewPost.fulfilled, (state, action) => {
                // Fix for API post IDs:
                // Creating sortedPosts & assigning the id 
                // would be not be needed if the fake API 
                // returned accurate new post IDs
                const sortedPosts = state.posts.sort((a, b) => {
                    if (a.id > b.id) return 1
                    if (a.id < b.id) return -1
                    return 0
                })
                action.payload.id = sortedPosts[sortedPosts.length - 1].id + 1;
                // End fix for fake API post IDs 

                action.payload.userId = Number(action.payload.userId)
                action.payload.date = new Date().toISOString();
                action.payload.reactions = {
                    thumbsUp: 0,
                    wow: 0,
                    heart: 0,
                    rocket: 0,
                    coffee: 0
                }
                console.log(action.payload)
                postsAdapter.addOne(state, action.payload)
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                if(!action.payload?.id) {
                    console.log('Update could not be completed')
                    console.log(action.payload)
                    return;
                }

                //creating a new date and using the former id for edited post
                action.payload.date = new Date().toISOString();//setting a new date

                //adding the edited post to the shallow array created and making it the new post state 
                postsAdapter.upsertOne(state, action.payload)
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                //checking if action.payload or id is available...
                if (!action.payload?.id) {
                    console.log('Delete could not be completed');
                    console.log(action.payload);
                    return;
                }
                //destructuring id from action.payload
                const { id } = action.payload;

                //setting the posts state to the newly shallow array created
                postsAdapter.removeOne(state, id)
            })
    }
})


//getSelectors create these selectors... we then use ES6 aliases to rename the selectors
export const {
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds
} = postsAdapter.getSelectors(state => state.posts)


export const getPostsStatus = (state) => state.posts.status;
export const getPostsError = (state) => state.posts.error;
export const getCount = (state) => state.posts.count;



//createSelector first parameter is a dependency, which means that if there is a change in the dependency it will re-render and the second parameter is... i don't know
export const selectPostsByUser = createSelector(
    [selectAllPosts, (state, userId) => userId],
    (posts, userId) => posts.filter(post => post.userId === userId)
) 



export const { increaseCount, reactionAdded } = postsSlice.actions

export default postsSlice.reducer