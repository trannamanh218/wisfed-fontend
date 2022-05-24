import CreatePost from 'pages/home/components/newfeed/components/creat-post';
import Post from 'shared/post';
import './mainPostGroup.scss';
import { getListPost } from 'reducers/redux-utils/group';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { NotificationError } from 'helpers/Error';

function MainPostGroup() {
	const [listPost, setListPost] = useState([]);
	const dispatch = useDispatch();
	const { id = '' } = useParams();

	const getDataListPost = async () => {
		const params = {
			query: {
				sort: JSON.stringify([{ property: 'createdAt', direction: 'DESC' }]),
			},
			id: id,
		};
		try {
			const newList = await dispatch(getListPost(params)).unwrap();
			setListPost(newList);
		} catch (error) {
			NotificationError(error);
		}
	};

	useEffect(() => {
		getDataListPost();
	}, []);

	return (
		<div className='main-content__container'>
			<CreatePost />
			<div className='main-content__post'>
				{listPost.map(item => {
					return (
						<>
							<Post postInformations={item} className={''} />
						</>
					);
				})}
			</div>
		</div>
	);
}

export default MainPostGroup;
