import { render, fireEvent, cleanup } from '@testing-library/react';
import FluidMotion from './FluidMotion';

const originalMatchMedia = window.matchMedia;
afterEach(() => { cleanup(); jest.restoreAllMocks(); window.matchMedia = originalMatchMedia; });
function media(reduced, fine) {
  const listeners = {};
  window.matchMedia = jest.fn(query => ({ matches: query.includes('reduced') ? reduced : fine, addEventListener: jest.fn((_, fn) => { listeners[query] = fn; }), removeEventListener: jest.fn() }));
  return listeners;
}
test.each([[true,true],[false,false]])('skips canvas and pointer animation for reduced=%s, fine=%s', (reduced,fine) => {
  media(reduced,fine);
  const context = jest.spyOn(HTMLCanvasElement.prototype, 'getContext');
  render(<div className="hero"><FluidMotion /></div>);
  expect(context).not.toHaveBeenCalled();
  expect(document.documentElement.classList.contains('fluid-enabled')).toBe(false);
});
test('fine pointer activates trail and unmount cancels animation/listeners', () => {
  media(false,true);
  jest.spyOn(HTMLCanvasElement.prototype,'getContext').mockReturnValue({setTransform:jest.fn(),clearRect:jest.fn()});
  jest.spyOn(window,'requestAnimationFrame').mockReturnValue(42);
  const cancel=jest.spyOn(window,'cancelAnimationFrame').mockImplementation(()=>{});
  const { container,unmount }=render(<div className="hero"><FluidMotion /><button>Explore</button></div>);
  fireEvent.pointerMove(container.querySelector('button'),{clientX:100,clientY:200,pointerType:'mouse'});
  expect(container.querySelector('.pointer-trail').classList.contains('active')).toBe(true);
  expect(container.querySelector('.pointer-trail').classList.contains('over-control')).toBe(true);
  unmount();
  expect(cancel).toHaveBeenCalledWith(42);
  expect(document.documentElement.classList.contains('fluid-enabled')).toBe(false);
});
