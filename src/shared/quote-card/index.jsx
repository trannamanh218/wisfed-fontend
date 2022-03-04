import PropTypes from 'prop-types';
import React from 'react';
import BadgeList from 'shared/badge-list';
import QuoteActionBar from 'shared/quote-action-bar';
import UserAvatar from 'shared/user-avatar';
import './quote-card.scss';
import classNames from 'classnames';

const QuoteCard = props => {
	const { data, isDetail, quoteData } = props;
	return (
		<div
			className='quote-card'
			style={data.background !== '' ? { backgroundImage: `linear-gradient(${data.background})` } : {}}
		>
			<div
				className={classNames('quote-card__quote-content', {
					'white-color': data.background !== '',
				})}
			>
				<p>{`"${data.quote}"`}</p>
				<p style={{ textDecoration: 'underline' }}>{`${data.authorName} - ${data.book.name}`}</p>
			</div>

			<div className='quote-card__author'>
				<div className='quote-card__author__avatar'>
					<UserAvatar size='sm' avatarImage={data.user.avatarImage} />
				</div>
				<div className='quote-card__author__detail'>
					<p
						className='quote-card__author__detail__text'
						style={data.background !== '' ? { color: '#fcfcfc' } : {}}
					>
						Quotes này tạo bởi
					</p>
					<p className='quote-card__author__detail__name'>{data.user.fullName}</p>
				</div>
			</div>
			<div className='quote-footer'>
				<div className='quote-footer__left'>
					<BadgeList list={data.categories} className='quote-footer__badge' />
				</div>
				<div
					className={classNames('quote-footer__right', {
						'white-color-children': data.background !== '',
					})}
				>
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
