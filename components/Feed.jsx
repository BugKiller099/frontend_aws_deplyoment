import React, { useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../src/utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { addFeed } from '../src/utils/feedSlice';
import UserCard from './UserCard';

const Feed = () => {
  const feed = useSelector((store) => store.feed); // Get the feed from Redux state
  const dispatch = useDispatch();

  // Fetch feed data from the backend
  const getFeed = async () => {
    try {
      const res = await axios.get(BASE_URL + "/feed", { withCredentials: true });
      dispatch(addFeed(res.data?.data || [])); // Dispatch the fetched feed data
    } catch (err) {
      console.error("Failed to fetch feed:", err.message);
    }
  };

  // Fetch feed on component mount
  useEffect(() => {
    getFeed();
  }, [dispatch]);

  // Handle empty feed
  if (!feed || feed.length === 0) {
    return <h1 className="flex justify-center my-10">No new users</h1>;
  }

  // Render the first profile in the feed
  return (
    <div className="flex justify-center my-18">
      <UserCard user={feed[0]} />
    </div>
  );
};

export default Feed;