import RatingStar from 'components/rating-star/index';
import PropTypes from 'prop-types';

import { Like, Comment, Share, LikeFill } from 'components/svg';
import { useState, useRef } from 'react';
import DropdownIconButton from 'components/dropdown-status-book';

function Post({ postInformations, likeAction }) {
	const [commentContent, setCommentContent] = useState('');

	const commentArea = useRef(null);

	const updateCommentCotent = e => {
		setCommentContent(e.target.value);
		commentArea.current.style.height = 0;
		commentArea.current.style.height = commentArea.current.scrollHeight + 2 + 'px';
	};

	return (
		<div className='post__container'>
			<div className='post__user-status'>
				<div className='post__user-status__avatar'>
					<img data-testid='post__user-avatar' src={postInformations.userAvatar} alt='' />
				</div>
				<div className='post__user-status__name-and-post-time-status'>
					<div data-testid='post__user-name' className='post__user-status__name'>
						{postInformations.userName}
					</div>
					<div className='post__user-status__post-time-status'>
						<span>1 giờ trước</span>
						<div className='post__user-status__post-time-status__online-dot'></div>
						<span style={{ color: '#656773' }}>Cập nhật tiến độ đọc sách</span>
					</div>
				</div>
			</div>
			<div className='post__description'>Saw this place today, it looks even better in-person!</div>
			<div className='post__book-container'>
				<div className='post__book__image'>
					<img data-testid='post__book__image' src={postInformations.bookImage} alt='' />
				</div>
				<div className='post__book__informations'>
					<div className='post__book__name-and-author'>
						<div data-testid='post__book__name' className='post__book__name'>
							{postInformations.bookName}
						</div>
						<div className='post__book__author'>Tác giả Christ Bohajalian</div>
					</div>
					<div className='post__book__button-and-rating'>
						<DropdownIconButton />
						<RatingStar ratingStatus={false} ratingValue={4} />
						<div className='post__book__rating__number'>(09 đánh giá)</div>
					</div>
					<div className='post__book__description'>
						<span>
							When literature student Anastasia Steele goes to house of interview young entrepreneur
							Christian Grey, she is encounters a man who is beautiful, brilliant, and only one
							intimidaing...
						</span>
						<button className='post__book__description__continue-reading'>Continue reading</button>
					</div>
				</div>
			</div>
			<div className='post__options'>
				<div
					data-testid='post__options__like-btn'
					className='post__options__item '
					onClick={() => likeAction(postInformations)}
				>
					{postInformations.isLike ? <LikeFill /> : <Like />}
					<div className='post__options__action-name'>{postInformations.likes} Thích</div>
				</div>
				<div className='post__options__item'>
					<Comment />
					<div className='post__options__action-name'>7 Comments</div>
				</div>
				<div className='post__options__item'>
					<Share />
					<div className='post__options__action-name'>54 Chia sẻ</div>
				</div>
			</div>
			<div className='post__comments-box'>
				<div className='post__comments-box__avatar'>
					<img src={postInformations.userAvatar} alt='' />
				</div>
				<textarea
					ref={commentArea}
					className='post__comments-box__comment-area'
					placeholder='Viết bình luận...'
					rows='1'
					value={commentContent}
					onChange={updateCommentCotent}
				/>
			</div>
		</div>
	);
}
Post.propTypes = {
	postInformations: PropTypes.object,
	likeAction: PropTypes.func,
};

export default Post;
