import React, { useEffect, useState } from 'react';
import axios from "axios";

const Posts = () => {
    // const [posts, setPosts] = useState(deviceList);
    const [theArray, setTheArray] = useState([]);

    

    useEffect(()=>{
        // axios.get('https://jsonplaceholder.typicode.com/todos')
        // .then(res=>{
        //         console.log(res.data);
        //         setPosts(res.data);
        // });
        const updateItem =(id, newvalue)=> {
            
            const updatedValue = theArray.map((arr)=>
                arr.id === id ? newvalue : arr  
            );
            if(updatedValue === newvalue)
            {
                console.log('same')
            }
            else
            {
                console.log('notfound')
                setTheArray(arr => [...arr, newvalue]);
            }
            // if (index === -1){
            //   // handle error
            //   setTheArray(arr => [...arr, newvalue]);
            //   console.log(Object.keys(theArray).length)
            //   console.log('index=-1')
              
            // }
            // else
            // {
            //   setTheArray([
            //     ...theArray.slice(0,index),
            //     newvalue,
            //     ...theArray.slice(index+1)
            //   ]
            //           );
            // console.log('index!=-1');
            // }
          }
    
        window.addEventListener("new_readings", (event) => {
            console.log("new_readings",event.detail);
            //setTheArray(arr => [...arr, event.detail]);
            console.log(event.detail.id);
            updateItem(event.detail.id, event.detail)
            console.log(theArray.at(1));
            });
    },[])

    return ( <div>{
        !theArray ? ("No data found "):(
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
                        theArray.map(device => (
                            <tr key={device.id}>
                                <td>{device.id}</td>
                                <td>{device.temperature}</td>
                                <td>{device.humidity}</td>
                                <td>{device.readingId}</td>
                            </tr>
                        
                        // <tr key={index}>
                        //     <td>{post.id}</td>
                        //     <td>{post.userId}</td>
                        //     <td>{post.title}</td>
                        //     <td>
                        //         <p
                        //             className={
                        //                 post.completed ? "btn btn-success" : "btn btn-danger"
                        //             }>
                        //             {
                        //                 post.completed ? "ON" : "OFF"    
                        //             }
                        //         </p>
                        //         <p
                        //             className={
                        //                 post.completed ? "btn btn-success" : "btn btn-danger"
                        //             }>
                        //             {
                        //                 post.completed ? "ON" : "OFF"    
                        //             }
                        //         </p>
                        //     </td>
                        // </tr>
                   ))
                    }
                </tbody>
            </table>
        )
        }</div> );
}
 
export default Posts;