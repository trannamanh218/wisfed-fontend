import UserAvatar from 'shared/user-avatar';
import { Crown } from 'components/svg';
import './top-ranks.scss';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const TopUserRanks = ({ topUserList, valueDataSort }) => {
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
			return <div className='number__books'>{topUserList[number].numberFollow}</div>;
		} else if (valueDataSort === 'topRead') {
			return <div className='number__books'>{topUserList[number].numberBookRead}</div>;
		} else if (valueDataSort === 'topLike') {
			return <div className='number__books'>{topUserList[number].numberLike}</div>;
		} else {
			return <div className='number__books'>{topUserList[number].numberReview}</div>;
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
				<div className='top__user__ranks__two__avatar' onClick={() => onClickRedirectTwo(topUserList[1])}>
					<UserAvatar className='author-card__avatar' source={topUserList[1].avatarImage} />
					<div className='number__ranks'>2</div>
				</div>
				<div className='top__user__ranks__two__title'>
					<p title={topUserList[1].fullName || `${topUserList[1].firstName}  ${topUserList[1].lastName}`}>
						{topUserList[1].fullName || `${topUserList[1].firstName}  ${topUserList[1].lastName}`}
					</p>
					{handleNumber(1)}
					{handleRenderTitle()}
				</div>
			</div>
			<div className='top__user__ranks__one'>
				<div className='top__user__ranks__one__avatar' onClick={() => onClickRedirectOne(topUserList[0])}>
					<div className='Crown'>
						<Crown />
					</div>
					<UserAvatar className='author-card__avatar' source={topUserList[0].avatarImage} />
					<div className='number__ranks'>1</div>
				</div>
				<div className='top__user__ranks__one__title'>
					<p title={topUserList[0].fullName || `${topUserList[0].firstName}  ${topUserList[0].lastName}`}>
						{topUserList[0].fullName || `${topUserList[0].firstName}  ${topUserList[0].lastName}`}
					</p>
					{handleNumber(0)}
					{handleRenderTitle()}
				</div>
			</div>
			<div className='top__user__ranks__two'>
				<div
					className='top__user__ranks__two__avatar three'
					onClick={() => onClickRedirectThree(topUserList[2])}
				>
					<UserAvatar className='author-card__avatar' source={topUserList[2].avatarImage} />
					<div className='number__ranks three'>3</div>
				</div>
				<div className='top__user__ranks__two__title'>
					<p title={topUserList[2].fullName || `${topUserList[2].firstName}  ${topUserList[2].lastName}`}>
						{topUserList[2].fullName || `${topUserList[2].firstName}  ${topUserList[2].lastName}`}
					</p>
					{handleNumber(2)}
					{handleRenderTitle()}
				</div>
			</div>
		</div>
	);
};

TopUserRanks.propTypes = {
	topUserList: PropTypes.array,
	valueDataSort: PropTypes.string,
};

export default TopUserRanks;
