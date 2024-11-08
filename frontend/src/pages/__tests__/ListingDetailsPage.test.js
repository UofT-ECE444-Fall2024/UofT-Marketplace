import { render, screen, waitFor } from '@testing-library/react';
import ListingDetail from '../ListingDetail';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

// Mock fetch to simulate API response
beforeEach(() => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () =>
                Promise.resolve({
                    status: 'success',
                    listing: {
                        id: '1',
                        title: 'Test Item',
                        location: 'New York',
                        price: '$100',
                        description: 'Description of the item',
                        images: ['data:image/jpeg;base64,abcd1234'],
                        seller: {
                            id: 'seller-1',
                            username: 'sellername',
                            full_name: 'Seller Name',
                            email: 'seller@example.com',
                            description: 'Seller Description',
                            verified: true,
                        },
                    },
                }),
        })
    );
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('ListingDetail', () => {
    test('renders ListingDetail with correct data from fetch', async () => {
        render(
            <MemoryRouter initialEntries={['/listings/1']}>
                <Routes>
                    <Route path="/listings/:id" element={<ListingDetail />} />
                </Routes>
            </MemoryRouter>
        );

        // Wait for the listing data to load
        await waitFor(() => expect(screen.getByText(/Test Item/i)).toBeInTheDocument());

        // Verify elements in the document
        expect(screen.getByText(/Test Item/i)).toBeInTheDocument();
        expect(screen.getByText(/New York/i)).toBeInTheDocument();
        expect(screen.getByText(/100/i)).toBeInTheDocument();
        expect(screen.getByText(/Description of the item/)).toBeInTheDocument();
        expect(screen.getByText(/Seller Name/i)).toBeInTheDocument();
    });

    test('handles missing listing data gracefully', async () => {
        // Mock fetch to simulate a failed API response (not found)
        global.fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: false,
                json: () =>
                    Promise.resolve({
                        status: 'error',
                        message: 'Listing not found',
                    }),
            })
        );

        render(
            <MemoryRouter initialEntries={['/listings/999']}>
                <Routes>
                    <Route path="/listings/:id" element={<ListingDetail />} />
                </Routes>
            </MemoryRouter>
        );

        // Wait for the error message to appear
        await waitFor(() => expect(screen.getByText(/Failed to fetch listing details/i)).toBeInTheDocument());
    });
});
