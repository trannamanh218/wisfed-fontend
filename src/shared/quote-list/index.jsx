import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import QuoteCard from 'shared/quote-card';
import './quote-list.scss';

const QuoteList = ({ list, userId }) => {
	const navigate = useNavigate();

	if (list && list.length > 0) {
		return (
			<div className='quote-list'>
				{list?.slice(0, 3).map(item => (
					<QuoteCard key={item.id} data={item.data || item} isDetail={false} />
				))}
				{list?.length > 3 && (
					<button className='sidebar__view-more-btn--blue' onClick={() => navigate(`/quotes/${userId}`)}>
						Xem thêm
					</button>
				)}
			</div>
		);
	}

	return <p className='blank-content'>Không có dữ liệu</p>;
};

QuoteList.propTypes = {
	list: PropTypes.array.isRequired,
	userId: PropTypes.string,
};

export default QuoteList;
