import Rating from '@mui/material/Rating';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import React, { useState } from 'react';
import Button from '@mui/material/Button';

const WriteRating = ({username, fullname}) => {
    const [rating, setRating] = useState(0);
    
    const handleSubmitRating = e => {
        e.preventDefault();
        const request = {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "mode": "cors"
            },
            body: JSON.stringify({
                "username": username,
                "rating": rating
            })
        };
        fetch('/api/profile/rate', request)
          .then(response => alert("Success: Your rating was submitted"))
          .catch(error => alert("Failed to submit rating"));
    }

    return (
        <Box>
            <Stack direction="column" spacing={2}>
                <a>{username}</a>
                <Rating
                    name="simple-controlled"
                    value={rating}
                    onChange={(e, newRating) => {
                        setRating(newRating)
                    }}
                    precision={0.5}
                />
                <Button variant="contained" onClick={handleSubmitRating}>Submit Rating</Button>
            </Stack>
        </Box>
    );
}

export default WriteRating