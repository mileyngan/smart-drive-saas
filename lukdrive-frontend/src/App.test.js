import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

test('renders the landing page on the default route', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  // Check for a heading element that is unique to the LandingPage or a major layout component.
  // This text can be adapted if the actual landing page content is different.
  const headingElement = screen.getByText(/Create a new school account/i);
  expect(headingElement).toBeInTheDocument();
});
