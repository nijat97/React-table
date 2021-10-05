import React, { useCallback, useEffect, useState } from 'react';
import axios from "axios";


const Posts = () => {
    const [post, setPost] = useState([]);
    const [pairs, setPairs] = useState({});

    const handleChange = (event, sender) => {
        const name = event.target.name;
        const value = event.target.value;
        setPairs(values => ({...values,  [sender]: { ...values[sender], [name]: value}}))
        
        console.log("handle",pairs)
      }

    const sendPairs = () => {
     
        console.log("sendPairsFunc",pairs)
        for(var k in pairs)
        {
            console.log(pairs[k])
        }
        axios.post('/update', {
            pairs
          })
          .then((response) => {
            console.log(response);
          }, (error) => {
            console.log(error);
          });

         
      }

    //useEffect(()=>{
        // axios.get('https://jsonplaceholder.typicode.com/todos')
        // .then(res=>{
        //         console.log(res.data);
        //         setPosts(res.data);
        // });

        // if(!!window.EventSource)
        // {
        //     var source = new EventSource('/events');
        // }

        const callBackForEvent = useCallback( (event) =>
        {
            for(const prop in event.detail)
            {
                    if(!(pairs.hasOwnProperty(event.detail[prop].sender)))
                    {
                        setPairs( values => ({...values,  [event.detail[prop].sender]:{ } }));
                    } 
            }            
         
            for(var k in pairs)
            {
                if(event.detail.find( ({ sender }) => sender === parseInt(k,10) ) === undefined)
                {
                    delete pairs[k]
                }
            }
            console.log("useeffect", pairs)
            setPost(event.detail);

            
        },[pairs]);

        useEffect(() =>{

            window.addEventListener('new_readings', callBackForEvent)

            return () => window.removeEventListener('new_readings', callBackForEvent)
        },[callBackForEvent])
     
   // },[pairs]);

    return (<> <div>{
        !post ? ("No data found "):(
            <table className='table'>
                <thead>
                    <tr>
                        <th>Sender Address</th>
                        <th>Target Address</th>
                        <th>Message ID</th>
                        <th>Control</th>
                        <th>Data</th>
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
                                <td rowSpan={device.data.length + 1}>
                                    <div>
                                    <label>Key:
                                        <input
                                            type="text"
                                            name="key"
                                            size="10"
                                            value={pairs[device.sender].key || '' }
                                            onChange={e => handleChange(e, device.sender)}
                                        />
                                    </label>
                                    </div>
                                    
                                    <div>
                                    <label>Value:
                                         <input 
                                            type="text" 
                                            name="value" 
                                            size="10"
                                            value={pairs[device.sender].value || ''} 
                                            onChange={e => handleChange(e, device.sender)}
                                        />
                                    </label>
                                    </div>
                                </td>
                            </tr>
                           
                           {
                               device.data.map(data => (
                                   <tr>
                                        <td>{data}</td>
                                   </tr>
                          ))}
                          
                           </>
                   ))}
                </tbody>
            </table>
            
        )
        
        }
        </div>
        <div>
            <p className="btn btn-success" onClick= {() => sendPairs()}>Send</p>
        </div>
        </>
         );
}
 
export default Posts;