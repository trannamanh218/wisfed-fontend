import { Configure } from 'components/svg';
import _ from 'lodash';
import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Post from 'shared/post';
import CreatPost from './components/creat-post';
import './newfeed.scss';
import Modalfilterhome from './components/modal-filter-home';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getActivityList } from 'reducers/redux-utils/activity';
import { useDispatch } from 'react-redux';
import { NotificationError } from 'helpers/Error';

const NewFeed = () => {
	const [isNewPost, setIsNewPost] = useState(false);
	const { userInfo } = useSelector(state => state.auth);
	const [modalShow, setModalShow] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const [postList, setPostList] = useState([]);

	const dispatch = useDispatch();

	const callApiStart = useRef(0);
	const callApiPerPage = useRef(10);

	const onChangeNewPost = () => {
		setIsNewPost(!isNewPost);
	};

	const handleModalFilter = () => {
		setModalShow(true);
	};

	useEffect(() => {
		getPostList();
	}, []);

	const getPostList = async () => {
		try {
			const params = {
				start: callApiStart.current,
				limit: callApiPerPage.current,
				sort: JSON.stringify([{ property: 'createdAt', direction: 'DESC' }]),
			};
			const posts = await dispatch(getActivityList(params)).unwrap();
			if (posts.length) {
				callApiStart.current += callApiPerPage.current;
				setPostList(postList.concat(posts));
			} else {
				setHasMore(false);
			}
		} catch (err) {
			NotificationError(err);
		}
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

			{postList.length > 0 && (
				<InfiniteScroll
					dataLength={postList.length}
					next={getPostList}
					hasMore={hasMore}
					loader={<h4>Loading...</h4>}
				>
					{postList.map(item => (
						<Post key={item.id} postInformations={item} />
					))}
				</InfiniteScroll>
			)}
		</div>
	);
};

export default NewFeed;
