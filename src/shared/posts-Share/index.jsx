import defaultAvatar from 'assets/icons/defaultLogoAvatar.svg';
import Play from 'assets/images/play.png';
import classNames from 'classnames';
import { Feather, IconRanks, WorldNet } from 'components/svg';
import { GROUP_POST_VERB_SHARE, hashtagRegex, READ_TARGET_VERB_SHARE, urlRegex } from 'constants/index';
import { calculateDurationTime } from 'helpers/Common';
import RouteLink from 'helpers/RouteLink';
import _ from 'lodash';
import ShareUsers from 'pages/home/components/newfeed/components/modal-share-users';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import AuthorBook from 'shared/author-book';
import GridImage from 'shared/grid-image';
import PostBook from 'shared/post-book';
import PreviewLink from 'shared/preview-link/PreviewLink';
import QuoteCard from 'shared/quote-card';
import ReactRating from 'shared/react-rating';
import ShareTarget from 'shared/share-target';
import ShowTime from 'shared/showTimeOfPostWhenHover/showTime';
import UserAvatar from 'shared/user-avatar';
import './posts-Share.scss';

const PostShare = ({ postData, inCreatePost, directUrl }) => {
	const [videoId, setVideoId] = useState('');
	const [showModalOthers, setShowModalOthers] = useState(false);
	const [hasMore, setHasMore] = useState(false);

	const handleCloseModalOthers = () => setShowModalOthers(false);
	const handleShowModalOthers = () => setShowModalOthers(true);
	const [readMore, setReadMore] = useState(false);

	const postContentRef = useRef(null);

	const navigate = useNavigate();

	const onClickUserInModalOthers = paramItem => {
		handleCloseModalOthers();
		navigate(`/profile/${paramItem.userId}`);
	};

	const withFriends = paramInfo => {
		if (paramInfo.length === 1) {
			return (
				<span>
					<span style={{ fontWeight: '500', color: '#6E7191' }}> cùng với </span>
					<Link to={`/profile/${paramInfo[0].userId}`}>
						{paramInfo[0].users.fullName ||
							paramInfo[0].users.firstName + ' ' + paramInfo[0].users.lastName}
					</Link>
				</span>
			);
		} else if (paramInfo.length === 2) {
			return (
				<span>
					<span style={{ fontWeight: '500', color: '#6E7191' }}> cùng với </span>
					<Link to={`/profile/${paramInfo[0].userId}`}>
						{paramInfo[0].users.fullName ||
							paramInfo[0].users.firstName + ' ' + paramInfo[0].users.lastName}
					</Link>
					<span style={{ fontWeight: '500', color: '#6E7191' }}> và </span>
					<Link to={`/profile/${paramInfo[1].userId}`}>
						{paramInfo[1].users.fullName ||
							paramInfo[1].users.firstName + ' ' + paramInfo[1].users.lastName}
					</Link>
				</span>
			);
		} else {
			return (
				<span>
					<span style={{ fontWeight: '500', color: '#6E7191' }}> cùng với </span>
					<Link to={`/profile/${paramInfo[0].users.id}`}>
						{paramInfo[0].users.fullName ||
							paramInfo[0].users.firstName + ' ' + paramInfo[0].users.lastName}
					</Link>
					<span style={{ fontWeight: '500', color: '#6E7191' }}> và </span>
					<span className='post__user__container__mention-users-plus' onClick={() => handleShowModalOthers()}>
						<span>{paramInfo.length - 1} người khác</span>
						<div className='post__user__container__list-mention-users'>
							{!!paramInfo.length && (
								<>
									{paramInfo.slice(1).map((item, index) => (
										<div className='post__user__container__list-mention-users__name' key={index}>
											{item.users.fullName || item.users.firstName + ' ' + item.users.lastName}
										</div>
									))}
								</>
							)}
						</div>
					</span>
					<Modal show={showModalOthers} onHide={handleCloseModalOthers} className='modal-tagged-others'>
						<Modal.Header closeButton>
							<Modal.Title>Mọi người</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							{!!paramInfo.length && (
								<>
									{paramInfo.slice(1).map((item, index) => (
										<div key={index} style={{ marginBottom: '1rem' }}>
											<img
												onClick={() => onClickUserInModalOthers(item)}
												className='modal-tagged-others__avatar'
												src={item.users.avatarImage || defaultAvatar}
												onError={e => e.target.setAttribute('src', defaultAvatar)}
												alt='image'
											></img>
											<span
												onClick={() => onClickUserInModalOthers(item)}
												className='modal-tagged-others__name'
											>
												{item.users.fullName ||
													item.users.firstName + ' ' + item.users.lastName}
											</span>
										</div>
									))}
								</>
							)}
						</Modal.Body>
					</Modal>
				</span>
			);
		}
	};

	useEffect(() => {
		if (
			!_.isEmpty(postData.sharePost?.preview) &&
			postData.sharePost.preview.url.includes('https://www.youtube.com/')
		) {
			const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
			const match = postData.sharePost.preview.url.match(regExp);
			if (match && match[2].length === 11) {
				setVideoId(match[2]);
			}
		}

		if (postContentRef.current) {
			// check text clamped when use webkit-box
			const isTextClamped = elm => elm.scrollHeight > elm.clientHeight;
			if (isTextClamped(postContentRef.current)) {
				setHasMore(true);
			} else {
				setHasMore(false);
			}
		}
	}, [postData]);

	const generateContent = content => {
		if (content.match(urlRegex) || content.match(hashtagRegex)) {
			const newContent = content
				.replace(urlRegex, data => {
					return `<a class="url-class" data-url=${data}>${
						data.length <= 50 ? data : data.slice(0, 50) + '...'
					}</a>`;
				})
				.replace(hashtagRegex, data => {
					const newData = data
						.normalize('NFD')
						.replace(/[\u0300-\u036f]/g, '')
						.replace(/đ/g, 'd')
						.replace(/Đ/g, 'D');
					if (postData?.sharePost?.groupInfo?.id) {
						return `<a class="hashtag-class" data-hashtag-navigate="/hashtag-group/${
							postData?.sharePost?.groupInfo?.id
						}/${newData.slice(1)}">${newData}</a>`;
					} else {
						return `<a class="hashtag-class" data-hashtag-navigate="/hashtag/${newData.slice(
							1
						)}">${newData}</a>`;
					}
				});
			return newContent;
		} else {
			return content;
		}
	};

	const handleTime = item => {
		switch (item) {
			case 'week':
				return 'tuần';
			case 'month':
				return 'tháng';
			case 'year':
				return 'năm';
		}
	};

	const handleViewPostDetail = () => {
		if (!inCreatePost && !window.location.pathname.includes('/detail-feed/')) {
			if (postData.sharePost.minipostId) {
				navigate(`/detail-feed/mini-post/${postData.sharePost.minipostId}`);
			} else if (postData.sharePost.groupPostId) {
				navigate(`/detail-feed/group-post/${postData.sharePost.groupPostId}`);
			} else if (postData.sharePost.groupId) {
				navigate(`/detail-feed/group-post/${postData.sharePost.id}`);
			} else {
				navigate(`/detail-feed/mini-post/${postData.id}`);
			}
		}
	};

	const renderChartTitle = () => {
		if (postData?.sharePost?.metaData.type === 'readingChart') {
			return `# Biểu đồ số ${
				postData?.sharePost?.metaData?.isReadedChart ? 'sách' : 'trang sách'
			} đã đọc nhiều nhất theo ${handleTime(postData?.sharePost?.metaData.chartType)}`;
		} else if (postData?.sharePost?.metaData.type === 'growthChart') {
			return `# Biểu đồ tăng trưởng của cuốn sách "${
				postData?.sharePost?.metaData?.book?.name
			}" của ${postData?.sharePost?.metaData?.book?.authors.map(name => name.authorName)} `;
		}
	};

	return (
		<div className='post__container'>
			<div className='post__user-status'>
				<Link to={`/profile/${postData?.sharePost?.createdBy?.id}`}>
					<UserAvatar
						data-testid='post__user-avatar'
						className='post__user-status__avatar'
						source={
							postData?.sharePost?.user
								? postData?.sharePost?.user?.avatarImage
								: postData?.sharePost?.createdBy?.avatarImage
						}
					/>
				</Link>
				<div className='post__user-status__name-and-post-time-status'>
					<div data-testid='post__user-name' className='post__user-status__name'>
						<Link to={`/profile/${postData?.sharePost?.createdBy?.id || postData?.sharePost?.user?.id}`}>
							{postData?.sharePost?.user
								? postData?.sharePost?.user?.fullName ||
								  postData?.sharePost?.user?.firstName + ' ' + postData?.sharePost?.user?.lastName
								: postData?.sharePost?.createdBy?.fullName ||
								  postData?.sharePost?.createdBy?.firstName + postData?.sharePost?.createdBy?.lastName}
						</Link>
						{/* tagged people */}
						{postData.sharePost?.mentionsUsers &&
							!!postData.sharePost.mentionsUsers.length &&
							withFriends(postData.sharePost.mentionsUsers)}
						{postData.verb === GROUP_POST_VERB_SHARE && (
							<>
								<img className='post__user-icon' src={Play} alt='arrow' />
								{inCreatePost ? (
									<span>{postData?.group?.name || postData?.sharePost?.groupInfo?.name || ''}</span>
								) : (
									<Link to={`/group/${postData?.group?.id || postData?.sharePost?.groupInfo?.id}`}>
										{postData?.group?.name || postData?.sharePost?.groupInfo?.name || ''}
									</Link>
								)}
							</>
						)}
					</div>
					<div className='post__user-status__post-time-status'>
						<div
							className={classNames('show-time', {
								'not-event': inCreatePost,
							})}
						>
							<span onClick={handleViewPostDetail}>
								{calculateDurationTime(postData.sharePost.time || postData.sharePost.createdAt)}
							</span>
							{/* Hiển thị ngày giờ chính xác khi hover  */}
							<ShowTime dataTime={postData.sharePost.time || postData.sharePost.createdAt} />
						</div>
						<>
							{postData.sharePost?.book && (
								<div className='post__user-status__subtitle'>
									{postData.sharePost.isUpdateProgress && (
										<>
											<div className='post__user-status__subtitle__svg'>
												<WorldNet />
											</div>
											<span style={{ marginRight: '12px', marginLeft: '5px' }}>
												Cập nhật tiến độ đọc sách
											</span>
										</>
									)}
									{postData.sharePost.book.actorRating !== null && (
										<>
											<div className='post__user-status__post-time-status__online-dot'></div>
											<span>Xếp hạng</span>
											<ReactRating
												readonly={true}
												initialRating={postData.sharePost.book.actorRating?.star}
											/>
										</>
									)}
								</div>
							)}
						</>
					</div>
				</div>
			</div>
			{postData.sharePost?.message && (
				<div className='post__content-wrapper'>
					<div
						className={classNames('post__content', {
							'view-less': readMore === false,
						})}
						dangerouslySetInnerHTML={{
							__html: generateContent(postData.sharePost.message),
						}}
						ref={postContentRef}
					></div>
					{hasMore && (
						<div className='read-more-post' onClick={() => setReadMore(!readMore)}>
							{readMore ? 'Rút gọn' : 'Xem thêm'}
						</div>
					)}
				</div>
			)}
			{postData.sharePost.mentionsAuthors && !!postData.sharePost?.mentionsAuthors.length && (
				<ul className='tagged'>
					{postData.sharePost.mentionsAuthors.map(item => (
						<li
							key={item.id}
							className={classNames('badge bg-primary-light')}
							onClick={() => navigate(`/profile/${item.authorId}`)}
						>
							<Feather />
							<span>
								{item.authors.name ||
									item.authors?.fullName ||
									item.authors?.lastName ||
									item.authors?.firstName ||
									'Không xác định'}
							</span>
						</li>
					))}
				</ul>
			)}

			{postData.sharePost.mentionsCategories && !!postData.sharePost.mentionsCategories.length && (
				<ul className='tagged'>
					{postData.sharePost.mentionsCategories.map(item => (
						<li
							key={item.id}
							className={classNames('badge bg-primary-light')}
							onClick={() => navigate(RouteLink.categoryDetail(item.categoryId, item.category.name))}
						>
							<span>
								{item.category?.name ||
									item.category?.fullName ||
									item.category?.lastName ||
									item.category?.firstName ||
									'Không xác định'}
							</span>
						</li>
					))}
				</ul>
			)}
			{(postData?.sharePost?.metaData?.type === 'readingChart' ||
				postData?.sharePost?.metaData?.type === 'growthChart') && (
				<div className='post__title__share__rank'>
					<span className='number__title__rank'>{renderChartTitle()}</span>
				</div>
			)}
			{postData.sharePost?.image?.length > 0 && (
				<GridImage images={postData.sharePost.image} inPost={true} postId={postData?.id} />
			)}
			{!postData.sharePost?.image?.length && !_.isEmpty(postData?.sharePost?.preview) && (
				<>
					{videoId ? (
						<iframe
							className='post__video-youtube'
							src={`//www.youtube.com/embed/${videoId}`}
							allowFullScreen={true}
						></iframe>
					) : (
						<div className='post-share__preview-link-container'>
							<PreviewLink
								isFetching={false}
								urlData={postData.sharePost.preview}
								driectToUrl={directUrl}
							/>
						</div>
					)}
				</>
			)}
			{postData.sharePost?.book && (
				<PostBook
					data={{
						...postData.sharePost.book,
						bookLibrary: postData?.bookLibrary,
						actorCreatedPost: postData?.actor,
					}}
					bookProgress={postData.sharePost.book.progress}
					inCreatePost={inCreatePost}
				/>
			)}

			{postData.sharePost?.originId?.type === 'topUser' && <ShareUsers postData={postData.sharePost} />}
			{(postData.verb === READ_TARGET_VERB_SHARE || postData.sharePost.type === 'shareTargetRead') && (
				<ShareTarget postData={postData} />
			)}

			{postData.sharePost?.originId?.type === 'topQuote' && (
				<>
					<div className='post__title__share__rank'>
						<span className='number__title__rank'># Top {postData.sharePost?.originId.rank} quotes </span>
						<span className='title__rank'>
							{postData.sharePost?.info.category
								? `  được like nhiều nhất thuộc ${
										postData.sharePost?.info.category.name
								  } theo ${handleTime(postData.sharePost?.originId?.by)} `
								: `  được like nhiều nhất theo ${handleTime(postData.sharePost?.originId?.by)} `}
						</span>
						<IconRanks />
					</div>
					<div className='create-post-modal-content__main__share-container'>
						<QuoteCard data={postData.sharePost.info} isShare={true} />
					</div>
				</>
			)}

			{postData.sharePost?.originId?.type === 'topBook' && (
				<>
					<div className='post__title__share__rank'>
						<span className='number__title__rank'># Top {postData.sharePost?.originId.rank} </span>
						<span className='title__rank'>
							{`  cuốn sách tốt nhất ${
								postData.sharePost?.info.category
									? ` thuộc ${postData.sharePost?.info.category.name}`
									: ''
							} theo ${handleTime(postData.sharePost?.originId?.by)}`}
						</span>
						<IconRanks />
					</div>
					<div className='create-post-modal-content__main__share-container'>
						<AuthorBook data={postData.sharePost} />
					</div>
				</>
			)}
		</div>
	);
};

PostShare.defaultProps = {
	inCreatePost: false,
	directUrl: () => {},
};

PostShare.propTypes = {
	postData: PropTypes.object,
	likeAction: PropTypes.func,
	className: PropTypes.string,
	inCreatePost: PropTypes.bool,
	directUrl: PropTypes.func,
};

export default PostShare;
