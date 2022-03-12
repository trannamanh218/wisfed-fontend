import PropTypes from 'prop-types';
import React from 'react';
import BadgeList from 'shared/badge-list';
import QuoteActionBar from 'shared/quote-action-bar';
import UserAvatar from 'shared/user-avatar';
import './quote-card.scss';

const QuoteCard = ({ data, isDetail, isLiked }) => {
	return (
		<div
			className='quote-card'
			style={data.background !== '' ? { backgroundImage: `linear-gradient(${data.background})` } : {}}
		>
			<div className='quote-card__quote-content'>
				<p>{`"${data.quote}"`}</p>
				<p style={{ textDecoration: 'underline' }}>{`${data.authorName} - ${data.book?.name}`}</p>
			</div>

			<div className='quote-card__author'>
				<div className='quote-card__author__avatar'>
					<UserAvatar size='sm' avatarImage={data?.user?.avatarImage} />
				</div>
				<div className='quote-card__author__detail'>
					<p className='quote-card__author__detail__text'>Quotes này tạo bởi</p>
					<p className='quote-card__author__detail__name'>{data?.user?.fullName}</p>
				</div>
			</div>
			<div className='quote-footer'>
				<div className='quote-footer__left'>
					<BadgeList list={data?.categories?.slice(0, 2)} className='quote-footer__badge' />
				</div>
				<div className='quote-footer__right'>
					<QuoteActionBar data={data} isDetail={isDetail} isLiked={isLiked} />
				</div>
			</div>
		</div>
	);
};

QuoteCard.defaultProps = {
	data: {
		content: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam velit nemo voluptate. Eaque tenetur
		dolore qui doloribus modi alias labore deleniti quisquam sunt. Accusantium, accusamus eius ipsum optio
		distinctio laborum.`,
		avatar: '',
		author: 'Mai Nguyễn',
		bookName: 'Đắc nhân tâm',
	},
	isDetail: false,
	badges: [{ title: 'lorem 1' }, { title: 'lorem2' }],
};

QuoteCard.propTypes = {
	data: PropTypes.object,
	isDetail: PropTypes.bool,
	isLiked: PropTypes.bool,
};

export default QuoteCard;
