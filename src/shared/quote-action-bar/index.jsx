import React from 'react';
import { Like, LikeFill, CommentSvg, Share } from 'components/svg';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './quote-action-bar.scss';
import { RightArrow } from 'components/svg';
import { Link, useNavigate } from 'react-router-dom';
import Storage from 'helpers/Storage';
import { checkUserLogin } from 'reducers/redux-utils/auth';
import { useDispatch } from 'react-redux';
import { saveDataShare, checkShare } from 'reducers/redux-utils/post';

const QuoteActionBar = ({ data, isDetail, likeUnlikeQuoteFnc, isLiked, likeNumber }) => {
	const { isShare, share, comments, id } = data;
	const navigate = useNavigate();
	const dispatch = useDispatch();
	if (isDetail) {
		return (
			<ul className='quote-action-bar'>
				<li className='quote-action__item' onClick={() => likeUnlikeQuoteFnc(id)}>
					{isLiked ? <LikeFill /> : <Like />}
					<span className='quote-action__name'>{likeNumber} Thích</span>
				</li>
				<li className='quote-action__item'>
					<CommentSvg className='quote-icon active' />
					<span className='quote-action__name'>{comments} Bình luận</span>
				</li>
				<li onClick={handleCheckLoginShare} className='quote-action__item'>
					<Share className='quote-icon active' />
					<span className='quote-action__name'>{share} Chia sẻ</span>
				</li>
			</ul>
		);
	}
	const handleCheckLoginShare = () => {
		if (!Storage.getAccessToken()) {
			dispatch(checkUserLogin(true));
		} else {
			dispatch(saveDataShare(data));
			dispatch(checkShare(true));
			navigate('/');
		}
	};
	const handleCheckLoginLike = () => {
		if (!Storage.getAccessToken()) {
			dispatch(checkUserLogin(true));
		} else {
			dispatch(checkUserLogin(false));
			likeUnlikeQuoteFnc(id);
		}
	};

	return (
		<ul className='quote-action-bar'>
			<li className='quote-action__item' onClick={handleCheckLoginLike}>
				{isLiked ? <LikeFill /> : <Like />}
				<span className='quote-action__name'>{likeNumber} Thích</span>
			</li>
			<li onClick={handleCheckLoginShare} className='quote-action__item'>
				<Share className={classNames('quote-icon', { 'active': isShare })} />
				<span className='quote-action__name'>{share} Chia sẻ</span>
			</li>
			<li className='quote-action__item'>
				<Link to={`/quotes/detail/${id}`}>
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
	likeNumber: PropTypes.number,
	likeUnlikeQuoteFnc: PropTypes.func,
};

export default QuoteActionBar;
