import React from 'react';
import PropTypes from 'prop-types';
import LoadingIndicator from 'shared/loading-indicator';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Form } from 'react-bootstrap';

const SearchCategoryChooseTopic = ({ searchCategories, fetchFilterData, hasMoreFilterData, handleChange }) => {
	if (searchCategories.length) {
		return (
			<InfiniteScroll
				dataLength={searchCategories.length}
				next={fetchFilterData}
				hasMore={hasMoreFilterData}
				loader={<LoadingIndicator />}
				pullDownToRefreshThreshold={50}
			>
				{searchCategories.map(item => (
					<>
						<div key={item.id} className='form-check-wrapper'>
							<Form.Check className='form-check-custom' type={'checkbox'} id={item.id}>
								<Form.Check.Input
									className={`form-check-custom--'checkbox'`}
									type={'checkbox'}
									isValid
									name={item.name}
									value={item.id}
									onClick={handleChange}
									// defaultChecked={data.value === value}
								/>
								<Form.Check.Label className='form-check-label--custom'>{item.name}</Form.Check.Label>
							</Form.Check>
						</div>
					</>
				))}
			</InfiniteScroll>
		);
	}

	return <p className='blank-content'>Không có kết quả phù hợp</p>;
};

SearchCategoryChooseTopic.defaultProps = {
	searchCategories: [],
	fetchFilterData: () => {},
	handleChange: () => {},
	hasMoreFilterData: true,
};

SearchCategoryChooseTopic.propTypes = {
	searchCategories: PropTypes.array,
	fetchFilterData: PropTypes.func,
	handleChange: PropTypes.func,
	hasMoreFilterData: PropTypes.bool,
};

export default SearchCategoryChooseTopic;
