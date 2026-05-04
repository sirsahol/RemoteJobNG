import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PricingCard } from './PricingCard';

describe('PricingCard', () => {
  const mockPlan = {
    id: 'plan_1',
    name: 'Pro Protocol',
    price_ngn: 49000,
    price_usd: 49,
    features: ['Priority Queue', 'Neural Matching'],
    tier: 'featured'
  };

  it('renders plan details', () => {
    render(<PricingCard plan={mockPlan} index={0} initiating={null} onSelect={() => {}} />);
    expect(screen.getByText('Pro Protocol')).toBeInTheDocument();
    expect(screen.getByText(/49,000/)).toBeInTheDocument();
    expect(screen.getByText('Priority Queue')).toBeInTheDocument();
  });

  it('shows featured state', () => {
    const { container } = render(<PricingCard plan={mockPlan} index={0} initiating={null} onSelect={() => {}} />);
    expect(container.firstChild.className).toContain('border-blue-500');
  });
});
