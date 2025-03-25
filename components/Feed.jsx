import React from 'react'
import axios from 'axios'
import { BASE_URL } from '../src/utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addFeed } from '../src/utils/feedSlice'
import { useEffect } from 'react'
import UserCard from './UserCard'
const Feed = () => {
  
  const feed = useSelector((store)=> store.feed);
  const dispatch = useDispatch();
  const getFeed = async() =>{
     
    
    try{
      const res = await axios.get(BASE_URL +"/feed", {withCredentials: true});
    dispatch(addFeed(res.data?.data || []));
    }catch(err){
       
        //console.log(err.message);
    }

  };

  useEffect(()=>{
    getFeed();
    //console.log("Updated Feed from Redux:", feed);
  }, []);
  if(!feed) return ;
  if(feed.length<= 0) return <h1 className='flex justify-center my-10'>No new users</h1>
  return  (  feed&& (
    <div className='flex justify-center ay-18'>
           <UserCard user={feed[0]}/>

    </div>)
  )
}

export default Feed;
