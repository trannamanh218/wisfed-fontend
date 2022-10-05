import CreatePost from 'pages/home/components/newfeed/components/creat-post';
import Post from 'shared/post';
import './mainPostGroup.scss';
import { getListPost } from 'reducers/redux-utils/group';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { NotificationError } from 'helpers/Error';
import { GROUP_TYPE } from 'constants/index';
import PropTypes from 'prop-types';

function MainPostGroup({ handleUpdate }) {
	const [listPost, setListPost] = useState([]);
	const [isNewPost, setIsNewPost] = useState(false);
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

	const onChangeNewPost = () => {
		setIsNewPost(!isNewPost);
		handleUpdate();
	};

	useEffect(() => {
		getDataListPost();
	}, [isNewPost]);

	return (
		<div className='main-content__container'>
			<CreatePost onChangeNewPost={onChangeNewPost} />
			<div className='main-content__post'>
				{listPost.map((item, index) => {
					return <Post key={index} postInformations={item} type={GROUP_TYPE} />;
				})}
			</div>
		</div>
	);
}

export default MainPostGroup;

MainPostGroup.propTypes = {
	handleUpdate: PropTypes.func,
};
