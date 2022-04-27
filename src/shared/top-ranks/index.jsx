import UserAvatar from 'shared/user-avatar';
import { Crown } from 'components/svg';

const TopRanks = () => {
	return (
		<div className='top__user__ranks'>
			<div className='top__user__ranks__two'>
				<div className='top__user__ranks__two__avatar'>
					<UserAvatar className='author-card__avatar' />
					<div className='number__ranks'>2</div>
				</div>
				<div className='top__user__ranks__two__title'>
					<p>Vatani</p>
					<div className='number__books'>400</div>
					<span>Cuốn sách</span>
				</div>
			</div>
			<div className='top__user__ranks__one'>
				<div className='top__user__ranks__one__avatar'>
					<div className='Crown'>
						<Crown />
					</div>
					<UserAvatar className='author-card__avatar' />
					<div className='number__ranks'>1</div>
				</div>
				<div className='top__user__ranks__one__title'>
					<p>Chúa hề</p>
					<div className='number__books'>1000</div>
					<span>Cuốn sách</span>
				</div>
			</div>
			<div className='top__user__ranks__two'>
				<div className='top__user__ranks__two__avatar three'>
					<UserAvatar className='author-card__avatar' />
					<div className='number__ranks three'>3</div>
				</div>
				<div className='top__user__ranks__two__title'>
					<p>Jona hart </p>
					<div className='number__books'>800</div>
					<span>Cuốn sách</span>
				</div>
			</div>
		</div>
	);
};

export default TopRanks;
