import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Skeleton from './Skeleton';

describe('Skeleton Component', () => {
  it('renders correctly', () => {
    const { container } = render(<Skeleton width="100px" height="20px" />);
    const skeleton = container.firstChild;
    expect(skeleton).toBeDefined();
    expect(skeleton.style.width).toBe('100px');
    expect(skeleton.style.height).toBe('20px');
  });

  it('applies circle class when circle prop is true', () => {
    const { container } = render(<Skeleton circle={true} />);
    const skeleton = container.firstChild;
    expect(skeleton.className).toContain('rounded-full');
  });
});
