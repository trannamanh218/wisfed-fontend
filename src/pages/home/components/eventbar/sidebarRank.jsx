import RankBarImage from 'assets/images/sidebar-user-rank.png';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NotificationError } from 'helpers/Error';
import { getTopUser, handleIsCheckUser } from 'reducers/redux-utils/ranks';
import { useDispatch } from 'react-redux';
import { Crown } from 'components/svg';
import UserAvatar from 'shared/user-avatar';

export default function SidebarRank() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [top3followedUsersByWeek, setTop3followedUsersByWeek] = useState([]);

	useEffect(() => {
		getTopUserData();
	}, []);

	const getTopUserData = async () => {
		const params = {
			reportType: 'topRead',
			by: 'week',
		};
		try {
			const topUsers = await dispatch(getTopUser(params)).unwrap();
			setTop3followedUsersByWeek(topUsers.rows);
		} catch (err) {
			NotificationError(err);
		}
	};

	const handleNumber = number => {
		return <div className='number__books'>{top3followedUsersByWeek[number].bookRead}</div>;
	};

	const handleDirect = () => {
		dispatch(handleIsCheckUser(true));
		navigate('/top100');
	};

	return (
		<div className='event-and-rank-bar__block'>
			<h4 className='event-and-rank-bar__block__title'>Bảng xếp hạng</h4>
			<div onClick={handleDirect} className='event-and-rank-bar__content'>
				<div className='event-and-rank-bar__block top__user__ranks'>
					<div className='top__user__ranks__two'>
						<div className='top__user__ranks__two__avatar'>
							<UserAvatar
								className='author-card__avatar'
								source={top3followedUsersByWeek[1]?.avatarImage}
							/>
							<div className='number__ranks'>2</div>
						</div>
						<div className='top__user__ranks__two__title'>
							{top3followedUsersByWeek[1] && (
								<>
									<p>
										{top3followedUsersByWeek[1].fullName ||
											`${top3followedUsersByWeek[1].firstName}  ${top3followedUsersByWeek[1].lastName}`}
									</p>
									{handleNumber(1)}
								</>
							)}
						</div>
					</div>
					<div className='top__user__ranks__one'>
						<div className='top__user__ranks__one__avatar'>
							<div className='Crown'>
								<Crown />
							</div>
							<UserAvatar
								className='author-card__avatar'
								source={top3followedUsersByWeek[0]?.avatarImage}
							/>
							<div className='number__ranks'>1</div>
						</div>
						<div className='top__user__ranks__one__title'>
							{top3followedUsersByWeek[0] && (
								<>
									<p>
										{top3followedUsersByWeek[0].fullName ||
											`${top3followedUsersByWeek[0].firstName}  ${top3followedUsersByWeek[0].lastName}`}
									</p>
									{handleNumber(0)}
								</>
							)}
						</div>
					</div>
					<div className='top__user__ranks__two'>
						<div className='top__user__ranks__two__avatar three'>
							<UserAvatar
								className='author-card__avatar'
								source={top3followedUsersByWeek[2]?.avatarImage}
							/>
							<div className='number__ranks three'>3</div>
						</div>
						<div className='top__user__ranks__two__title'>
							{top3followedUsersByWeek[2] && (
								<>
									<p>
										{top3followedUsersByWeek[2].fullName ||
											`${top3followedUsersByWeek[2].firstName}  ${top3followedUsersByWeek[2].lastName}`}{' '}
									</p>
									{handleNumber(2)}
								</>
							)}
						</div>
					</div>
				</div>
				<img src={RankBarImage} alt='' />
			</div>
		</div>
	);
}
