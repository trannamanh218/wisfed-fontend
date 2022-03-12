import React from 'react';
import { Like, LikeFill, CommentSvg, Share } from 'components/svg';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './quote-action-bar.scss';
import { RightArrow } from 'components/svg';
import { Link } from 'react-router-dom';

const QuoteActionBar = ({ data, isDetail, handleLikeQuote, isLiked }) => {
	const { like, isShare, share, comments, id } = data;

	if (isDetail) {
		return (
			<ul className='quote-action-bar'>
				<li className='quote-action__item'>
					{isLiked ? <LikeFill /> : <Like />}
					<span className='quote-action__name'>{like} Thích</span>
				</li>
				<li className='quote-action__item'>
					<CommentSvg className='quote-icon active' />
					<span className='quote-action__name'>{comments} Bình luận</span>
				</li>
				<li className='quote-action__item'>
					<Share className='quote-icon active' />
					<span className='quote-action__name'>{share} Chia sẻ</span>
				</li>
			</ul>
		);
	}

	return (
		<ul className='quote-action-bar'>
			<li className='quote-action__item'>
				{isLiked ? <LikeFill /> : <Like />}
				<span className='quote-action__name'>{like} Thích</span>
			</li>
			<li className='quote-action__item'>
				<Share className={classNames('quote-icon', { 'active': isShare })} />
				<span className='quote-action__name'>{share} Chia sẻ</span>
			</li>
			<li className='quote-action__item'>
				<Link to={`/quote/detail/${id}`}>
					<span className='quote-action__name'>Chi tiết</span>
					<RightArrow className='quote-action__right-arrow' />
				</Link>
			</li>
		</ul>
	);
};

QuoteActionBar.defaultProps = {
	data: {
		likeNumberss: 0,
		share: 0,
		comments: 0,
		isShare: false,
		isLike: false,
	},
	isDetail: false,
	handleLikeQuote: () => {},
};

QuoteActionBar.propTypes = {
	data: PropTypes.object,
	isDetail: PropTypes.bool,
	handleLikeQuote: PropTypes.func,
	isLiked: PropTypes.bool,
};

export default QuoteActionBar;
