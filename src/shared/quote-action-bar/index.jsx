import React from 'react';
import { Like, Comment, Share } from 'components/svg';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './quote-action-bar.scss';
import arrowImage from 'assets/icons/arrow.svg';

const QuoteActionBar = ({ data, isDetail, handleLikeQuote }) => {
	const { isLike, likeNumbers, isShare, shareNumbers, commentNumbers } = data;

	if (isDetail) {
		return (
			<ul className='quote-action-bar'>
				<li className='quote-action__item'>
					<Like className='quote-icon active' />
					<span className='quote-action__name'>{likeNumbers} Thích</span>
				</li>
				<li className='quote-action__item'>
					<Comment className='quote-icon active' />
					<span className='quote-action__name'>{commentNumbers} Bình luận</span>
				</li>
				<li className='quote-action__item'>
					<Share className='quote-icon active' />
					<span className='quote-action__name'>{shareNumbers} Share</span>
				</li>
			</ul>
		);
	}

	return (
		<ul className='quote-action-bar'>
			<li className='quote-action__item'>
				<Like className={classNames('quote-icon', { 'active': isLike })} onClick={handleLikeQuote} />
				<span className='quote-action__name'>{likeNumbers} Thích</span>
			</li>
			<li className='quote-action__item'>
				<Share className={classNames('quote-icon', { 'active': isShare })} />
				<span className='quote-action__name'>{shareNumbers} Share</span>
			</li>
			<li className='quote-action__item'>
				<a href='#'>
					<span className='quote-action__name'>Chi tiết</span> <img src={arrowImage} alt='arrow' />
				</a>
			</li>
		</ul>
	);
};

QuoteActionBar.defaultProps = {
	data: {
		likeNumberss: 0,
		shareNumbers: 0,
		commentNumbers: 0,
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
};

export default QuoteActionBar;
