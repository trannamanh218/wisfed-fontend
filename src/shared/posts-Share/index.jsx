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
import { Link } from 'react-router-dom';
import Play from 'assets/images/play.png';
import { GROUP_POST_VERB_SHARE } from 'constants';

const urlRegex =
	/(https?:\/\/)?(www(\.))?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;

const PostShare = ({ postData, inCreatePost = false }) => {
	const [videoId, setVideoId] = useState('');

	const directUrl = url => {
		window.open(url);
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
					{paramInfo.length - 1}
					<span style={{ fontWeight: '500' }}> người khác.</span>
				</span>
			);
		}
	};

	useEffect(() => {
		if (
			!_.isEmpty(postData.sharePost.preview) &&
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
		if (content.match(urlRegex)) {
			let newContent;
			if (content.includes('https://')) {
				newContent = content.replace(urlRegex, data => {
					return `<a class="url-class" href=${data} target="_blank">${
						data.length <= 50 ? data : data.slice(0, 50) + '...'
					}</a>`;
				});
			} else {
				newContent = content.replace(urlRegex, data => {
					return `<a class="url-class" href=https://${data} target="_blank">${
						data.length <= 50 ? data : data.slice(0, 50) + '...'
					}</a>`;
				});
			}
			return newContent;
		} else {
			return content;
		}
	};

	return (
		<div className='post__container'>
			<div className='post__user-status'>
				<Link to={`/profile/${postData.sharePost.createdBy.id}`}>
					<UserAvatar
						data-testid='post__user-avatar'
						className='post__user-status__avatar'
						source={postData.sharePost?.createdBy?.avatarImage}
					/>
				</Link>
				<div className='post__user-status__name-and-post-time-status'>
					<div data-testid='post__user-name' className='post__user-status__name'>
						<Link to={`/profile/${postData.sharePost.createdBy.id}`}>
							{postData.sharePost.createdBy.fullName ||
								postData.sharePost.createdBy.firstName + ' ' + postData.sharePost.createdBy.lastName ||
								'Ẩn danh'}
						</Link>
						{/* tagged people */}
						{postData.sharePost?.mentionsUsers &&
							!!postData.sharePost.mentionsUsers.length &&
							withFriends(postData.sharePost.mentionsUsers)}
						{postData.verb === GROUP_POST_VERB_SHARE && (
							<>
								<img className='post__user-icon' src={Play} alt='arrow' />
								{inCreatePost ? (
									<span>{postData.group.name}</span>
								) : (
									<Link to={`/group/${postData.group.id}`}>{postData.group.name}</Link>
								)}
							</>
						)}
					</div>
					<div className='post__user-status__post-time-status'>
						<span>
							{calculateDurationTime(
								postData.time ||
									postData.createdAt ||
									postData.sharePost.time ||
									postData.sharePost.createdAt
							)}
						</span>
						<>
							{postData.sharePost.book && (
								<div className='post__user-status__subtitle'>
									<span>Cập nhật tiến độ đọc sách</span>
									<div className='post__user-status__post-time-status__online-dot'></div>
									<span>Xếp hạng</span>
									<ReactRating
										readonly={true}
										initialRating={
											postData.sharePost.book.actorRating?.star
												? postData.sharePost.book.actorRating?.star
												: 0
										}
									/>
								</div>
							)}
						</>
					</div>
				</div>
			</div>
			{postData.sharePost.message && (
				<div
					className='post__description'
					dangerouslySetInnerHTML={{
						__html: generateContent(postData.sharePost.message),
					}}
				></div>
			)}
			<ul className='tagged'>
				{postData.sharePost.mentionsAuthors?.map(item => (
					<li key={item.id} className={classNames('badge bg-primary-light')}>
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
			{postData.sharePost.book && (
				<PostBook
					data={{
						...postData.sharePost.book,
						bookLibrary: postData?.bookLibrary,
						actorCreatedPost: postData?.actor,
					}}
					inCreatePost={inCreatePost}
				/>
			)}

			{postData.sharePost.image?.length > 0 && (
				<GridImage images={postData.sharePost.image} inPost={true} postId={postData?.id} />
			)}

			{postData.sharePost.image?.length === 0 &&
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
