import { Pagination } from 'react-bootstrap';
import './pagination-group.scss';
import PropTypes from 'prop-types';

const PaginationGroup = ({ totalPage, currentPage, changePage }) => {
	return (
		<Pagination className='pagination-group'>
			{[...Array(totalPage)].map((_, index) => (
				<Pagination.Item
					key={index}
					active={currentPage === index + 1 ? true : false}
					onClick={() => changePage(index)}
				>
					{index + 1}
				</Pagination.Item>
			))}
		</Pagination>
	);
};

PaginationGroup.propTypes = {
	totalPage: PropTypes.number,
	currentPage: PropTypes.number,
	changePage: PropTypes.func,
};

export default PaginationGroup;
