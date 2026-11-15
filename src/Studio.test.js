import {render,screen,fireEvent,waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import StudioTerminal,{StudioRoom} from './Studio';
beforeAll(()=>{HTMLMediaElement.prototype.play=jest.fn().mockResolvedValue();HTMLMediaElement.prototype.pause=jest.fn();Element.prototype.scrollIntoView=jest.fn();});
function submit(value){fireEvent.change(screen.getByLabelText('Terminal command'),{target:{value}});fireEvent.click(screen.getByRole('button',{name:'Run command'}));}
test('terminal commands filter real projects, change lighting, and reject unsupported commands',()=>{
 const onSearch=jest.fn(),onGrade=jest.fn();render(<StudioTerminal onSearch={onSearch} onGrade={onGrade}/>);
 submit('find speech');expect(onSearch).toHaveBeenCalledWith('speech');expect(screen.getByRole('log')).toHaveTextContent('Medical Speech Recognition');
 submit('theme acid');expect(onGrade).toHaveBeenCalledWith('acid');
 submit('theme invalid');expect(onGrade).toHaveBeenCalledTimes(1);
 submit('rm -rf /');expect(screen.getByRole('log')).toHaveTextContent('Unknown command: rm');
 fireEvent.keyDown(screen.getByLabelText('Terminal command'),{key:'ArrowUp'});expect(screen.getByLabelText('Terminal command')).toHaveValue('rm -rf /');
 submit('clear');expect(screen.getByRole('log')).toBeEmptyDOMElement();
});
test('audio is opt-in, valid playback reports success, stop pauses it',async()=>{
 render(<StudioTerminal onSearch={()=>{}} onGrade={()=>{}}/>);
 submit('play relaxed');await waitFor(()=>expect(screen.getByRole('log')).toHaveTextContent('Playing relaxed'));
 expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
 submit('stop');expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();expect(screen.getByRole('log')).toHaveTextContent('Playback stopped');
});
test('studio station changes the project entrance',()=>{
 render(<StudioRoom/>);expect(screen.getByRole('link',{name:/Enter/})).toHaveAttribute('href','#speech');
 fireEvent.click(screen.getByRole('button',{name:/The agent console/}));expect(screen.getByRole('link',{name:/Enter/})).toHaveAttribute('href','#support');
});
