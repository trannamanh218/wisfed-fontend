import React, { useState } from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import IntroGroup from './introGroup';
import MainPostGroup from './MainPostGroup';
import MemberGroup from './MemberGroup';

function MainGroupComponentStories() {
	const [key, setKey] = useState('intro');

	return (
		<div className='group-tabs'>
			<Tabs id='controlled-tab' activeKey={key} onSelect={k => setKey(k)} className='mb-3'>
				<Tab eventKey='intro' title='Giới thiệu'>
					<IntroGroup />
				</Tab>
				<Tab eventKey='post' title='Bài viết'>
					<MainPostGroup />
				</Tab>
				<Tab eventKey='member' title='Thành viên'>
					<MemberGroup />
				</Tab>
			</Tabs>
		</div>
	);
}

export default MainGroupComponentStories;
