import React from 'react';
// import PropTypes from 'prop-types';
import { Accordion } from 'react-bootstrap';
import ReadBook from 'shared/read-book';
import bookImage from 'assets/images/book1.png';
import './read-book-tab.scss';

const ReadBookTab = () => {
	return (
		<div className='read-book-tab'>
			<Accordion defaultActiveKey='0'>
				<Accordion.Item eventKey='0'>
					<Accordion.Header>
						<span className='read-book-tab__year'>Năm 2021</span>
						<h4 className='read-book-tab__quantity'>3 cuốn</h4>
					</Accordion.Header>
					<Accordion.Body>
						<ReadBook source={bookImage} />
						<ReadBook source={bookImage} />
						<ReadBook source={bookImage} />
					</Accordion.Body>
				</Accordion.Item>
				<Accordion.Item eventKey='1'>
					<Accordion.Header>
						<span className='read-book-tab__year'>Năm 2022</span>
						<h4 className='read-book-tab__quantity'>5 cuốn</h4>
					</Accordion.Header>
					<Accordion.Body>
						<ReadBook source={bookImage} />
						<ReadBook source={bookImage} />
						<ReadBook source={bookImage} />
						<ReadBook source={bookImage} />
						<ReadBook source={bookImage} />
					</Accordion.Body>
				</Accordion.Item>
			</Accordion>
		</div>
	);
};

ReadBookTab.propTypes = {};

export default ReadBookTab;
