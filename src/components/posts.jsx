import React, { useCallback, useEffect, useState } from 'react';
import axios from "axios";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import { Checkbox } from '@mui/material';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const Posts = () => {
    const [post, setPost] = useState([]);
    const [pairs] = useState([]);
    const [, setGui] = useState(0);


    const handleChange = (n, val) => {
        const name = parseInt(n, 10);
        const value = parseInt((val === true || val === false) ? + val : val);
        const i = pairs.findIndex(element => element[0] === name)
        if (i === -1) {
            pairs.push([name, value]);
            setGui(current => !current);
        }
        else {
            pairs[i] = [name, value];
            setGui(current => !current);
        }

        console.log("handle", pairs)
    }

    const sendPostRequest = async (dev) => {

        const element = pairs.find(e => e[0] === dev.ID);
        if (isNaN(element[1])) {
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
                pairs.splice(pairs.findIndex(item), 1)
            }
        })
    }, [post])

    const callBackForEvent = useCallback((event) => {
        var data;
        try {
            data = JSON.parse(event.data);
            if (!(data && typeof data === "object")) {
                console.log("Invalid JSON string");
                return;
            }
        }
        catch (e) { }

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

    const renderKey = (key) => {
        switch (key) {
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

    const renderInput = (device) => {
        if (device.key === 1)
            return (
                // <input
                //     type="number"
                //     name={device.ID}
                //     value={pairs.find(element => element[0] === device.ID)[1] || ''}
                //     onChange={e => handleChange(e.target.name, e.target.value)}
                // />
                <Box sx={{ width: 120 }}>
                    <FormControl fullWidth>
                        <InputLabel id="temp-select-label">Temp</InputLabel>
                        <Select
                            name={device.ID}
                            labelId="temp-select-label"
                            value={pairs.find(element => element[0] === device.ID)[1] || ''}
                            label="Temp"
                            onChange={e => handleChange(e.target.name, e.target.value)}
                        >
                            <MenuItem value={18}>18'C</MenuItem>
                            <MenuItem value={20}>20'C</MenuItem>
                            <MenuItem value={22}>22'C</MenuItem>
                            <MenuItem value={24}>24'C</MenuItem>
                            <MenuItem value={26}>26'C</MenuItem>
                            <MenuItem value={28}>28'C</MenuItem>
                            <MenuItem value={30}>30'C</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            )
        else if (device.key === 2) {
            return (<div>Unavailable</div>)
        }
        else if (device.key === 3 || device.key === 4) {
            return (
                // <input
                //     type="checkbox"
                //     name={device.ID}
                //     checked={pairs.find(element => element[0] === device.ID)[1] || ''}
                //     onChange={e => handleChange(e.target.name, e.target.checked)}
                // />
                <Checkbox
                    name={device.ID}
                    checked={pairs.find(element => element[0] === device.ID)[1] || ''}
                    onChange={e => handleChange(e.target.name, e.target.checked)}
                    inputProps={{ 'aria-label': 'controlled' }}
                />
            )
        }
        else {
            return (<div>Unknown key</div>)
        }
    }

    function CircularProgressWithLabel(props) {
        return (
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress variant="determinate" {...props} />
                <Box
                    sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Typography variant="caption" component="div" color="text.secondary">
                        {`${Math.round(props.value)}${props.type}`}
                    </Typography>
                </Box>
            </Box>
        );
    }

    CircularProgressWithLabel.propTypes = {
        /**
         * The value of the progress indicator for the determinate variant.
         * Value between 0 and 100.
         * @default 0
         */
        value: PropTypes.number.isRequired,
        type: PropTypes.any.isRequired
    };

    const renderValue = (device) => {
        switch (device.key) {
            case 1:
                return <CircularProgressWithLabel value={device.value} type="'C" />; //String(device.value) + "'C";
            case 2:
                return <CircularProgressWithLabel value={device.value} type=" %" />;//String(device.value) + "%";
            case 3:
                return device.value === 1 ? "ON" : "OFF";
            case 4:
                return device.value === 1 ? "ON" : "OFF";
            default:
                return "Unknown key";

        }
    }

    return (<Box
        sx={{
            display: 'flex',
            flexWrap: 'wrap',
            '& > :not(style)': {
                m: 4,
                width: 1280,
                height: 512,
            },
        }}
    >{
            !post ? ("No data found ") : (

                <Paper elevation={24}>
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Message ID</TableCell>
                                    <TableCell align="left">Sender Address</TableCell>
                                    <TableCell align="left">Message #</TableCell>
                                    <TableCell align="left">Key</TableCell>
                                    <TableCell align="left">Value</TableCell>
                                    <TableCell align="left">New value</TableCell>
                                    <TableCell align="left">Send new value</TableCell>


                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    post.map(device => (
                                        <TableRow key={device.ID}>
                                            <TableCell rowSpan={device.length + 1}>
                                                {device.ID}</TableCell>
                                            <TableCell rowSpan={device.length + 1}>
                                                {device.sender}</TableCell>
                                            <TableCell rowSpan={device.length + 1}>
                                                {device.readingId}</TableCell>
                                            <TableCell rowSpan={device.length + 1}>
                                                {renderKey(device.key)}</TableCell>
                                            <TableCell rowSpan={device.length + 1}>
                                                {renderValue(device)}</TableCell>
                                            <TableCell rowSpan={device.length + 1}>
                                                <div>
                                                    <label>
                                                        {renderInput(device)}
                                                    </label>
                                                </div></TableCell>
                                            <TableCell rowSpan={device.length + 1}>
                                                <Button variant="contained" onClick={() => sendPostRequest(device)} endIcon={<SendIcon />} disabled={device.key === 2 ? 1 : 0}>
                                                    Send
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}
    </Box>
    );
}

export default Posts;