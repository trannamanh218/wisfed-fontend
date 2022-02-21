import { useFetchActivities } from 'api/activity.hooks';
import avatar from 'assets/images/avatar.png';
import sampleBookImg from 'assets/images/sample-book-img.jpg';
import { Configure } from 'components/svg';
import { generateQueryString } from 'helpers/Common';
import _ from 'lodash';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Post from 'shared/post';
import CreatPost from './components/creat-post';
import './newfeed.scss';

const DATA = [
	{
		id: 1,
		userAvatar: avatar,
		userName: 'Trần Văn Đức',
		bookImage: sampleBookImg,
		bookName: 'House of the Witch',
		isLike: true,
		likeNumber: 12,
		commentNumber: 10,
		shareNumber: 27,
	},
	{
		id: 2,
		userAvatar: avatar,
		userName: 'Nguyễn Như Quỳnh',
		bookImage: sampleBookImg,
		bookName: 'House of the Witch',
		isLike: false,
		likeNumber: 12,
		commentNumber: 10,
		shareNumber: 27,
	},
	{
		id: 3,
		userAvatar: avatar,
		userName: 'Trần Văn Đức',
		bookImage: sampleBookImg,
		bookName: 'House of the Witch',
		isLike: true,
		likeNumber: 12,
		commentNumber: 10,
		shareNumber: 27,
	},
	{
		id: 4,
		userAvatar: avatar,
		userName: 'Trần Văn Đức',
		bookImage: sampleBookImg,
		bookName: 'House of the Witch',
		isLike: false,
		likeNumber: 12,
		commentNumber: 10,
		shareNumber: 27,
	},
	{
		id: 5,
		userAvatar: avatar,
		userName: 'Trần Văn Đức',
		bookImage: sampleBookImg,
		bookName: 'House of the Witch',
		isLike: false,
		likeNumber: 12,
		commentNumber: 10,
		shareNumber: 27,
	},
];

const NewFeed = () => {
	const [postData, setPostData] = useState(DATA);
	const [isNewPost, setIsNewPost] = useState(false);
	const { userInfo = {} } = useSelector(state => state.auth);
	const query = generateQueryString({
		start: 0,
		limit: 0,
		sort: JSON.stringify([{ 'direction': 'DESC', 'property': 'createdAt' }]),
	});

	const { activity: postList } = useFetchActivities(query, isNewPost);

	const likeAction = param => {
		if (param.isLike) {
			param.isLike = false;
			param.likeNumber--;
		} else {
			param.isLike = true;
			param.likeNumber++;
		}
		const newData = [...postData];
		for (let i = 0; i < newData.length; i++) {
			if (param.id === newData[i].id) {
				newData[i] = param;
			}
		}
		setPostData(newData);
	};

	const onChangeNewPost = () => {
		setIsNewPost(true);
	};

	return (
		<div className='newfeed'>
			<div className='newfeed__header'>
				<p>Bảng tin</p>
				<Configure />
			</div>
			{!_.isEmpty(userInfo) && <CreatPost onChangeNewPost={onChangeNewPost} />}

			{postList.length > 0 &&
				postList.map(item => <Post key={item.id} postInformations={item} likeAction={likeAction} />)}
		</div>
	);
};

export default NewFeed;
