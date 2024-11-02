import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ListingsPage from '../ListingsPage'; // Adjusted to point to ListingsPage

// Mock the ListingCard component
jest.mock('../../components/ListingCard', () => {
  return function MockListingCard({ title }) {
    return <div>{title}</div>;
  };
});

describe('ListingsPage', () => {
  test('renders ListingsPage component', () => {
    render(<ListingsPage />);
    
    // Check if the "Add Listing" button is rendered
    expect(screen.getByRole('button', { name: '+ Add Listing' })).toBeInTheDocument();
    
    // Check if the message for no listings is displayed initially
    expect(screen.getByText(/no listings available currently/i)).toBeInTheDocument();
  });

  test('opens AddListingPopup when the button is clicked', () => {
    render(<ListingsPage />);
    
    // Click the "Add Listing" button
    fireEvent.click(screen.getByRole('button', { name: '+ Add Listing' }));

    // Check if the AddListingPopup is opened
    expect(screen.getByLabelText(/close/i)).toBeInTheDocument();
  });

});
