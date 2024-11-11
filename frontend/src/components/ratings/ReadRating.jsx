import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import React, { useState, useEffect } from 'react';
import VerifiedIcon from '@mui/icons-material/Verified';


const ReadRating = ({username, fullname, verified, joinedOn}) => {
    const [rating, setRating] = useState(0);

    useEffect(() => {
        fetch(`/api/profile/rating/${username}`)
            .then(response => response.json())
            .then(data => {
                setRating(data.user_rating)
            });
    }, []);

    return (
        <Box>
            <Stack direction="column" spacing={2}>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                    <Avatar>{fullname[0] ?? ""}</Avatar>
                    <a>{fullname}</a>{verified ? <VerifiedIcon /> : ''}
                </Stack>
                <Stack direction="row" spacing={2}>
                    <p>Joined {new Date(joinedOn).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
                </Stack>
                <Rating name="read-only" value={rating} precision={0.5} readOnly />
            </Stack>
        </Box>
    );
}

export default ReadRating