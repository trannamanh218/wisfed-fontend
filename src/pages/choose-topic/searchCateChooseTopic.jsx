import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';

const SearchCategoryChooseTopic = ({ searchCategories, addFavorite, handleChange }) => {
	if (searchCategories.length) {
		return (
			<>
				{searchCategories.map(item => {
					return (
						<>
							<div key={item.id} className='form-check-wrapper'>
								<Form.Check className='form-check-custom' type={'checkbox'} id={item.id}>
									<Form.Check.Input
										className={`form-check-custom--'checkbox'`}
										type={'checkbox'}
										name={item.name}
										checked={addFavorite.includes(item.id)}
										value={item.id}
										onClick={handleChange}
									/>
									<Form.Check.Label className='form-check-label--custom'>
										{item.name}
									</Form.Check.Label>
								</Form.Check>
							</div>
						</>
					);
				})}
			</>
		);
	}

	return <p className='blank-content'>Không có kết quả phù hợp</p>;
};

SearchCategoryChooseTopic.defaultProps = {
	searchCategories: [],
	addFavorite: [],
	handleChange: () => {},
};

SearchCategoryChooseTopic.propTypes = {
	searchCategories: PropTypes.array,
	addFavorite: PropTypes.array,
	handleChange: PropTypes.func,
};

export default SearchCategoryChooseTopic;
