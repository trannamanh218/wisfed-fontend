import Post from 'shared/post';
import './mainPostGroup.scss';
import { getListPost } from 'reducers/redux-utils/group';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { NotificationError } from 'helpers/Error';
import { GROUP_TYPE } from 'constants/index';

const MainPostGroupView = () => {
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
			<div className='main-content__post__review'>
				{listPost.map(item => {
					return (
						<div key={item.id}>
							<Post postInformations={item} type={GROUP_TYPE} />
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default MainPostGroupView;
