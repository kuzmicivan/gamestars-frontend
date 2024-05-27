import React from 'react';
import { render } from '@testing-library/react';
import Header from '../components/Header';

test('renders header with title and navigation link', () => {
  const { getByText } = render(<Header />);
  expect(getByText('GameStars')).toBeInTheDocument();
  expect(getByText('Tournaments')).toBeInTheDocument();
});
