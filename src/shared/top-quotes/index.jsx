import QuoteActionBar from 'shared/quote-action-bar';
import UserAvatar from 'shared/user-avatar';
import './top-quotes.scss';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useState } from 'react';

const TopQuotesComponent = ({ item, valueDate, categoryItem }) => {
	const [newData, setNewData] = useState({});

	useEffect(() => {
		const data = {
			time: valueDate,
			categoryName: categoryItem.name || '',
			categoryId: categoryItem.id || '',
			...item,
		};
		setNewData(data);
	}, []);

	return (
		<div className='top__quotes__container'>
			<div className='top__quotes__description'>{item.quote}</div>
			<div className='top__quotes__author'>{item.authorName}</div>
			<div className='top__quotes__footer'>
				<div className='top__quotes__info'>
					<div className='quote-card__author__avatar'>
						<UserAvatar size='sm' source={item.user.avatarImage} />
					</div>
					<div className='quote-card__author__detail'>
						<p className='quote-card__author__detail__text'>Quotes tạo bởi</p>
						<p className='quote-card__author__detail__name'>{item.user.fullName}</p>
					</div>
				</div>
				<QuoteActionBar data={newData} />
			</div>
		</div>
	);
};
TopQuotesComponent.propTypes = {
	item: PropTypes.array,
	valueDate: PropTypes.string,
	categoryItem: PropTypes.object,
};
export default TopQuotesComponent;
