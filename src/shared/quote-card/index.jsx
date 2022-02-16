import PropTypes from 'prop-types';
import React from 'react';
import BadgeList from 'shared/badge-list';
import QuoteActionBar from 'shared/quote-action-bar';
import UserAvatar from 'shared/user-avatar';
import './quote-card.scss';

const QuoteCard = props => {
	const { data, badges, isDetail, quoteData } = props;
	return (
		<div className='quote-card'>
			<p className='quote-body'>{data.content}</p>
			<div className='quote-author'>
				<UserAvatar size='sm' className='quote-author__avatar' />
				<div className='quote-author__detail'>
					<span className='author'>{data.author}</span>
					<p>{data.bookName}</p>
				</div>
			</div>
			<div className='quote-footer'>
				<div className='quote-footer__left'>
					<BadgeList list={badges} className='quote-footer__badge' />
				</div>
				<div className='quote-footer__right'>
					<QuoteActionBar data={quoteData} isDetail={isDetail} />
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
		quoteData: {
			likeNumberss: 0,
			shareNumbers: 0,
			commentNumbers: 0,
			isShare: false,
			isLike: false,
		},
	},
	isDetail: false,
	badges: [{ title: 'lorem 1' }, { title: 'lorem2' }],
};

QuoteCard.propTypes = {
	data: PropTypes.object,
	badges: PropTypes.array,
	isDetail: PropTypes.bool,
	quoteData: PropTypes.object,
};

export default QuoteCard;
