import classNames from 'classnames';
import { Feather } from 'components/svg';
import { calculateDurationTime } from 'helpers/Common';
import _ from 'lodash';
import './posts-Share.scss';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import GridImage from 'shared/grid-image';
import PostBook from 'shared/post-book';
import UserAvatar from 'shared/user-avatar';
import PreviewLink from 'shared/preview-link/PreviewLink';
import ReactRating from 'shared/react-rating';
import { Link, useNavigate } from 'react-router-dom';
import Play from 'assets/images/play.png';
import { GROUP_POST_VERB_SHARE } from 'constants/index';
import { Modal } from 'react-bootstrap';
import defaultAvatar from 'assets/icons/defaultLogoAvatar.svg';

const urlRegex =
	/(http(s)?:\/\/)?(www(\.))?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}([-a-zA-Z0-9()@:%_\+.~#?&//=]*)([^"<\s]+)(?![^<>]*>|[^"]*?<\/a)/g;
const hashtagRegex =
	/#(?![0-9_]+\b)[0-9a-z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễếệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+/gi;

const PostShare = ({ postData, inCreatePost = false }) => {
	const [videoId, setVideoId] = useState('');

	const [showModalOthers, setShowModalOthers] = useState(false);

	const handleCloseModalOthers = () => setShowModalOthers(false);
	const handleShowModalOthers = () => setShowModalOthers(true);
	const [readMore, setReadMore] = useState(false);

	const directUrl = url => {
		window.open(url);
	};

	const navigate = useNavigate();

	const onClickUserInModalOthers = paramItem => {
		handleCloseModalOthers();
		navigate(`/profile/${paramItem.userId}`);
	};

	const withFriends = paramInfo => {
		if (paramInfo.length === 1) {
			return (
				<span>
					<span style={{ fontWeight: '500' }}> cùng với </span>
					<Link to={`/profile/${paramInfo[0].userId}`}>
						{paramInfo[0].users.fullName ||
							paramInfo[0].users.firstName + ' ' + paramInfo[0].users.lastName}
					</Link>
					<span style={{ fontWeight: '500' }}>.</span>
				</span>
			);
		} else if (paramInfo.length === 2) {
			return (
				<span>
					<span style={{ fontWeight: '500' }}> cùng với </span>
					<Link to={`/profile/${paramInfo[0].userId}`}>
						{paramInfo[0].users.fullName ||
							paramInfo[0].users.firstName + ' ' + paramInfo[0].users.lastName}
					</Link>
					<span style={{ fontWeight: '500' }}> và </span>
					<Link to={`/profile/${paramInfo[1].userId}`}>
						{paramInfo[1].users.fullName ||
							paramInfo[1].users.firstName + ' ' + paramInfo[1].users.lastName}
					</Link>
					<span style={{ fontWeight: '500' }}>.</span>
				</span>
			);
		} else {
			return (
				<span>
					<span style={{ fontWeight: '500' }}> cùng với </span>
					<Link to={`/profile/${paramInfo[0].users.id}`}>
						{paramInfo[0].users.fullName ||
							paramInfo[0].users.firstName + ' ' + paramInfo[0].users.lastName}
					</Link>
					<span style={{ fontWeight: '500' }}> và </span>
					<span className='post__user__container__mention-users-plus' onClick={() => handleShowModalOthers()}>
						{paramInfo.length - 1} người khác.
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
	}, [postData]);

	const generateContent = content => {
		if (content.match(urlRegex) || content.match(hashtagRegex)) {
			const newContent = content
				.replace(
					urlRegex,
					data =>
						`<a class="url-class" href=${
							data.includes('https://') ? data : `https://${data}`
						} target="_blank">${data.length <= 50 ? data : data.slice(0, 50) + '...'}</a>`
				)
				.replace(hashtagRegex, data => {
					const newData = data
						.normalize('NFD')
						.replace(/[\u0300-\u036f]/g, '')
						.replace(/đ/g, 'd')
						.replace(/Đ/g, 'D');
					if (postData.groupId) {
						return `<a class="hashtag-class" href="/hashtag-group/${postData.groupId}/${newData.slice(
							1
						)}">${newData}</a>`;
					} else {
						return `<a class="hashtag-class" href="/hashtag/${newData.slice(1)}">${newData}</a>`;
					}
				});
			return newContent;
		} else {
			return content;
		}
	};

	console.log(postData.verb);

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
									<span>{postData?.group?.name || postData?.sharePost?.groupInfo.name || ''}</span>
								) : (
									<Link to={`/group/${postData?.group?.id || postData?.sharePost?.groupInfo.id}`}>
										{postData?.group?.name || postData?.sharePost?.groupInfo.name || ''}
									</Link>
								)}
							</>
						)}
					</div>
					<div className='post__user-status__post-time-status'>
						<span>{calculateDurationTime(postData.sharePost.time || postData.sharePost.createdAt)}</span>
						<>
							{postData.sharePost?.book && (
								<div className='post__user-status__subtitle'>
									{postData.sharePost.isUpdateProgress && (
										<span style={{ marginRight: '12px' }}>Cập nhật tiến độ đọc sách</span>
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
				<>
					<div
						className={readMore ? 'post__description--readmore' : 'post__description'}
						dangerouslySetInnerHTML={{
							__html: generateContent(postData.sharePost.message),
						}}
					></div>
					{postData?.sharePost?.message?.length > 500 && (
						<span
							className='read-more-post'
							style={{ cursor: 'pointer', display: 'block', marginBottom: '15px' }}
							onClick={() => setReadMore(!readMore)}
						>
							{readMore ? 'Rút gọn' : 'Xem thêm'}
						</span>
					)}
				</>
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
							onClick={() => navigate(`/category/detail/${item.categoryId}`)}
						>
							<span>
								{item.category.name ||
									item.category?.fullName ||
									item.category?.lastName ||
									item.category?.firstName ||
									'Không xác định'}
							</span>
						</li>
					))}
				</ul>
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

			{postData.sharePost?.image?.length > 0 && (
				<GridImage images={postData.sharePost.image} inPost={true} postId={postData?.id} />
			)}

			{postData.sharePost?.image?.length === 0 &&
				!_.isEmpty(postData.sharePost.preview) &&
				_.isEmpty(postData.sharePost.book) && (
					<>
						{videoId ? (
							<iframe
								className='post__video-youtube'
								src={`//www.youtube.com/embed/${videoId}`}
								frameBorder={0}
								allowFullScreen={true}
							></iframe>
						) : (
							<div onClick={() => directUrl(postData.sharePost.url)}>
								<PreviewLink isFetching={false} urlData={postData.sharePost.preview} />
							</div>
						)}
					</>
				)}
		</div>
	);
};

PostShare.propTypes = {
	postData: PropTypes.object,
	likeAction: PropTypes.func,
	className: PropTypes.string,
	inCreatePost: PropTypes.bool,
};

export default PostShare;
