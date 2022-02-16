import React from 'react';
import PropTypes from 'prop-types';
import { Global, Pencil } from 'components/svg';
import './setting-field-icons.scss';

const SettingFieldIcons = props => {
	const settings = {};
	return (
		<div className='setting-field-icons'>
			<span className='btn-icon'>
				<Global />
			</span>
			<span className='btn-icon'>
				<Pencil />
			</span>
		</div>
	);
};

SettingFieldIcons.propTypes = {};

export default SettingFieldIcons;
