import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../src/utils/constants";
import { removeUserFromFeed } from "../src/utils/feedSlice";
import axios from "axios";
import { X, Heart } from "lucide-react";

const UserCard = ({ user }) => {
  const { _id, firstName, lastName, photoUrl, age, gender, about } = user;
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [swipePosition, setSwipePosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const cardRef = useRef(null);
  const startXRef = useRef(0);
  const currentXRef = useRef(0);

  const handleSendRequest = async (status) => {
    setIsLoading(true);
    setError(null);

    try {
      await axios.post(`${BASE_URL}/request/send/${status}/${_id}`, {}, { withCredentials: true });
      dispatch(removeUserFromFeed(_id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to process request");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const startDragging = (clientX) => {
    if (cardRef.current) {
      startXRef.current = clientX;
      currentXRef.current = clientX;
      setIsDragging(true);
    }
  };

  const drag = (clientX) => {
    if (!isDragging) return;

    currentXRef.current = clientX;
    const diff = currentXRef.current - startXRef.current;
    setSwipePosition(diff);
  };

  const stopDragging = () => {
    if (!isDragging) return;

    setIsDragging(false);
    const threshold = window.innerWidth * 0.3;
    const finalPosition = currentXRef.current - startXRef.current;

    if (finalPosition > threshold) {
      setSwipePosition(window.innerWidth); // Move off-screen to the right
      setTimeout(() => {
        handleSendRequest("interested");
        setSwipePosition(0);
      }, 300);
    } else if (finalPosition < -threshold) {
      setSwipePosition(-window.innerWidth); // Move off-screen to the left
      setTimeout(() => {
        handleSendRequest("ignored");
        setSwipePosition(0);
      }, 300);
    } else {
      setSwipePosition(0); // Reset position if the threshold is not met
    }
  };

  const handleButtonClick = (status) => {
    const direction = status === "interested" ? window.innerWidth : -window.innerWidth;
    setSwipePosition(direction); // Move card off-screen
    setTimeout(() => {
      handleSendRequest(status);
      setSwipePosition(0); // Reset position after animation
    }, 300);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    startDragging(e.clientX);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    e.preventDefault();
    drag(e.clientX);
  };

  const handleMouseUp = (e) => {
    e.preventDefault();
    stopDragging();
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleTouchStart = (e) => {
    startDragging(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    drag(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    stopDragging();
  };

  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="relative w-96 h-[550px] mx-auto select-none"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="absolute w-full h-full bg-base-200 rounded-xl shadow-xl overflow-hidden"
        style={{
          transform: `translateX(${swipePosition}px) rotate(${swipePosition / 20}deg) scale(${1 - Math.abs(swipePosition) / (2 * window.innerWidth)})`,
          opacity: 1 - Math.abs(swipePosition) / (2 * window.innerWidth),
          transition: isDragging ? "none" : "transform 0.3s ease-out, opacity 0.3s ease-out",
        }}
      >
        {/* Swipe Indicators */}
        {swipePosition > 0 && (
          <div className="absolute top-10 right-10 z-10 transform rotate-12">
            <Heart className="w-24 h-24 text-green-500 opacity-70" strokeWidth={1.5} />
          </div>
        )}
        {swipePosition < 0 && (
          <div className="absolute top-10 left-10 z-10 transform -rotate-12">
            <X className="w-24 h-24 text-red-500 opacity-70" strokeWidth={1.5} />
          </div>
        )}

        {/* Rest of the card content */}
        <div className="relative h-2/3">
          <img src={photoUrl} alt={`${firstName} ${lastName}`} className="w-full h-full object-cover" />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-3">
            <h2 className="text-2xl font-bold">{firstName} {lastName}</h2>
          </div>
        </div>

        <div className="p-4 h-1/3 flex flex-col justify-between">
          <div>
            {age && gender && <p className="text-sm text-gray-300 mb-2">{age}, {gender}</p>}
            <p className="text-sm text-gray-300 line-clamp-3">{about}</p>
          </div>

          <div className="flex justify-between mt-4">
            <button
              className="btn btn-circle btn-outline btn-error"
              onClick={() => handleButtonClick("ignored")}
            >
              <X className="w-6 h-6" />
            </button>
            <button
              className="btn btn-circle btn-primary"
              onClick={() => handleButtonClick("interested")}
            >
              <Heart className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Error and Loading states */}
      {error && (
        <div className="absolute bottom-0 left-0 right-0 z-50">
          <div className="alert alert-error shadow-lg m-2">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      )}
    </div>
  );
};

export default UserCard;