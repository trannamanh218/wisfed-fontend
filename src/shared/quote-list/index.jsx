import caretIcon from 'assets/images/caret.png';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import QuoteCard from 'shared/quote-card';
import './quote-list.scss';
import LoadingIndicator from 'shared/loading-indicator';

const QuoteList = ({ list, type, userId, hasMore, handleViewMore, myFavoriteQuotesLoading }) => {
	const navigate = useNavigate();

	if (list && list.length > 0) {
		return (
			<div className='quote-list'>
				{list.map(item => (
					<QuoteCard key={item.id} data={item.data || item} isDetail={false} />
				))}

				{list?.length > 3 && type === 'myQuotes' && (
					<button onClick={() => navigate(`/quotes/${userId}`)} className='sidebar__view-more-btn--blue'>
						Xem thêm
					</button>
				)}

				{type !== 'myQuotes' && hasMore && (
					<>
						{myFavoriteQuotesLoading ? (
							<LoadingIndicator />
						) : (
							<button
								className='dualColumn-btn'
								onClick={handleViewMore}
								style={{ justifyContent: 'flex-end', width: '100%' }}
							>
								<img className='view-caret' src={caretIcon} alt='caret-icon' />
								<span>Xem thêm</span>
							</button>
						)}
					</>
				)}
			</div>
		);
	}

	return <p className='blank-content'>Không có dữ liệu</p>;
};

QuoteList.defaultProps = {
	list: [],
	userId: '',
	type: '',
	hasMore: true,
	handleViewMore: () => {},
	myFavoriteQuotesLoading: false,
};

QuoteList.propTypes = {
	list: PropTypes.array.isRequired,
	userId: PropTypes.string,
	type: PropTypes.string,
	hasMore: PropTypes.bool,
	handleViewMore: PropTypes.func,
	myFavoriteQuotesLoading: PropTypes.bool,
};

export default QuoteList;
