import { useFetchActivities } from 'api/activity.hooks';
import { Configure } from 'components/svg';
import _ from 'lodash';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Post from 'shared/post';
import CreatPost from './components/creat-post';
import './newfeed.scss';
import Modalfilterhome from './components/modal-filter-home';

const NewFeed = () => {
	const [isNewPost, setIsNewPost] = useState(false);
	const { userInfo = {} } = useSelector(state => state.auth);
	const { activity: postList } = useFetchActivities(1, 10, '[]', isNewPost);
	const [modalShow, setModalShow] = useState(false);

	const onChangeNewPost = () => {
		setIsNewPost(true);
	};

	const handleModalFilter = () => {
		setModalShow(true);
	};

	return (
		<div className='newfeed'>
			<div className='newfeed__header'>
				<p>Bảng tin</p>
				<div onClick={handleModalFilter}>
					<Configure />
				</div>
			</div>
			<Modalfilterhome modalShow={modalShow} setModalShow={setModalShow} />
			{!_.isEmpty(userInfo) && <CreatPost onChangeNewPost={onChangeNewPost} />}

			{postList.length > 0 && postList.map(item => <Post key={item.id} postInformations={item} />)}
		</div>
	);
};

export default NewFeed;
