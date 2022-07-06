import { Like, LikeFill, CommentSvg, Share } from 'components/svg';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './quote-action-bar.scss';
import { RightArrow } from 'components/svg';
import { Link } from 'react-router-dom';
import Storage from 'helpers/Storage';
import { useDispatch } from 'react-redux';
import { saveDataShare, checkShare } from 'reducers/redux-utils/post';
import { useNavigate } from 'react-router-dom';

const QuoteActionBar = ({ data, isDetail, likeUnlikeQuoteFnc, isLiked, likeNumber, setModalShow }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleCheckLoginShare = async () => {
		if (!Storage.getAccessToken()) {
			setModalShow(true);
		} else {
			dispatch(saveDataShare(data));
			dispatch(checkShare(true));
			navigate('/');
		}
	};

	const handleCheckLoginLike = () => {
		if (!Storage.getAccessToken()) {
			setModalShow(true);
		} else {
			likeUnlikeQuoteFnc(data.id);
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
						<CommentSvg className='quote-icon' />
						<span className='quote-action__name'>{data.comments} Bình luận</span>
					</>
				) : (
					<div onClick={handleCheckLoginShare}>
						<Share className={classNames('quote-icon', { 'active': data.isShare })} />
						<span className='quote-action__name'>{data.countShare} Chia sẻ</span>
					</div>
				)}
			</li>
			<li className='quote-action__item'>
				{isDetail ? (
					<div onClick={handleCheckLoginShare}>
						<Share className='quote-icon' />
						<span className='quote-action__name'>{data.share} Chia sẻ</span>
					</div>
				) : (
					<Link to={`/quotes/detail/${data.id}`}>
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
