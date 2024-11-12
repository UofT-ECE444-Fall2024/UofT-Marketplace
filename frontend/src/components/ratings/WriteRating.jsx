import React, { useState } from 'react';
import Rating from '@mui/material/Rating';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const WriteRating = ({ username, fullname }) => {
    const [rating, setRating] = useState(0);

    const handleSubmitRating = (e) => {
        e.preventDefault();
        const request = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "mode": "cors"
            },
            body: JSON.stringify({
                username: username,
                rating: rating
            })
        };
        fetch('/api/profile/rate', request)
            .then(response => alert("Success: Your rating was submitted"))
            .catch(error => alert("Failed to submit rating"));
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 2,
                maxWidth: 300,
                mx: 'auto',
                boxShadow: 1,
                borderRadius: 2,
            }}
        >
            <Stack direction="column" spacing={2} alignItems="center">
                <Typography variant="body1" fontWeight="bold">
                    How would you rate {fullname} ({username}) as a seller?
                </Typography>
                <Rating
                    name="seller-rating"
                    value={rating}
                    onChange={(e, newRating) => setRating(newRating)}
                    precision={0.5}
                    size="large"
                />
                <Button
                    variant="contained"
                    onClick={handleSubmitRating}
                    sx={{ width: 'fit-content', px: 3 }}
                >
                    Submit
                </Button>
            </Stack>
        </Box>
    );
};

export default WriteRating;