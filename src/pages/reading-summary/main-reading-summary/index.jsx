import { useEffect, useState } from 'react';
import { Col, Nav, Row, Tab, TabContainer } from 'react-bootstrap';
import BookTab from './book-tab';
import './main-reading-summary.scss';
import PageTab from './page-tab';
import ReadBookTab from './read-book-tab';
import PropTypes from 'prop-types';
import { BackArrow } from 'components/svg';

const MainReadingSummary = ({ setErrorLoadPage }) => {
	const [showReadBookTab, setShowReadBookTab] = useState(true);
	const [activeKey, setActiveKey] = useState('books');

	useEffect(() => {
		if (!showReadBookTab) {
			setActiveKey('page-charts');
		}
	}, [showReadBookTab]);

	return (
		<div className='main-reading-summary'>
			<TabContainer activeKey={activeKey} onSelect={k => setActiveKey(k)}>
				<div className='group-btn-back'>
					<button onClick={() => history.back()}>
						<BackArrow />
					</button>
					<span>Biểu đồ đọc sách</span>
				</div>

				<Row>
					<Col sm={12}>
						<Nav className='main-reading-summary__nav'>
							{showReadBookTab && (
								<>
									<Nav.Item>
										<Nav.Link eventKey='books'>Các sách đã đọc</Nav.Link>
									</Nav.Item>
									<Nav.Item>
										<Nav.Link eventKey='book-charts'>Số sách đã đọc</Nav.Link>
									</Nav.Item>
								</>
							)}

							<Nav.Item>
								<Nav.Link eventKey='page-charts'>Số trang đã đọc</Nav.Link>
							</Nav.Item>
						</Nav>
					</Col>

					<Col sm={12}>
						<Tab.Content>
							<Tab.Pane eventKey='books'>
								<ReadBookTab setShowReadBookTab={setShowReadBookTab} />
							</Tab.Pane>
							<Tab.Pane eventKey='book-charts'>
								<BookTab setErrorLoadPage={setErrorLoadPage} />
							</Tab.Pane>
							<Tab.Pane eventKey='page-charts'>
								<PageTab />
							</Tab.Pane>
						</Tab.Content>
					</Col>
				</Row>
			</TabContainer>
		</div>
	);
};

MainReadingSummary.propTypes = {
	setErrorLoadPage: PropTypes.func,
};

export default MainReadingSummary;
