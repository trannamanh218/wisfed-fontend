import { Like, LikeFill, CommentSvg, Share } from 'components/svg';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './quote-action-bar.scss';
import { RightArrow } from 'components/svg';
import { Link } from 'react-router-dom';
import Storage from 'helpers/Storage';

const QuoteActionBar = ({ data, isDetail, likeUnlikeQuoteFnc, isLiked, likeNumber, setModalShow }) => {
	const { isShare, share, comments, id } = data;

	const handleCheckLoginShare = () => {
		if (!Storage.getAccessToken()) {
			setModalShow(true);
		}
	};

	const handleCheckLoginLike = () => {
		if (!Storage.getAccessToken()) {
			setModalShow(true);
		} else {
			likeUnlikeQuoteFnc(id);
		}
	};

	return (
		<ul className='quote-action-bar'>
			<li className='quote-action__item' onClick={handleCheckLoginLike}>
				{isLiked ? <LikeFill /> : <Like />}
				<span className='quote-action__name'>{likeNumber} Thích</span>
			</li>
			<li className='quote-action__item'>
				{isDetail ? (
					<>
						<CommentSvg className='quote-icon active' />
						<span className='quote-action__name'>{comments} Bình luận</span>
					</>
				) : (
					<>
						<Share className={classNames('quote-icon', { 'active': isShare })} />
						<span onClick={handleCheckLoginShare} className='quote-action__name'>
							{share} Chia sẻ
						</span>
					</>
				)}
			</li>
			<li className='quote-action__item'>
				{isDetail ? (
					<>
						<Share className='quote-icon active' />
						<span className='quote-action__name'>{share} Chia sẻ</span>
					</>
				) : (
					<Link to={`/quotes/detail/${id}`}>
						<span className='quote-action__name'>Chi tiết</span>
						<RightArrow className='quote-action__right-arrow' />
					</Link>
				)}
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
	setModalShow: PropTypes.func,
};

export default QuoteActionBar;
