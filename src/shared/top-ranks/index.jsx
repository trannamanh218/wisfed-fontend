import UserAvatar from 'shared/user-avatar';
import { Crown } from 'components/svg';
import './top-ranks.scss';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const TopRanks = ({ getListTopBooks, valueDataSort }) => {
	const navigate = useNavigate();

	const handleRenderTitle = () => {
		if (valueDataSort === 'topFollow') {
			return <span>Follow</span>;
		} else if (valueDataSort === 'topRead') {
			return <span>Cuốn sách</span>;
		} else if (valueDataSort === 'topReview') {
			return <span>Review</span>;
		} else if (valueDataSort === 'topLike') {
			return <span>Like</span>;
		}
	};

	const handleNumber = number => {
		if (valueDataSort === 'topFollow') {
			return (
				<div className='number__books'>
					{getListTopBooks[number].numFollowingOfWeek ||
						getListTopBooks[number].numFollowingOfMonth ||
						getListTopBooks[number].numberFollowing}
				</div>
			);
		} else if (valueDataSort === 'topRead') {
			return (
				<div className='number__books'>
					{getListTopBooks[number].bookRead || getListTopBooks[number].bookReadOfMonth}
				</div>
			);
		} else if (valueDataSort === 'topLike') {
			return (
				<div className='number__books'>
					{getListTopBooks[number].sumLikeOfWeek ||
						getListTopBooks[number].sumLikeOfMonth ||
						getListTopBooks[number].sumLikeOfYear ||
						0}
				</div>
			);
		} else if (valueDataSort === 'topReview') {
			return (
				<div className='number__books'>
					{getListTopBooks[number].numReviewOfWeek ||
						getListTopBooks[number].numReviewOfMonth ||
						getListTopBooks[number].numReviewOfYear}
				</div>
			);
		}
	};

	const onClickRedirectTwo = data => {
		return navigate(`/profile/${data.id}`);
	};

	const onClickRedirectOne = data => {
		return navigate(`/profile/${data.id}`);
	};

	const onClickRedirectThree = data => {
		return navigate(`/profile/${data.id}`);
	};
	return (
		<div className='top__user__ranks'>
			<div className='top__user__ranks__two'>
				<div className='top__user__ranks__two__avatar' onClick={() => onClickRedirectTwo(getListTopBooks[1])}>
					<UserAvatar className='author-card__avatar' source={getListTopBooks[1].avatarImage} />
					<div className='number__ranks'>2</div>
				</div>
				<div className='top__user__ranks__two__title'>
					<p>
						{getListTopBooks[1].fullName ||
							`${getListTopBooks[1].firstName}  ${getListTopBooks[1].lastName}`}
					</p>
					{handleNumber(1)}
					{handleRenderTitle()}
				</div>
			</div>
			<div className='top__user__ranks__one'>
				<div className='top__user__ranks__one__avatar' onClick={() => onClickRedirectOne(getListTopBooks[0])}>
					<div className='Crown'>
						<Crown />
					</div>
					<UserAvatar className='author-card__avatar' source={getListTopBooks[0].avatarImage} />
					<div className='number__ranks'>1</div>
				</div>
				<div className='top__user__ranks__one__title'>
					<p>
						{getListTopBooks[0].fullName ||
							`${getListTopBooks[0].firstName}  ${getListTopBooks[0].lastName}`}
					</p>
					{handleNumber(0)}
					{handleRenderTitle()}
				</div>
			</div>
			<div className='top__user__ranks__two'>
				<div
					className='top__user__ranks__two__avatar three'
					onClick={() => onClickRedirectThree(getListTopBooks[2])}
				>
					<UserAvatar className='author-card__avatar' source={getListTopBooks[2].avatarImage} />
					<div className='number__ranks three'>3</div>
				</div>
				<div className='top__user__ranks__two__title'>
					<p>
						{getListTopBooks[2].fullName ||
							`${getListTopBooks[2].firstName}  ${getListTopBooks[2].lastName}`}{' '}
					</p>
					{handleNumber(2)}
					{handleRenderTitle()}
				</div>
			</div>
		</div>
	);
};
TopRanks.propTypes = {
	getListTopBooks: PropTypes.array,
	valueDataSort: PropTypes.string,
};
export default TopRanks;
