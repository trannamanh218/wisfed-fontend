import { ArrowsDownUp } from 'components/svg';
import PropTypes from 'prop-types';
import './filter-pane.scss';

const FilterPane = ({ children, title, subtitle, handleSortFilter, hasHeaderLine = false }) => {
	return (
		<div className='filter-pane'>
			<div className='filter-pane__heading'>
				<h3 className='filter-pane__title'>
					{title}
					<span className='filter-pane__subtitle'>{subtitle}</span>
				</h3>
				<button className='filter-pane__btn' onClick={handleSortFilter}>
					<ArrowsDownUp />
				</button>
			</div>
			{hasHeaderLine && <hr />}
			<div className='filter-pane__content'>{children}</div>
		</div>
	);
};

FilterPane.defaultProps = {
	title: '',
	subtitle: '',
	handleSortFilter: () => {},
};

FilterPane.propTypes = {
	children: PropTypes.node.isRequired,
	title: PropTypes.string,
	subtitle: PropTypes.string,
	handleSortFilter: PropTypes.func,
	hasHeaderLine: PropTypes.bool,
};

export default FilterPane;
