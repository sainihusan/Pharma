import { useState, useEffect } from 'react';
import {
  Box, Container, Paper, Typography, Divider, CircularProgress, Grid, Skeleton
} from '@mui/material';
import { User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import authService from '../api/authService';

export default function ProfilePage() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await authService.getMe();
        if (res) {
          const fetched = res.data?.user || res.data || res.user || res;
          setProfileData(fetched);
        }
      } catch (error) {
        setProfileData(user || {});
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const InfoRow = ({ label, value }) => (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid item xs={12} sm={4}>
        <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </Typography>
      </Grid>
      <Grid item xs={12} sm={8}>
        <Typography variant="body1" fontWeight={500} color={value ? 'text.primary' : 'text.disabled'}>
          {value || 'Not provided'}
        </Typography>
      </Grid>
    </Grid>
  );

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 6, border: '1px solid', borderColor: 'grey.200' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <Skeleton variant="rectangular" width={60} height={60} sx={{ borderRadius: 3 }} />
            <Box sx={{ flex: 1 }}>
              <Skeleton width="40%" height={32} />
              <Skeleton width="30%" />
            </Box>
          </Box>
          <Divider sx={{ mb: 4 }} />
          {[...Array(4)].map((_, i) => (
            <Box key={i} sx={{ mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}><Skeleton width="60%" /></Grid>
                <Grid item xs={12} sm={8}><Skeleton width="80%" height={24} /></Grid>
              </Grid>
              <Divider sx={{ my: 2, borderStyle: 'dashed' }} />
            </Box>
          ))}
        </Paper>
      </Container>
    );
  }

  const displayUsername = profileData.username || user?.username || profileData.fullName;
  const displayEmail = profileData.email || user?.email;
  const displayDob = profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toLocaleDateString() : '';
  const displayGender = profileData.gender ? profileData.gender.charAt(0).toUpperCase() + profileData.gender.slice(1) : '';

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>

      <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 6, border: '1px solid', borderColor: 'grey.200', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'primary.50', display: 'flex' }}>
            <UserIcon size={28} className="text-blue-600" />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={800}>
              Personal Information
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Details associated with your account
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ mb: 4 }} />

        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <InfoRow label="Username" value={displayUsername} />
          <Divider sx={{ my: 2, borderStyle: 'dashed' }} />

          <InfoRow label="Email Address" value={displayEmail} />
          <Divider sx={{ my: 2, borderStyle: 'dashed' }} />

          <InfoRow label="Date of Birth" value={displayDob} />
          <Divider sx={{ my: 2, borderStyle: 'dashed' }} />

          <InfoRow label="Gender" value={displayGender} />
        </Box>
      </Paper>
    </Container>
  );
}
