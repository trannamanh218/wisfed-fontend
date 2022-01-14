import avatar from 'assets/images/avatar.png';
import sampleBookImg from 'assets/images/sample-book-img.jpg';
import { Like, Comment, Share, LikeFill } from 'components/svg';
import { useState, useRef } from 'react';
import StatusButton from 'components/status-button';
import ReactRating from 'shared/react-rating';

function Post() {
	const [commentContent, setCommentContent] = useState('');
	const [liked, setLiked] = useState(false);

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
					<img src={avatar} alt='' />
				</div>
				<div className='post__user-status__name-and-post-time-status'>
					<div className='post__user-status__name'>Trần Văn Đức</div>
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
					<img src={sampleBookImg} alt='' />
				</div>
				<div className='post__book__informations'>
					<div className='post__book__name-and-author'>
						<div className='post__book__name'>House of the Witch</div>
						<div className='post__book__author'>By Christ Bohajalian</div>
					</div>
					<div className='post__book__button-and-rating'>
						<StatusButton />
						<ReactRating initialRating={3.5} readonly={false} fractions={2} />
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
				<div className='post__options__item ' onClick={() => setLiked(!liked)}>
					{liked ? <LikeFill /> : <Like />}
					<div className='post__options__action-name'>12 Thích</div>
				</div>
				<div className='post__options__item'>
					<Comment />
					<div className='post__options__action-name'>7 Bình luận</div>
				</div>
				<div className='post__options__item'>
					<Share />
					<div className='post__options__action-name'>54 Chia sẻ</div>
				</div>
				{/* <div className='post__options__item'>
					<ActionPlus />
					<div className='post__options__action-name'>10 Add sách</div>
				</div> */}
			</div>
			<div className='post__comments-box'>
				<div className='post__comments-box__avatar'>
					<img src={avatar} alt='' />
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

export default Post;
