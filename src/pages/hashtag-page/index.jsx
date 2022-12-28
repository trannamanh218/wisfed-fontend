import NormalContainer from 'components/layout/normal-container';
import './hashtag-page.scss';
import Post from 'shared/post';
import { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { NotificationError } from 'helpers/Error';
import LoadingIndicator from 'shared/loading-indicator';
import { GROUP_TYPE } from 'constants/index';
import { getListPostByHashtag, getListPostByHashtagGroup } from 'reducers/redux-utils/hashtag-page';
import InfiniteScroll from 'react-infinite-scroll-component';
import LoadingTimeLine from 'shared/loading-timeline';
import BackButton from 'shared/back-button';

export default function HashtagPage() {
	const dispatch = useDispatch();
	const { hashtag, groupId } = useParams();

	const [isFetching, setIsFetching] = useState(true);

	const [postList, setPostList] = useState([]);
	const [hasMore, setHasMore] = useState(true);

	const callApiStart = useRef(5);
	const callApiPerPage = useRef(5);

	useEffect(() => {
		callApiStart.current = 5;
		setIsFetching(true);
		setHasMore(true);
		setPostList([]);
		window.scrollTo(0, 0);
		getDataFirstTime();
	}, [hashtag]);

	const getDataFirstTime = async () => {
		setIsFetching(true);
		try {
			let res;
			if (window.location.pathname.includes('/hashtag-group/')) {
				const data = {
					groupId: groupId,
					params: {
						tag: hashtag,
						start: 0,
						limit: callApiPerPage.current,
						sort: JSON.stringify([{ property: 'createdAt', direction: 'DESC' }]),
					},
				};
				res = await dispatch(getListPostByHashtagGroup(data)).unwrap();
			} else {
				const params = {
					q: hashtag,
					start: 0,
					limit: callApiPerPage.current,
					sort: JSON.stringify([{ property: 'createdAt', direction: 'DESC' }]),
				};
				res = await dispatch(getListPostByHashtag(params)).unwrap();
			}
			setPostList(res);
			if (res.length < callApiPerPage.current) {
				setHasMore(false);
			}
		} catch (error) {
			NotificationError(error);
		} finally {
			setIsFetching(false);
		}
	};

	const getDataNextTimes = async () => {
		try {
			let res;
			if (window.location.pathname.includes('/hashtag-group/')) {
				const data = {
					groupId: groupId,
					params: {
						tag: hashtag,
						start: callApiStart.current,
						limit: callApiPerPage.current,
						sort: JSON.stringify([{ property: 'createdAt', direction: 'DESC' }]),
					},
				};
				res = await dispatch(getListPostByHashtagGroup(data)).unwrap();
			} else {
				const params = {
					q: hashtag,
					start: callApiStart.current,
					limit: callApiPerPage.current,
					sort: JSON.stringify([{ property: 'createdAt', direction: 'DESC' }]),
				};
				res = await dispatch(getListPostByHashtag(params)).unwrap();
			}

			if (res.length) {
				setPostList(postList.concat(res));
				if (res.length < callApiPerPage.current) {
					setHasMore(false);
				} else {
					callApiStart.current += callApiPerPage.current;
				}
			} else {
				setHasMore(false);
			}
		} catch (error) {
			NotificationError(error);
		}
	};

	return (
		<NormalContainer>
			<div className='hashtag-page'>
				<div className='hashtag-page__header'>
					<BackButton destination={-1} />
					<h4>Kết quả tìm kiếm cho "#{hashtag}"</h4>
				</div>
				{isFetching ? (
					<div className='hashtag-page__loading'>
						<LoadingTimeLine numberItems={1} />
					</div>
				) : (
					<>
						{postList.length > 0 ? (
							<InfiniteScroll
								dataLength={postList.length}
								next={getDataNextTimes}
								hasMore={hasMore}
								loader={<LoadingIndicator />}
							>
								{postList.map(post => {
									if (!post.isDeleted) {
										return <Post key={post.id} postInformations={post} type={GROUP_TYPE} />;
									}
								})}
							</InfiniteScroll>
						) : (
							<h6>Chưa có dữ liệu</h6>
						)}
					</>
				)}
			</div>
		</NormalContainer>
	);
}
