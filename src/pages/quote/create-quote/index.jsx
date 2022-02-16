import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';
import './create-quote.scss';
import Editor from 'shared/editor';

const CreateQuote = props => {
	return (
		<div className='create-quote'>
			<Form>
				<div className='create-quote__editor'>
					<Editor />
				</div>
			</Form>
		</div>
	);
};

CreateQuote.propTypes = {};

export default CreateQuote;
