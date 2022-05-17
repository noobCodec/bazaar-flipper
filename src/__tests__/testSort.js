require('jest-fetch-mock').enableMocks()
import 'regenerator-runtime/runtime'
import React from 'react';
import { render, screen , fireEvent, waitFor } from '@testing-library/react';
import Clock from "../Clock"

// Render Sanity Check
it('Render and Check for Item', async () => {
    render(<Clock />);
    await waitFor(() => {
        fireEvent.click(screen.getByText("Cobblestone"));
      });
    expect(screen.getByText("Cobblestone"));
});

it('Check Buy Orders', async () => {
    render(<Clock />);
    await waitFor(() => {
        fireEvent.click(screen.getByText("Cobblestone"));
      });
    expect(screen.getByText("Cobblestone"));
});
