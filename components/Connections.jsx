import React, { useEffect } from 'react'
import { BASE_URL } from '../src/utils/constants'
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addConnections } from '../src/utils/connectionSlice';
import { useSelector } from 'react-redux';

const Connections = () => {
    const connections = useSelector((store)=> store.connections);
    const dispatch = useDispatch();

    const fetchConnections = async() =>{
        try{
            const res = await axios.get(BASE_URL+"/user/connections", {withCredentials: true});
            dispatch(addConnections(res.data.data));
        }catch(err){
            console.log(err.message);
        }
    };

    useEffect(()=>{
        fetchConnections();
    }, []);

    if(!connections){
        return <h1 className='text-center my-10 text-xl'>Loading...</h1>;
    }

    if(connections.length === 0)
        return <h1 className='text-center my-10 text-xl'>No Connections Found</h1>

    return (
        <div className='container mx-auto px-4'>
            <h1 className='text-center text-3xl font-bold my-6'>Friends</h1>
            <div className='space-y-4'>
                {connections.map(connection => {
                    const {_id, firstName, lastName, photoUrl, age, gender, about} = connection;
                
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
                            <div className='col-span-10'>
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
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default Connections;