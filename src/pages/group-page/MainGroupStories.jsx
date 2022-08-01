import { useState } from 'react';
import './mainGroup.scss';
import MainGroupComponent from './popup-group/MainGroupComponet/MainGroupComponent';

const MainGroupStories = () => {
	const [keyChange, setKeyChange] = useState('settingsQuestion');

	const handleChange = e => {
		setKeyChange(e);
	};

	return (
		<div className='group-main__container'>
			<MainGroupComponent handleChange={handleChange} keyChange={keyChange} />
		</div>
	);
};

export default MainGroupStories;
