import React, { useEffect } from 'react'
import axios from 'axios'
import { BASE_URL } from '../src/utils/constants'
import { useDispatch } from 'react-redux'
import { addRequests, removeRequest } from '../src/utils/requestSlice'
import { useSelector } from 'react-redux'

const Requests = () => {
    const requests = useSelector((store)=> store.requests);
    const dispatch = useDispatch();

    const reviewRequests = async(status,_id)=>{
        try{
            const res = axios.post(BASE_URL +"/request/review/"+status+"/"+ _id,[],{withCredentials:true});
            dispatch(removeRequest(_id));
        }catch(err){
            console.log(err.message);
        }
    }

    const fetchRequests= async() =>{
        try{
            const res = await axios.get(BASE_URL+"/user/requests", {withCredentials: true,});
            dispatch(addRequests(res.data.data));
        }catch(err){
            console.log(err.message);
        }
    }

    useEffect(()=>{
        fetchRequests();
    },[]);

    if(!requests){
        return <h1 className='text-center my-10'>Loading...</h1>;
    }
    
    if(requests.length === 0)
        return <h1 className='flex justify-center my-10'>No Requests Found</h1>

    return (
        <div className='container mx-auto px-4'>
            <h1 className='text-center text-3xl font-bold my-6'>Connection Requests</h1>
            <div className='space-y-4'>
                {requests.map(request => {
                    const {_id, firstName, lastName, photoUrl, age, gender, about} = request.fromUserId;
                
                    return (
                        <div
                            key={_id}
                            className="grid grid-cols-12 gap-4 p-4 bg-base-200 rounded-lg shadow-md items-center hover:bg-base-300 transition-colors duration-300"
                        >
                            {/* Profile Picture */}
                            <div className='col-span-2 flex justify-center'>
                                <img
                                    alt={`${firstName} ${lastName}`}
                                    className="w-24 h-24 rounded-full object-cover"
                                    src={photoUrl}
                                />
                            </div>

                            {/* User Details */}
                            <div className='col-span-7'>
                                <h2 className="text-xl font-bold mb-1">
                                    {firstName} {lastName}
                                </h2>
                                {age && gender && (
                                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                                        {age}, {gender}
                                    </p>
                                )}
                                <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-3">
                                    {about}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className='col-span-3 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2'>
                                <button 
                                    className='btn btn-outline btn-error w-full sm:w-auto hover:bg-red-500 hover:text-white transition-colors duration-300'
                                    onClick={() => reviewRequests("rejected", request._id)}
                                >
                                    Reject
                                </button>
                                <button 
                                    className='btn btn-primary w-full sm:w-auto hover:bg-blue-700 hover:scale-105 transition-all duration-300'
                                    onClick={() => reviewRequests("accepted", request._id)}
                                >
                                    Accept
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default Requests;