import { useEffect, useRef, useState, useCallback } from 'react';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import Editor from '@draft-js-plugins/editor';
import createLinkifyPlugin from '@draft-js-plugins/linkify';
import './rich-text-editor.scss';
import '@draft-js-plugins/linkify/lib/plugin.css';
import { extractLinks } from '@draft-js-plugins/linkify';
import 'draft-js/dist/Draft.css';
import createMentionPlugin, { defaultSuggestionsFilter } from '@draft-js-plugins/mention';
import '@draft-js-plugins/mention/lib/plugin.css';
import PropTypes from 'prop-types';
import _ from 'lodash';

const mentions = [
	{
		name: 'Matthew Russell',
		link: 'https://twitter.com/mrussell247',
		avatar: 'https://pbs.twimg.com/profile_images/517863945/mattsailing_400x400.jpg',
	},
	{
		name: 'Julian Krispel-Samsel',
		link: 'https://twitter.com/juliandoesstuff',
		avatar: 'https://avatars2.githubusercontent.com/u/1188186?v=3&s=400',
	},
	{
		name: 'Jyoti Puri',
		link: 'https://twitter.com/jyopur',
		avatar: 'https://avatars0.githubusercontent.com/u/2182307?v=3&s=400',
	},
	{
		name: 'Max Stoiber',
		link: 'https://twitter.com/mxstbr',
		avatar: 'https://avatars0.githubusercontent.com/u/7525670?s=200&v=4',
	},
	{
		name: 'Nik Graf',
		link: 'https://twitter.com/nikgraf',
		avatar: 'https://avatars0.githubusercontent.com/u/223045?v=3&s=400',
	},
	{
		name: 'Pascal Brandt',
		link: 'https://twitter.com/psbrandt',
		avatar: 'https://pbs.twimg.com/profile_images/688487813025640448/E6O6I011_400x400.png',
	},
];

const generatePlugins = () => {
	const linkifyPlugin = createLinkifyPlugin({ target: '_blank' });
	const mentionPlugin = createMentionPlugin();
	const plugins = [linkifyPlugin, mentionPlugin];
	const MentionSuggestions = mentionPlugin.MentionSuggestions;
	return {
		plugins,
		MentionSuggestions,
	};
};

function RichTextEditor({
	content,
	setContent,
	setUrlAdded,
	hasMentionsUser,
	placeholder,
	handleKeyBind,
	handleKeyPress,
	className,
	clickReply,
	createCmt,
	mentionUsersArr,
	setMentionUsersArr,
}) {
	const [editorState, setEditorState] = useState(EditorState.createEmpty());
	const [open, setOpen] = useState(false);
	const [suggestions, setSuggestions] = useState(mentions);
	const [{ plugins, MentionSuggestions }] = useState(() => {
		const { plugins, MentionSuggestions } = generatePlugins();
		return {
			plugins,
			MentionSuggestions,
		};
	});

	const editor = useRef(null);

	useEffect(() => {
		if (clickReply && mentionUsersArr.length > 0) {
			reply();
		}
		if (editor.current) {
			setTimeout(() => {
				editor.current.focus();
			}, 500);
		}
	}, [editor.current, clickReply]);

	useEffect(() => {
		if (content && hasMentionsUser) {
			setEditorState(EditorState.createEmpty());
		}
	}, [createCmt]);

	useEffect(() => {
		const blocks = convertToRaw(editorState.getCurrentContent()).blocks;
		const textValue = blocks.map(block => (!block.text.trim() && '\n') || block.text).join('\n');
		setContent(textValue);
		const urlDetected = extractLinks(textValue);
		if (urlDetected && urlDetected.length) {
			detectUrl(urlDetected);
		}
	}, [editorState]);

	const onChange = data => {
		setEditorState(data);
	};

	const detectUrl = useCallback(
		_.debounce(urlDetected => {
			if (urlDetected && urlDetected.length) {
				setUrlAdded(urlDetected[urlDetected.length - 1].url);
			} else {
				setUrlAdded('');
			}
		}, 700),
		[]
	);

	// const fetchSuggestionMentions = async () => {
	// 	try {
	// 	} catch {
	//
	// 	}
	// };

	const onOpenChange = useCallback(_open => {
		setOpen(_open);
	}, []);

	const onSearchChange = useCallback(({ value }) => {
		setSuggestions(defaultSuggestionsFilter(value, mentions));
	}, []);

	const addMention = data => {
		const newArr = [...mentionUsersArr];
		newArr.push(data);
		setMentionUsersArr(newArr);
	};

	const reply = () => {
		if (mentionUsersArr.length > 0) {
			const data = {
				'blocks': [
					{
						'key': 'cvdfd',
						'text': `${mentionUsersArr[0].userFullName} `,
						'type': 'unstyled',
						'depth': 0,
						'inlineStyleRanges': [],
						'entityRanges': [
							{
								'offset': 0,
								'length': mentionUsersArr[0].userFullName.length,
								'key': 0,
							},
						],
						'data': {},
					},
				],
				'entityMap': {
					0: {
						'type': 'mention',
						'mutability': 'SEGMENTED',
						'data': {
							'mention': {
								'name': `${mentionUsersArr[0].userFullName}`,
								'link': ``,
								'avatar': `${mentionUsersArr[0].userAvatar}`,
							},
						},
					},
				},
			};
			const contentState = convertFromRaw(data);
			setEditorState(EditorState.createWithContent(contentState));
		}
	};

	return (
		<>
			<div className={className ? `rich-text-editor ${className}` : 'rich-text-editor'}>
				<Editor
					editorState={editorState}
					onChange={onChange}
					plugins={plugins}
					ref={editor}
					placeholder={placeholder}
					keyBindingFn={handleKeyBind}
					handleKeyCommand={handleKeyPress}
				/>
				{hasMentionsUser && (
					<MentionSuggestions
						open={open}
						onOpenChange={onOpenChange}
						suggestions={suggestions}
						onSearchChange={onSearchChange}
						onAddMention={data => addMention(data)}
					/>
				)}
			</div>
		</>
	);
}

RichTextEditor.defaultProps = {
	content: '',
	setContent: () => {},
	setUrlAdded: () => {},
	hasMentionsUser: false,
	placeholder: '',
	handleKeyBind: () => {},
	handleKeyPress: () => {},
	className: '',
	clickReply: () => {},
	createCmt: false,
	mentionUsersArr: [],
	setMentionUsersArr: () => {},
};

RichTextEditor.propTypes = {
	content: PropTypes.string,
	setContent: PropTypes.func,
	setUrlAdded: PropTypes.func,
	hasMentionsUser: PropTypes.bool,
	placeholder: PropTypes.string,
	handleKeyBind: PropTypes.func,
	handleKeyPress: PropTypes.func,
	className: PropTypes.string,
	clickReply: PropTypes.func,
	createCmt: PropTypes.bool,
	mentionUsersArr: PropTypes.array,
	setMentionUsersArr: PropTypes.func,
};

export default RichTextEditor;
