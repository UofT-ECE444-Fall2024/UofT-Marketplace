import React, { useState } from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import SearchBar from '../SearchBar';

describe('SearchBar Component', () => {
  let searchAndFilterNavigate;

  beforeEach(() => {
    searchAndFilterNavigate = jest.fn();
  });

  // Wrapper component to use actual React state for queries and setQueries
  const Wrapper = () => {
    const [queries, setQueries] = useState({});
    return (
      <SearchBar
        queries={queries}
        setQueries={setQueries}
        searchAndFilterNavigate={searchAndFilterNavigate}
      />
    );
  };

  it('renders correctly with an input field and search button', () => {
    render(<Wrapper />);

    // Check if the input and button are in the document
    expect(screen.getByPlaceholderText(/search listings/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('updates the search query when typing in the input', () => {
    render(<Wrapper />);
    
    const input = screen.getByPlaceholderText(/search listings/i);
    fireEvent.change(input, { target: { value: 'test search' } });

    // Check if the search input is updated by verifying the onChange behavior
    expect(input.value).toBe('test search');
  });

  it('submits the search when the search button is clicked', () => {
    render(<Wrapper />);

    const input = screen.getByPlaceholderText(/search listings/i);
    fireEvent.change(input, { target: { value: 'test search' } });

    const button = screen.getByRole('button', { name: /search/i });
    fireEvent.click(button);

    // Verify searchAndFilterNavigate is called with the updated queries
    expect(searchAndFilterNavigate).toHaveBeenCalledWith({ search: 'test%20search' });
  });

  it('submits the search when Enter is pressed', () => {
    render(<Wrapper />);

    const input = screen.getByPlaceholderText(/search listings/i);
    fireEvent.change(input, { target: { value: 'test search' } });

    // Trigger Enter key
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', keyCode: 13, charCode: 13 });

    // Verify searchAndFilterNavigate is called with the updated queries
    expect(searchAndFilterNavigate).toHaveBeenCalledWith({ search: 'test%20search' });
  });
});
