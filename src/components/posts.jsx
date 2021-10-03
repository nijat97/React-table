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
        var rows=[];
        if(!!window.EventSource)
        {
            var source = new EventSource('/events');
        }

        source.addEventListener('new_readings', (event) => {
            //setPost([]);
            console.log("new_readings",event.data);
            setPost(JSON.parse(event.data));

            for(var i=0;i<post.numOfPairs;i++)
            {

            }
            console.log(post);
        });
     
    },[post]);

    return ( <div>{
        !post ? ("No data found "):(
            <table className='table'>
                <thead>
                    <tr>
                        <th>Sender Address</th>
                        <th>Target Address</th>
                        <th>Message ID</th>
                        <th>Data</th>
                        <th>Control</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        post.map(device => (
                            <>
                            <tr key={device.sender}>
                                <td rowSpan={device.data.length + 1}>
                                    {device.sender}</td>
                                <td rowSpan={device.data.length + 1}>
                                    {device.target}</td>
                                <td rowSpan={device.data.length + 1}>
                                    {device.readingId}</td>
                            </tr>
                           {
                               device.data.map(data => (
                                   <tr>
                                        <td>{data}</td>
                                   </tr>
                               )
                                )
                           }
                           </>
                   ))
                   
                    }
                </tbody>
            </table>
        )
        }</div> );
}
 
export default Posts;