import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StatCard from './StatCard';

describe('StatCard', () => {
  it('renders the title, value, and growth correctly', () => {
    render(
      <StatCard
        title="Total Revenue"
        value={5000}
        growth={10}
        prefix="$"
      />
    );

    // Check that the title is displayed
    expect(screen.getByText('Total Revenue')).toBeInTheDocument();

    // Check that the value is displayed with the correct prefix
    expect(screen.getByText('$5,000')).toBeInTheDocument();

    // Check that the growth is displayed
    expect(screen.getByText('10%')).toBeInTheDocument();
  });

  it('handles negative growth correctly', () => {
    render(
      <StatCard
        title="RTO Rate"
        value={5}
        growth={-5}
        suffix="%"
        inverse
      />
    );

    // Check that the negative growth is displayed
    expect(screen.getByText('-5%')).toBeInTheDocument();
  });
});
