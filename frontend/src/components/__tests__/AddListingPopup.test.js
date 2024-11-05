import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddListingPopup from '../AddListingPopup';

describe('AddListingPopup', () => {
  const onCloseMock = jest.fn();
  const onPublishMock = jest.fn();

  beforeEach(() => {
    onCloseMock.mockClear();
    onPublishMock.mockClear();
  });

  test('renders correctly when open', () => {
    render(<AddListingPopup open={true} onClose={onCloseMock} onPublish={onPublishMock} />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  test('closes the popup when close button is clicked', () => {
    render(<AddListingPopup open={true} onClose={onCloseMock} onPublish={onPublishMock} />);

    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onCloseMock).toHaveBeenCalled();
  });

  test('shows an error when publishing without required fields', async () => {
    render(<AddListingPopup open={true} onClose={onCloseMock} onPublish={onPublishMock} />);

    fireEvent.click(screen.getByRole('button', { name: /publish/i }));

    expect(await screen.findByText(/please fill in all required fields/i)).toBeInTheDocument();
  });

});
