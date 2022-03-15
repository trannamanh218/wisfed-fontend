import React from 'react';
import MultipleCheckbox from 'shared/multiple-checkbox';

function ChooseTopic() {
	const listTopic = [
		{
			type: 'checkbox',
			data: {
				title: 'Title 1',
				value: 1,
			},
			name: 'group1',
			value: 'default',
			handleChange: () => {},
		},
		{
			type: 'checkbox',
			data: {
				title: 'Title 2',
				value: 1,
			},
			name: 'group1',
			value: 'default',
			handleChange: () => {},
		},
		{
			type: 'checkbox',
			data: {
				title: 'Title 2',
				value: 1,
			},
			name: 'group1',
			value: 'default',
			handleChange: () => {},
		},
		{
			type: 'checkbox',
			data: {
				title: 'Title 2',
				value: 1,
			},
			name: 'group1',
			value: 'default',
			handleChange: () => {},
		},
		{
			type: 'checkbox',
			data: {
				title: 'Title 2',
				value: 1,
			},
			name: 'group1',
			value: 'default',
			handleChange: () => {},
		},
		{
			type: 'checkbox',
			data: {
				title: 'Title 2',
				value: 1,
			},
			name: 'group1',
			value: 'default',
			handleChange: () => {},
		},
		{
			type: 'checkbox',
			data: {
				title: 'Title 2',
				value: 1,
			},
			name: 'group1',
			value: 'default',
			handleChange: () => {},
		},
		{
			type: 'checkbox',
			data: {
				title: 'Title 2',
				value: 1,
			},
			name: 'group1',
			value: 'default',
			handleChange: () => {},
		},
		{
			type: 'checkbox',
			data: {
				title: 'Title 2',
				value: 1,
			},
			name: 'group1',
			value: 'default',
			handleChange: () => {},
		},
	];
	return (
		<div>
			<MultipleCheckbox list={listTopic} />
		</div>
	);
}

export default ChooseTopic;
