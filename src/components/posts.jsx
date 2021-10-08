import React, { useCallback, useEffect, useState } from 'react';
import axios from "axios";


const Posts = () => {
    const [post, setPost] = useState([]);
    const [pairs, setPairs] = useState({});
    const data = [];

    const handleChange = (event, sender) => {
        const name = event.target.name;
        const value = event.target.value;
        setPairs(values => ({...values,  [sender]: { ...values[sender], [name]: value}}))
        
        console.log("handle",pairs)
      }

    const sendPostRequest = async () => {
        try {
            const resp = await axios.post('/update', pairs);
            console.log(resp.data);
        } catch (err) {
            // Handle Error Here
            console.error(err);
        }
    };
    const sendPairs = () => {
     
        console.log("sendPairsFunc",pairs)
        for(var k in pairs)
        {
            if(pairs[k].key && pairs[k].value && !data.find(element => element === pairs[k]))
            {
               data.push({[k]:pairs[k]})
            }
        }
        console.log(data)
        sendPostRequest();
          
         //setData([]);
      }


        useEffect(() => {
            //console.log("Pairs:",pairs)
            for(var k in pairs)
            {
                if(post.find( ({ sender }) => sender === parseInt(k,10) ) === undefined)
                {
                    delete pairs[k]
                }
            }
        },[post])

        const callBackForEvent = useCallback( (event) =>
        {
            var data = JSON.parse(event.data)

            console.log("Detail:",data)
            for(const prop in data)
            {
                    if(!(pairs.hasOwnProperty(data[prop].sender)))
                    {
                        setPairs( values => ({...values,  [data[prop].sender]:{ } }));
                    } 
            }            

            console.log("useeffect", pairs)
            
            setPost(data);
            
        },[pairs]);

        useEffect(() =>{
            
            if(!!window.EventSource)
            {
                var source = new EventSource('/events')
            }
            source.addEventListener('new_readings', callBackForEvent)

            return () => source.removeEventListener('new_readings', callBackForEvent)
        },[callBackForEvent])
     

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
                            <React.Fragment key={device.sender}>
                            <tr>
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
                               device.data.map((data,i) => (
                                   <tr key={i}>
                                        <td>{data}</td>
                                   </tr>
                          ))}
                          
                           </React.Fragment>
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