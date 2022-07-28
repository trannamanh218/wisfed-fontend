import PropTypes from 'prop-types';
import QuoteCard from 'shared/quote-card';
import './quote-list.scss';

const QuoteList = ({ list }) => {
	if (list && list.length > 0) {
		return (
			<div className='quote-list'>
				{list.map(item => (
					<QuoteCard key={item.id} data={item.data || item} isDetail={false} />
				))}
			</div>
		);
	}

	return <p className='blank-content'>Không có dữ liệu</p>;
};

QuoteList.propTypes = {
	list: PropTypes.array.isRequired,
};

export default QuoteList;
