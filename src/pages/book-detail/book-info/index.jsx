import React from 'react';
import { Tab, Tabs } from 'react-bootstrap';

const BookInfo = () => {
	return (
		<div className='book-info'>
			<h1>This is book info</h1>
			<Tabs defaultActiveKey='review'>
				<Tab eventKey='review' title='Review'>
					<div style={{ height: '500px' }}>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus officiis repudiandae fugiat
						labore autem placeat tempora a asperiores aut quasi.
					</div>
				</Tab>
				<Tab eventKey='quotes' title='Quotes'>
					<div style={{ height: '500px' }}>Quotes</div>
				</Tab>
			</Tabs>
		</div>
	);
};

export default BookInfo;
