import CreatePost from 'pages/home/components/newfeed/components/create-post';
import './mainPostGroup.scss';
import { getListPost } from 'reducers/redux-utils/group';
import { useEffect, useState, useRef, Suspense, lazy } from 'react';
const Post = lazy(() => import('shared/post'));
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { NotificationError } from 'helpers/Error';
import { GROUP_TYPE } from 'constants/index';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';
import LoadingIndicator from 'shared/loading-indicator';
function MainPostGroup({ handleUpdate, show }) {
	const [listPost, setListPost] = useState([]);
	const [isNewPost, setIsNewPost] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [hasMore, setHasMore] = useState(true);

	const dispatch = useDispatch();
	const { id = '' } = useParams();
	const callApiStart = useRef(10);
	const callApiPerPage = useRef(10);

	const getDataListPostFirstTime = async () => {
		setIsLoading(true);
		const params = {
			query: {
				start: 0,
				limit: callApiPerPage.current,
				sort: JSON.stringify([{ property: 'createdAt', direction: 'DESC' }]),
				filter: JSON.stringify([{ operator: 'eq', value: false, property: 'isDeleted' }]),
			},
			id: id,
		};
		try {
			const newList = await dispatch(getListPost(params)).unwrap();
			setListPost(newList);
		} catch (error) {
			NotificationError(error);
		} finally {
			setIsLoading(false);
		}
	};
	const getDataListPost = async () => {
		const params = {
			query: {
				start: callApiStart.current,
				limit: callApiPerPage.current,
				sort: JSON.stringify([{ property: 'createdAt', direction: 'DESC' }]),
				filter: JSON.stringify([{ operator: 'eq', value: false, property: 'isDeleted' }]),
			},
			id: id,
		};
		try {
			const newList = await dispatch(getListPost(params)).unwrap();
			if (newList.length > 0) {
				callApiStart.current += callApiPerPage.current;
				setListPost(listPost.concat(newList));
			} else {
				setHasMore(false);
			}
		} catch (error) {
			NotificationError(error);
		}
	};

	const onChangeNewPost = () => {
		setIsNewPost(!isNewPost);
		handleUpdate();
	};

	useEffect(async () => {
		callApiStart.current = 10;
		getDataListPostFirstTime();
	}, [isNewPost]);

	const handleUpdatePostArrWhenDeleted = itemMinipostId => {
		const index = listPost.findIndex(item => item.id === itemMinipostId);
		const newItem = { ...listPost[index], isDeleted: true };
		const newArr = [...listPost];
		newArr[index] = { ...newItem };
		setListPost(newArr);
	};

	return (
		<div className='main-content__container'>
			{show && <CreatePost onChangeNewPost={onChangeNewPost} />}
			{isLoading ? (
				<LoadingIndicator />
			) : (
				<>
					{listPost.length > 0 ? (
						<InfiniteScroll
							dataLength={listPost.length}
							next={getDataListPost}
							hasMore={hasMore}
							loader={<LoadingIndicator />}
						>
							{listPost.map((item, index) => {
								if (!item.isDeleted) {
									return (
										<Suspense key={index} fallback={<></>}>
											<Post
												postInformations={item}
												type={GROUP_TYPE}
												handleUpdatePostArrWhenDeleted={handleUpdatePostArrWhenDeleted}
											/>
										</Suspense>
									);
								}
							})}
						</InfiniteScroll>
					) : (
						<p className='post-data__blank'>Nhóm chưa có bài viết nào</p>
					)}
				</>
			)}
		</div>
	);
}

export default MainPostGroup;

MainPostGroup.defaultProps = {
	handleUpdate: () => {},
	show: false,
};

MainPostGroup.propTypes = {
	handleUpdate: PropTypes.func,
	show: PropTypes.bool,
};
