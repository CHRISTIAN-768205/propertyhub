import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '${API_URL}/api';

export const trackPropertyView = async (propertyId) => {
  try {
    const response = await axios.post(
      `${API_URL}/analytics/track-view/${propertyId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error tracking view:', error);
  }
};

export const getPropertyAnalytics = async (propertyId) => {
  try {
    const response = await axios.get(
      `${API_URL}/analytics/property/${propertyId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return null;
  }
};

export const getLandlordAnalytics = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/analytics/landlord/properties`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching landlord analytics:', error);
    return [];
  }
};
