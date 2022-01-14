import React, { useState } from 'react';
import './newfeed.scss';
import { Configure } from 'components/svg';
import Post from './components/post';
import CreatPost from './components/creat-post';
import avatar from 'assets/images/avatar.png';
import sampleBookImg from 'assets/images/sample-book-img.jpg';

const DATA = [
	{
		id: 1,
		userAvatar: avatar,
		userName: 'Trần Văn Đức',
		bookImage: sampleBookImg,
		bookName: 'House of the Witch',
		isLike: true,
		likes: 15,
	},
	{
		id: 2,
		userAvatar: avatar,
		userName: 'Nguyễn Như Quỳnh',
		bookImage: sampleBookImg,
		bookName: 'House of the Witch',
		isLike: false,
		likes: 10,
	},
	{
		id: 3,
		userAvatar: avatar,
		userName: 'Trần Văn Đức',
		bookImage: sampleBookImg,
		bookName: 'House of the Witch',
		isLike: true,
		likes: 6,
	},
	{
		id: 4,
		userAvatar: avatar,
		userName: 'Trần Văn Đức',
		bookImage: sampleBookImg,
		bookName: 'House of the Witch',
		isLike: false,
		likes: 3,
	},
	{
		id: 5,
		userAvatar: avatar,
		userName: 'Trần Văn Đức',
		bookImage: sampleBookImg,
		bookName: 'House of the Witch',
		isLike: false,
		likes: 7,
	},
];

const NewFeed = () => {
	const [postData, setPostData] = useState(DATA);

	const likeAction = param => {
		if (param.isLike) {
			param.isLike = false;
			param.likes -= 1;
		} else {
			param.isLike = true;
			param.likes += 1;
		}
		const newData = [...postData];
		for (let i = 0; i < newData.length; i++) {
			if (param.id === newData[i].id) {
				newData[i] = param;
			}
		}
		setPostData(newData);
	};

	return (
		<div className='newfeed'>
			<div className='newfeed__header'>
				<p>Bảng tin</p>
				<Configure />
			</div>
			<CreatPost />

			{postData.length > 0 &&
				postData.map(item => <Post key={item.id} postInformations={item} likeAction={likeAction} />)}
		</div>
	);
};

export default NewFeed;
