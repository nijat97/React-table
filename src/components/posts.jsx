import React, { useEffect, useState } from 'react';
import axios from "axios";

const Posts = () => {
    const [posts, setPosts] = useState();
    useEffect(()=>{
        axios.get('https://jsonplaceholder.typicode.com/todos')
        .then(res=>{
                console.log(res.data);
                setPosts(res.data);
        })
    },[])
    return ( <div>{
        !posts ? ("No data found "):(
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
                    posts.map((post, index)=>(
                        <tr key={index}>
                            <td>{post.id}</td>
                            <td>{post.userId}</td>
                            <td>{post.title}</td>
                            <td>
                                <p
                                    className={
                                        post.completed ? "btn btn-success" : "btn btn-danger"
                                    }>
                                    {
                                        post.completed ? "ON" : "OFF"    
                                    }
                                </p>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )
        }</div> );
}
 
export default Posts;