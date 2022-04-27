import QuoteActionBar from 'shared/quote-action-bar';
import UserAvatar from 'shared/user-avatar';

const TopQuotesComponent = () => {
	return (
		<div className='top__quotes__container'>
			<div className='top__quotes__description'>
				Amazing arrangement for this jazz standard. You do it great justice. That said, I wanted to study the
				arrangement but after going through the arguous process of following the link in ou do it great justice.
				That said, I wanted to study the That said, I wanted to study the arrangemen fsdfsdfsdffffffffffffffffff
				fffffffffffff fffffffffffffff ffffffff ffffffffffffffffffffffffffffff
			</div>
			<div className='top__quotes__author'>Nguyễn Hiến Lê - Đắc Nhân Tâm</div>
			<div className='top__quotes__footer'>
				<div className='top__quotes__info'>
					<div className='quote-card__author__avatar'>
						<UserAvatar size='sm' />
					</div>
					<div className='quote-card__author__detail'>
						<p className='quote-card__author__detail__text'>Quotes tạo bởi</p>
						<p className='quote-card__author__detail__name'>Hùng điếc</p>
					</div>
				</div>
				<QuoteActionBar />
			</div>
		</div>
	);
};

export default TopQuotesComponent;
