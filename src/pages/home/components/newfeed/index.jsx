// import { Configure } from 'components/svg';
import { useState, useRef, useEffect } from 'react';
import Post from 'shared/post';
import CreatePost from './components/create-post';
import './newfeed.scss';
// import ModalfilterHome from './components/modal-filter-home';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getActivityList } from 'reducers/redux-utils/activity';
import { useDispatch, useSelector } from 'react-redux';
import { NotificationError } from 'helpers/Error';
import LoadingIndicator from 'shared/loading-indicator';
import { POST_TYPE, GROUP_TYPE } from 'constants/index';

const NewFeed = () => {
	const [isNewPost, setIsNewPost] = useState(false);
	const { refreshNewfeed } = useSelector(state => state.activity);
	const [hasMore, setHasMore] = useState(true);
	const [postList, setPostList] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const dispatch = useDispatch();

	const callApiStart = useRef(10);
	const callApiPerPage = useRef(10);

	const onChangeNewPost = () => {
		setIsNewPost(!isNewPost);
	};

	useEffect(async () => {
		callApiStart.current = 10;
		getPostListFirstTime();
	}, [isNewPost, refreshNewfeed]);

	const getPostListFirstTime = async () => {
		setIsLoading(true);
		try {
			const params = {
				start: 0,
				limit: callApiPerPage.current,
				sort: JSON.stringify([{ property: 'createdAt', direction: 'DESC' }]),
			};
			const posts = await dispatch(getActivityList(params)).unwrap();
			setPostList(posts);
			if (posts.length < callApiPerPage.current) {
				setHasMore(false);
			}
		} catch (err) {
			NotificationError(err);
		} finally {
			setIsLoading(false);
		}
	};

	const getPostList = async () => {
		try {
			const params = {
				start: callApiStart.current,
				limit: callApiPerPage.current,
				sort: JSON.stringify([{ property: 'createdAt', direction: 'DESC' }]),
			};
			const posts = await dispatch(getActivityList(params)).unwrap();
			callApiStart.current += callApiPerPage.current;
			setPostList(postList.concat(posts));
			if (posts.length < callApiPerPage.current) {
				setHasMore(false);
			}
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleUpdatePostArrWhenDeleted = itemMinipostId => {
		const index = postList.findIndex(item => item.id === itemMinipostId);
		const newItem = { ...postList[index], isDeleted: true };
		const newArr = [...postList];
		newArr[index] = { ...newItem };
		setPostList(newArr);
	};

	return (
		<div className='newfeed'>
			<div className='newfeed__header'>
				<p>Bảng tin</p>
			</div>
			{<CreatePost onChangeNewPost={onChangeNewPost} />}

			{isLoading ? (
				<LoadingIndicator />
			) : (
				<>
					{postList.length > 0 && (
						<InfiniteScroll
							dataLength={postList.length}
							next={getPostList}
							hasMore={hasMore}
							loader={<LoadingIndicator />}
						>
							{postList.map((item, index) => {
								if (!item.isDeleted) {
									return (
										<Post
											key={index}
											postInformations={item}
											type={item.verb === 'groupPost' ? GROUP_TYPE : POST_TYPE}
											handleUpdatePostArrWhenDeleted={handleUpdatePostArrWhenDeleted}
										/>
									);
								}
							})}
						</InfiniteScroll>
					)}
				</>
			)}
		</div>
	);
};

export default NewFeed;
