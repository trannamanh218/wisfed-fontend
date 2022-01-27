import React from 'react';
import PropTypes from 'prop-types';
import './main-quote.scss';
import BackButton from 'shared/back-button';
import SearchField from 'shared/search-field';

const MainQuote = props => {
	return (
		<div className='main-quote'>
			<div className='main-quote__header'>
				<BackButton />
				<SearchField placeholder='Tìm kiếm theo sách, tác giả, chủ đề ...' />
			</div>
		</div>
	);
};

MainQuote.propTypes = {};

export default MainQuote;
