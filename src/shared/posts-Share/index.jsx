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
import PostQuotes from 'shared/post-quotes';

const PostsShare = ({ postData, className }) => {
	const [videoId, setVideoId] = useState('');
	const directUrl = url => {
		window.open(url, '_blank');
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

	useEffect(() => {
		const urlAddedArray = document.querySelectorAll('.url-color');
		if (urlAddedArray.length > 0) {
			for (let i = 0; i < urlAddedArray.length; i++) {
				urlAddedArray[i].addEventListener('click', () => {
					directUrl(urlAddedArray[i].innerText);
				});
			}
		}
	}, [postData]);

	return (
		<div className='post__main__container'>
			<div className={classNames('post__container', { [`${className}`]: className })}>
				<div className='post__user-status'>
					<UserAvatar
						data-testid='post__user-avatar'
						className='post__user-status__avatar'
						source={postData?.createdBy?.avatarImage}
					/>

					<div className='post__user-status__name-and-post-time-status'>
						<div data-testid='post__user-name' className='post__user-status__name'>
							{postData?.createdBy?.fullName || postData?.user?.fullName || 'Ẩn danh'}
						</div>
						<div className='post__user-status__post-time-status'>
							<span>{calculateDurationTime(postData.time || postData.createdAt)}</span>
							<>
								{postData.book && (
									<div className='post__user-status__subtitle'>
										<span>Cập nhật tiến độ đọc sách</span>
										<div className='post__user-status__post-time-status__online-dot'></div>
										<span>Xếp hạng</span>
										<ReactRating
											readonly={true}
											initialRating={
												postData?.book?.actorRating?.star
													? postData?.book?.actorRating?.star
													: 0
											}
										/>
									</div>
								)}
							</>
						</div>
					</div>
				</div>
				<div
					className='post__description'
					dangerouslySetInnerHTML={{
						__html: postData.sharePost.message || postData.sharePost.content,
					}}
				></div>
				<ul className='tagged'>
					{postData.sharePost.mentionsAuthors?.map(item => (
						<li key={item.id} className={classNames('badge bg-primary-light')}>
							<Feather />
							<span>
								{item.authors.name ||
									item.authors.fullName ||
									item.authors.lastName ||
									item.authors.firstName ||
									'Không xác định'}
							</span>
						</li>
					))}
				</ul>
				{postData.isShare && postData.verb === 'shareQuote' && <PostQuotes postsData={postData} />}
				{postData.sharePost.book && (
					<PostBook
						data={{
							...postData.sharePost.book,
							bookLibrary: postData.bookLibrary,
							actorCreatedPost: postData.actor,
						}}
					/>
				)}

				{postData?.sharePost.image?.length > 0 && (
					<GridImage images={postData?.sharePost.image} inPost={true} postId={postData.id} />
				)}

				{postData?.sharePost.image?.length === 0 &&
					!_.isEmpty(postData?.sharePost.preview) &&
					_.isEmpty(postData?.sharePost.book) && (
						<>
							{videoId ? (
								<iframe
									className='post__video-youtube'
									src={`//www.youtube.com/embed/${videoId}`}
									frameBorder={0}
									allowFullScreen={true}
								></iframe>
							) : (
								<div onClick={() => directUrl(postData?.sharePost.url)}>
									<PreviewLink isFetching={false} urlData={postData?.sharePost.preview} />
								</div>
							)}
						</>
					)}
			</div>
		</div>
	);
};
PostsShare.propTypes = {
	postData: PropTypes.object,
	likeAction: PropTypes.func,
	className: PropTypes.string,
};
export default PostsShare;
