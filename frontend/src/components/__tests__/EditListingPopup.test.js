import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditListingPopup from '../EditListingPopup';

describe('EditListingPopup', () => {
  const onCloseMock = jest.fn();
  const onSaveMock = jest.fn();

  beforeEach(() => {
    onCloseMock.mockClear();
    onSaveMock.mockClear();
  });

  test('renders correctly when open', () => {
    render(<EditListingPopup open={true} onClose={onCloseMock} onSave={onSaveMock} />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  test('closes the popup when close button is clicked', () => {
    render(<EditListingPopup open={true} onClose={onCloseMock} onSave={onSaveMock} />);

    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onCloseMock).toHaveBeenCalled();
  });

  test('shows an error when saving without required fields', async () => {
    render(<EditListingPopup open={true} onClose={onCloseMock} onSave={onSaveMock} />);

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(await screen.findByText(/Please complete all required fields./i)).toBeInTheDocument();
  });
});
