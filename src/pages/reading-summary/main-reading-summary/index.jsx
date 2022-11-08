import { useEffect, useState } from 'react';
import { Col, Nav, Row, Tab, TabContainer } from 'react-bootstrap';
import BookTab from './book-tab';
import './main-reading-summary.scss';
import PageTab from './page-tab';
import ReadBookTab from './read-book-tab';
import PropTypes from 'prop-types';
import { BackArrow } from 'components/svg';

const MainReadingSummary = ({ setErrorLoadPage }) => {
	const [disabledReadBookTab, setDisabledReadBookTab] = useState(false);
	const [activeKey, setActiveKey] = useState('books');

	useEffect(() => {
		if (disabledReadBookTab) {
			setActiveKey('page-charts');
		}
	}, [disabledReadBookTab]);

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
							<Nav.Item
								className={`main-reading-summary__nav__title ${disabledReadBookTab && 'disabled'}`}
							>
								<Nav.Link eventKey='books' disabled={disabledReadBookTab}>
									Các sách đã đọc
								</Nav.Link>
							</Nav.Item>
							<Nav.Item
								className={`main-reading-summary__nav__title ${disabledReadBookTab && 'disabled'}`}
							>
								<Nav.Link eventKey='book-charts' disabled={disabledReadBookTab}>
									Số sách đã đọc
								</Nav.Link>
							</Nav.Item>
							<Nav.Item>
								<Nav.Link eventKey='page-charts'>Số trang đã đọc</Nav.Link>
							</Nav.Item>
						</Nav>
					</Col>

					<Col sm={12}>
						<Tab.Content>
							<Tab.Pane eventKey='books'>
								<ReadBookTab setDisabledReadBookTab={setDisabledReadBookTab} />
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
