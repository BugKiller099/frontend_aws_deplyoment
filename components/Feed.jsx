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
     
    // if(feed !== null) return;
    try{
      const res = await axios.get(BASE_URL +"/feed", {withCredentials: true});
    dispatch(addFeed(res.data?.data || []));
    }catch(err){
         //hangle error gracefully
        //console.log(err.message);
    }

  };

  useEffect(()=>{
    getFeed();
    //console.log("Updated Feed from Redux:", feed);
  }, []);
  return  (  feed&& (
    <div className='flex justify-center ay-18'>
           <UserCard user={feed[0]}/>

    </div>)
  )
}

export default Feed;
