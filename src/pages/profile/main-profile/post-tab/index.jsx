import { useState, useEffect, useRef, memo, lazy, Suspense } from 'react';
const Post = lazy(() => import('shared/post'));
import './post-tab.scss';
import { getPostsByUser } from 'reducers/redux-utils/post';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import InfiniteScroll from 'react-infinite-scroll-component';
import LoadingIndicator from 'shared/loading-indicator';
import PropTypes from 'prop-types';
import { POST_TYPE } from 'constants/index';
import classNames from 'classnames';
import CreatePost from 'pages/home/components/newfeed/components/create-post';

function PostTab({ currentTab }) {
	const [postList, setPostList] = useState([]);
	const [hasMore, setHasMore] = useState(true);
	const [loading, setLoading] = useState(true);
	const [isNewPost, setIsNewPost] = useState(false);

	const { userId } = useParams();
	const dispatch = useDispatch();
	const { userInfo } = useSelector(state => state.auth);

	const callApiStart = useRef(5);
	const callApiPerPage = useRef(5);

	useEffect(() => {
		if (currentTab === 'post') {
			callApiStart.current = 5;
			setLoading(true);
			setHasMore(true);
			setPostList([]);
		}
	}, [userId, isNewPost]);

	useEffect(() => {
		if (!postList.length && currentTab === 'post' && hasMore) {
			getPostListByUserFirstTime();
		}
	}, [postList, currentTab]);

	const getPostListByUserFirstTime = async () => {
		try {
			const data = {
				params: {
					start: 0,
					limit: callApiPerPage.current,
					sort: JSON.stringify([{ property: 'createdAt', direction: 'DESC' }]),
				},
				userId: userId,
			};
			const posts = await dispatch(getPostsByUser(data)).unwrap();
			setPostList(posts);
			if (posts.length < callApiPerPage.current) {
				setHasMore(false);
			}
		} catch (err) {
			NotificationError(err);
		} finally {
			setLoading(false);
		}
	};

	const getPostListByUser = async () => {
		try {
			const data = {
				params: {
					start: callApiStart.current,
					limit: callApiPerPage.current,
					sort: JSON.stringify([{ property: 'createdAt', direction: 'DESC' }]),
				},
				userId: userId,
			};
			const posts = await dispatch(getPostsByUser(data)).unwrap();
			setPostList(postList.concat(posts));
			if (posts.length < callApiPerPage.current) {
				setHasMore(false);
			} else {
				callApiStart.current += callApiPerPage.current;
			}
		} catch (err) {
			NotificationError(err);
		} finally {
			setLoading(false);
		}
	};

	const onChangeNewPost = () => {
		setIsNewPost(!isNewPost);
	};

	const handleUpdatePostArrWhenDeleted = itemMinipostId => {
		const index = postList.findIndex(item => item.id === itemMinipostId);
		postList.splice(index, 1);
		const cloneArr = [...postList];
		setPostList(cloneArr);
	};

	return (
		<div className={classNames('post-tab', { 'loading': loading })}>
			{userId === userInfo.id && <CreatePost onChangeNewPost={onChangeNewPost} />}
			{loading ? (
				<LoadingIndicator />
			) : (
				<>
					{currentTab === 'post' && !!postList.length ? (
						<InfiniteScroll
							dataLength={postList.length}
							next={getPostListByUser}
							hasMore={hasMore}
							loader={<LoadingIndicator />}
						>
							{postList.map(item => {
								if (!item.isDeleted) {
									return (
										<Suspense key={item.id} fallback={<></>}>
											<Post
												postInformations={item}
												type={POST_TYPE}
												handleUpdatePostArrWhenDeleted={handleUpdatePostArrWhenDeleted}
											/>
										</Suspense>
									);
								}
							})}
						</InfiniteScroll>
					) : (
						<p className='post-data__blank'>{!hasMore ? 'Không có bài viết nào' : <LoadingIndicator />}</p>
					)}
				</>
			)}
		</div>
	);
}

PostTab.propTypes = {
	currentTab: PropTypes.string,
};

export default memo(PostTab);
