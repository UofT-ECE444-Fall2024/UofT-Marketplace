import React, { useEffect, useState } from 'react';
import {
  Container, Paper, Typography, Box, Chip, Avatar, Grid,
  CardContent, CardMedia, Rating
} from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import ListingCard from '../components/ListingCard';
import Toolbar from '@mui/material/Toolbar';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [userItems, setUserItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');

  const handleNameUpdate = async () => {
    try {
      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          full_name: newName,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message);
      }

      setUser(prev => ({
        ...prev,
        full_name: newName
      }));
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update name:', error);
    }
  };
  
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const storedUserData = localStorage.getItem('user');
      
      if (!storedUserData) {
        throw new Error('No user found in localStorage');
      }

      const parsedUserData = JSON.parse(storedUserData);
      setUser(parsedUserData);

      if (parsedUserData.id) {
        const itemsResponse = await fetch(`/api/listings/user/${parsedUserData.id}`);
        const itemsData = await itemsResponse.json();

        if (itemsResponse.ok) {
          setUserItems(itemsData.items);
        } else {
          setError(itemsData.message);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user data found</div>;

  const initials = user.full_name
    ? user.full_name
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
    : user.username?.[0]?.toUpperCase() || '?';

  return (
    <Container maxWidth="lg" className="mt-8">
      <Toolbar />
      <Paper elevation={3} className="p-8">
        <Box className="flex flex-col md:flex-row gap-8">
          {/* Left Column - User Info */}
          <Box className="flex flex-col items-center gap-4 md:w-1/3">
            <Avatar
              className="w-40 h-40 text-5xl bg-blue-600"
              src="/api/placeholder/160/160"
            >
              {initials}
            </Avatar>

            <Box className="flex flex-col items-center text-center">
              {isEditing ? (
                <Box className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="px-2 py-1 border rounded text-2xl font-bold"
                    onKeyPress={(e) => e.key === 'Enter' && handleNameUpdate()}
                  />
                  <button
                    onClick={handleNameUpdate}
                    className="text-green-600 hover:text-green-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Cancel
                  </button>
                </Box>
              ) : (
                <Typography variant="h4" className="font-bold flex items-center gap-2">
                  {user.full_name || user.username}
                  <button
                    onClick={() => {
                      setNewName(user.full_name || user.username);
                      setIsEditing(true);
                    }}
                    className="text-gray-500 hover:text-gray-700 text-sm"
                  >
                    Edit
                  </button>
                </Typography>
              )}

              <Typography variant="subtitle1" color="textSecondary">
                @{user.username}
              </Typography>

              <Box className="flex items-center gap-2 mt-2">
                <Chip
                  icon={user.verified ? <CheckCircle /> : <Cancel />}
                  label={user.verified ? "Verified" : "Unverified"}
                  color={user.verified ? "success" : "default"}
                  size="small"
                />
              </Box>
              <Box className="flex items-center gap-1 mt-4">
                <Rating
                  value={user.rating ?? 0}
                  precision={0.5}
                  readOnly
                />
                <Typography variant="body2" color="textSecondary">
                  ({user.rating ?? 0}/5)
                </Typography>
              </Box>

              <Typography variant="body2" color="textSecondary" className="mt-1">
                Based on {user.rating_count ?? 0} reviews
              </Typography>
            </Box>

            {user.description && (
              <Box className="mt-4 text-center">
                <Typography variant="body1">
                  {user.description}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Right Column - Listings */}
          <Box className="md:w-2/3">
            <Typography variant="h6" className="mb-4">
              Listings ({userItems.length})
            </Typography>
            <Grid container spacing={3}>
              {userItems.length > 0 ? (
                userItems.map((listing, index) => (
                  <Grid item key={index} xs={12} sm={6} md={6} lg={4}>
                    <ListingCard
                      image={listing.image}
                      title={listing.title}
                      location={listing.location.join(',\n')}
                      price={listing.price}
                      id={listing.id}
                      sx={{
                        maxWidth: 300,
                        height: 60,
                        overflow: 'hidden',
                      }}
                    />
                  </Grid>
                ))
              ) : (
                <Box sx={{ width: '100%', textAlign: 'center', marginTop: 5 }}>
                  <Typography>No listings available currently!</Typography>
                </Box>
              )}
            </Grid>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;