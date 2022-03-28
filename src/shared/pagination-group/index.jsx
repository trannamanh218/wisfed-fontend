import React from 'react';
import { Pagination } from 'react-bootstrap';
import './pagination-group.scss';

const PaginationGroup = () => {
	return (
		<Pagination className='pagination-group'>
			<Pagination.Item>{1}</Pagination.Item>
			<Pagination.Item>{2}</Pagination.Item>
			<Pagination.Item>{3}</Pagination.Item>
			<Pagination.Ellipsis />
			<Pagination.Item active>{12}</Pagination.Item>
			<Pagination.Item>{13}</Pagination.Item>
			<Pagination.Ellipsis />
			<Pagination.Item>{20}</Pagination.Item>
		</Pagination>
	);
};

PaginationGroup.propTypes = {};

export default PaginationGroup;
