import React from 'react';
import FormCheckGroup from 'shared/form-check-group';
import './chooseTopic.scss';
import Logo from 'assets/images/Logo 2.png';
import SearchField from 'shared/search-field';

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
				title: 'Title 7',
				value: 1,
			},
			name: 'group1',
			value: 'default',
			handleChange: () => {},
		},
		{
			type: 'checkbox',
			data: {
				title: 'Title 5',
				value: 1,
			},
			name: 'group1',
			value: 'default',
			handleChange: () => {},
		},
	];
	return (
		<div className='choose-topic__container'>
			<div className='choose-topic__header'>
				<img src={Logo} alt='img' />
			</div>
			<div className='choose-topic__body'>
				<div className='choose-topic__title'>
					<span>Lựa chọn ít nhất 02 chủ đề bạn yêu thích</span>
				</div>
				<div className='choose-topic__subcribe'>
					<span>
						Chúng tôi sử dụng lựa chọn chủ đề yêu thích của bạn để đưa ra các đề xuất tốt nhất cho bạn
					</span>
				</div>
				<div className='choose-topic__search'>
					<SearchField placeholder='Tìm kiếm chủ đề' />
				</div>
				<div className='choose-topic__box'>
					{listTopic.map(item => {
						return (
							<>
								<FormCheckGroup type={item.type} data={item.data} />
							</>
						);
					})}
				</div>
				<div className='choose-topic__button'>
					<button>TIếp tục</button>
				</div>
			</div>
		</div>
	);
}

export default ChooseTopic;
