import { useFetchActivities } from 'api/activity.hooks';
import { Configure } from 'components/svg';
import _ from 'lodash';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Post from 'shared/post';
import CreatPost from './components/creat-post';
import './newfeed.scss';

const NewFeed = () => {
	const [isNewPost, setIsNewPost] = useState(false);
	const { userInfo = {} } = useSelector(state => state.auth);
	const { activity: postList } = useFetchActivities(1, 10, '[]', isNewPost);

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

			{postList.length > 0 && postList.map(item => <Post key={item.id} postInformations={item} />)}
		</div>
	);
};

export default NewFeed;
