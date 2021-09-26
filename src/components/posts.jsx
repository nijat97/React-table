import React, { useEffect, useState } from 'react';
import axios from "axios";


const Posts = () => {
    const [post, setPost] = useState([]);

    useEffect(()=>{
        // axios.get('https://jsonplaceholder.typicode.com/todos')
        // .then(res=>{
        //         console.log(res.data);
        //         setPosts(res.data);
        // });
    
        window.addEventListener("new_readings", (event) => {
            setPost([]);
            console.log("new_readings",event.detail);
            setPost(event.detail);
        });
     
    },[])

    return ( <div>{
        !post ? ("No data found "):(
            <table className='table'>
                <thead>
                    <tr>
                        <th>Device ID</th>
                        <th>Temperature</th>
                        <th>Humidity</th>
                        <th>Control</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        post.map(device => (
                            <tr key={device.id}>
                                <td>{device.id}</td>
                                <td>{device.temperature}</td>
                                <td>{device.humidity}</td>
                                <td>{device.readingId}</td>
                            </tr>
                   ))
                   
                    }
                </tbody>
            </table>
        )
        }</div> );
}
 
export default Posts;