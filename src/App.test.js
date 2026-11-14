import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

beforeAll(() => {
  HTMLMediaElement.prototype.play = jest.fn().mockResolvedValue();
  HTMLMediaElement.prototype.pause = jest.fn();
});
test('archive filters, searches, and recovers from empty results', () => {
  const { container } = render(<App />);
  expect(container.querySelectorAll('.archive-card')).toHaveLength(28);
  fireEvent.click(screen.getByRole('button', { name: 'Agents', exact: true }));
  expect(container.querySelectorAll('.archive-card')).toHaveLength(6);
  fireEvent.click(screen.getByRole('button', { name: 'All', exact: true }));
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'Mosaic' } });
  expect(container.querySelectorAll('.archive-card')).toHaveLength(1);
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'zzzz' } });
  expect(screen.getByText(/No projects match/)).toBeInTheDocument();
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: '' } });
  expect(container.querySelectorAll('.archive-card')).toHaveLength(28);
});
test('walkthrough advances and mobile navigation closes after selection', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: /Next step/ }));
  expect(screen.getByText('Facts before answers.')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Menu', exact: true }));
  expect(screen.getByRole('button', { name: 'Close', exact: true })).toHaveAttribute('aria-expanded', 'true');
  fireEvent.click(screen.getByRole('link', { name: 'Archive', exact: true }));
  expect(screen.getByRole('button', { name: 'Menu', exact: true })).toHaveAttribute('aria-expanded', 'false');
});
test('audio is opt-in, emotion changes stop playback, and private projects have no links', async () => {
  const { container } = render(<App />);
  expect(container.querySelector('audio')).not.toHaveAttribute('autoplay');
  fireEvent.click(screen.getByRole('button', { name: 'Play Happy sample' }));
  expect(await screen.findByRole('button', { name: 'Pause Happy sample' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Sad', exact: true }));
  expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
  expect(screen.getByRole('button', { name: 'Play Sad sample' })).toBeInTheDocument();
  expect(container.querySelector('audio').src).toContain('/audio/sad.mp3');
  expect(screen.getByText('Translating Toadstool').closest('a')).toBeNull();
  expect(container.textContent).not.toContain('TEC');
});
