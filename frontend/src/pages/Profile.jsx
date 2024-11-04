import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  Chip, 
  Avatar,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Rating,
  Divider,
  Tabs,
  Tab
} from '@mui/material';
import { CheckCircle, Cancel, Star } from '@mui/icons-material';
import Toolbar from '@mui/material/Toolbar';

// Placeholder data for listings
const MOCK_LISTINGS = [
  {
    id: 1,
    title: "Vintage Camera",
    price: "$120",
    image: "/api/placeholder/300/200",
    status: "active"
  },
  {
    id: 2,
    title: "Mountain Bike",
    price: "$450",
    image: "/api/placeholder/300/200",
    status: "active"
  }
];

// Placeholder data for reviews
const MOCK_REVIEWS = [
  {
    id: 1,
    reviewer: "John Doe",
    rating: 5,
    date: "March 15, 2024",
    comment: "Great seller! Very responsive and item was exactly as described."
  },
  {
    id: 2,
    reviewer: "Jane Smith",
    rating: 4,
    date: "March 10, 2024",
    comment: "Good transaction overall. Quick shipping."
  }
];

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index} className="mt-4">
    {value === index && children}
  </div>
);

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (!storedUser?.username) {
        throw new Error('Not logged in');
      }

      const response = await fetch(`http://localhost:5001/api/profile/${storedUser.username}`);
      const data = await response.json();
      
      if (response.ok) {
        setUserData(data.user);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!userData) return <div>No user data found</div>;

  const initials = userData.full_name
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();

  return (
    <Container maxWidth="lg" className="mt-8">
      <Toolbar />
      <Paper elevation={3} className="p-8">
        <Box className="flex flex-col md:flex-row gap-8">
          {/* Left Column - User Info */}
          <Box className="flex flex-col items-center gap-4 md:w-1/3">
            <Avatar 
              className="w-40 h-40 text-5xl bg-blue-600"
              src="/api/placeholder/160/160"  // Placeholder profile pic
            >
              {initials}
            </Avatar>

            <Box className="flex flex-col items-center text-center">
              <Typography variant="h4" className="font-bold">
                {userData.full_name}
              </Typography>
              
              <Typography variant="subtitle1" color="textSecondary">
                @{userData.username}
              </Typography>

              <Box className="flex items-center gap-2 mt-2">
                <Chip
                  icon={userData.verified ? <CheckCircle /> : <Cancel />}
                  label={userData.verified ? "Verified" : "Unverified"}
                  color={userData.verified ? "success" : "default"}
                  size="small"
                />
              </Box>

              <Box className="flex items-center gap-1 mt-4">
                <Rating 
                  value={userData.rating} // Placeholder rating
                  precision={0.5}
                  readOnly
                />
                <Typography variant="body2" color="textSecondary">
                  ({userData.rating}/5)
                </Typography>
              </Box>

              <Typography variant="body2" color="textSecondary" className="mt-1">
                Based on {userData.rating_count} reviews
              </Typography>
            </Box>

            {userData.description && (
              <Box className="mt-4 text-center">
                <Typography variant="body1">
                  {userData.description}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Right Column - Listings & Reviews */}
          <Box className="md:w-2/3">
            <Tabs 
              value={activeTab} 
              onChange={(e, newValue) => setActiveTab(newValue)}
              className="mb-4"
            >
              <Tab label={`Listings (${MOCK_LISTINGS.length})`} />
              <Tab label={`Reviews (${MOCK_REVIEWS.length})`} />
            </Tabs>

            <TabPanel value={activeTab} index={0}>
              <Grid container spacing={3}>
                {MOCK_LISTINGS.map((listing) => (
                  <Grid item xs={12} sm={6} key={listing.id}>
                    <Card elevation={2}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={listing.image}
                        alt={listing.title}
                      />
                      <CardContent>
                        <Typography variant="subtitle1" className="font-semibold">
                          {listing.title}
                        </Typography>
                        <Typography variant="body1" color="primary" className="font-bold">
                          {listing.price}
                        </Typography>
                        <Chip 
                          label={listing.status}
                          size="small"
                          color={listing.status === 'active' ? 'success' : 'default'}
                          className="mt-2"
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </TabPanel>

            <TabPanel value={activeTab} index={1}>
              <Box className="flex flex-col gap-4">
                {MOCK_REVIEWS.map((review) => (
                  <Paper key={review.id} elevation={1} className="p-4">
                    <Box className="flex justify-between items-start">
                      <Typography variant="subtitle1" className="font-semibold">
                        {review.reviewer}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {review.date}
                      </Typography>
                    </Box>
                    <Rating value={review.rating} readOnly size="small" className="mt-1" />
                    <Typography variant="body2" className="mt-2">
                      {review.comment}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </TabPanel>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;