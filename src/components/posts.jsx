import React, { useCallback, useEffect, useState } from 'react';
import axios from "axios";

const Posts = () => {
    const [post, setPost] = useState([]);
    const [pairs, setPairs] = useState([]);

    const handleChange = (n, val) => {
        const name = parseInt(n,10);
        const value = parseInt( (val === true || val === false) ? + val : val);
        const i = pairs.findIndex(element => element[0] === name)
        if(i === -1)
        {
            pairs.push([name, value]);
        }
        else
        {
            pairs[i]=[name, value];
        }

        console.log("handle", pairs)
    }

    const sendPostRequest = async (dev) => {

        const element = pairs.find(e => e[0] === dev.ID);
        if(element[1] === NaN)
        {
            alert("Set value before sending!");
            return;
        }
        const obj = { "target": dev.sender, "key": dev.key, "value": element[1] };
        let jsonString = JSON.stringify(obj);
        try {
            const resp = await axios.post("/update",
                jsonString,
                {
                    headers: { 'content-type': 'application/json' }
                }
            );
            console.log(resp.data);
        } catch (err) {
            console.log(err.response.data)
            console.log(err.response.status)
            console.log(err.response.headers)
            console.log(err.response.data.error)
            console.log(err.message)
        }
    };

    useEffect(() => {
        //console.log("Pairs:",pairs)
        pairs.forEach(item => {
            if (post.find((element) => element.ID === item[0]) === undefined) {
                pairs.splice(pairs.findIndex(item),1)
            }
        })
    }, [post])

    const callBackForEvent = useCallback((event) => {
        const data = JSON.parse(event.data)

        console.log("Detail:", data)

        data.forEach(item => {
            const i = pairs.findIndex(element => element[0] === item.ID)
            if (i === -1) {
                pairs.push([item.ID, NaN])
            }
        })
        console.log(pairs)

        setPost(data);

    }, [pairs]);

    useEffect(() => {

        if (!!window.EventSource) {
            var source = new EventSource('/events')
        }
        source.addEventListener('new_readings', callBackForEvent)

        return () => source.removeEventListener('new_readings', callBackForEvent)
    }, [callBackForEvent])

    const renderKey = (key) =>
    {
        switch(key)
        {
            case 1:
                return "Temperature";
            case 2:
                return "Humidity";
            case 3:
                return "LED";
            case 4:
                return "Air conditioner";
            default:
                return "Unknown key";

        }
    }

    const renderInput = (device) =>
    {
        if(device.key === 1)
        return(
            <input
            type="number"
            name={device.ID}
            value={pairs.find(element => element[0] === device.ID)[1] || ''}
            onChange={e => handleChange(e.target.name, e.target.value)}
            />
        )
        else if(device.key === 2)
        {
            return(<div>Unavailable</div>)
        }
        else if(device.key === 3 || device.key === 4)
        {
            return(
                <input 
                    type="checkbox"
                    name={device.ID}
                    checked={pairs.find(element => element[0] === device.ID)[1] || ''}
                    onChange={e => handleChange(e.target.name,e.target.checked)}
                />
            )
        }
        else
        {
            return(<div>Unknown key</div>)
        }
    }

    const renderValue = (device) =>
    {
        switch(device.key)
        {
            case 1:
                return String(device.value) + "'C";
            case 2:
                return String(device.value) + "%";
            case 3:
                return device.value === 1 ? "ON" : "OFF";
            case 4:
                return device.value === 1 ? "ON" : "OFF";
            default:
                return "Unknown key";

        }
    }

    return (<> <div>{
        !post ? ("No data found ") : (
            <table className='table'>
                <thead>
                    <tr>
                        <th>Message ID</th>
                        <th>Sender Address</th>
                        <th>Message #</th>
                        <th>Key</th>
                        <th>Value</th>
                        <th>New Value</th>
                        <th>Send new value</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        post.map(device => (
                            <React.Fragment key={device.ID}>
                                <tr>
                                    <td rowSpan={device.length + 1}>
                                        {device.ID}</td>
                                    <td rowSpan={device.length + 1}>
                                        {device.sender}</td>
                                    <td rowSpan={device.length + 1}>
                                        {device.readingId}</td>
                                    <td rowSpan={device.length + 1}>
                                        {renderKey(device.key)}</td>
                                    <td rowSpan={device.length + 1}>
                                        {renderValue(device)}</td>
                                    <td rowSpan={device.length + 1}>
                                        <div>
                                            <label>
                                                {renderInput(device)}
                                            </label>
                                        </div></td>
                                    <td rowSpan={device.length + 1}>
                                        <div><button type="button" class="btn btn-success" onClick={() => sendPostRequest(device)} disabled={device.key === 2 ? 1 : 0 }>Send</button></div></td>
                                </tr>
                            </React.Fragment>
                        ))}
                </tbody>
            </table>

        )

    }
    </div>

    </>
    );
}

export default Posts;