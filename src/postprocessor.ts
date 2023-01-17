// https://github.com/nyable/obsidian-code-block-enhancer/blob/master/src/core.ts#L6:7
import type { MarkdownPostProcessorContext, App, Plugin } from 'obsidian';

import { LANG_LIST } from '@/constant';
import { createElement } from '@/utils';
import InsertLinkModal from '@/views/InsertLinkModal';
import EditModal from '@/views/EditModal/EditModal';

const DEFAULT_LANG_ATTR = 'language-text';
const DEFAULT_LANG = '';
const LANG_REG = /^language-/;
const LINE_SPLIT_MARK = '\n';

export function codeBlockPostProcessor(element: HTMLElement, context: MarkdownPostProcessorContext, app: App, plugin: Plugin) {
	let lang: string = DEFAULT_LANG;
	const code: HTMLPreElement = element.querySelector("pre:not(.frontmatter) > code") as HTMLPreElement;

	if (!code) return;

	if (!LANG_LIST.some(name => code.classList.contains(`language-${name}`))) {
		return;
	}

	code.classList.forEach((val, key) => {
		if (LANG_REG.test(val)) {
			lang = val.replace(`language-`, '');
			return;
		}
	});

	const pre = code.parentElement;

	if (pre?.parentElement?.querySelector(`div.code-to-image-wrap`)) {
		return;
	}

	pre?.parentElement?.addClass(`code-to-image-wrap`);

	const contentList: string[] = code.textContent?.split(LINE_SPLIT_MARK) || [];
	console.log('🚀 ~ file: postprocessor.ts:40 ~ codeBlockPostProcessor ~ contentList', contentList);

	const button = createElement('button', 'code-to-image_button');
	button.setAttribute('aria-label', 'Code To Image');
	button.innerText = 'Share';

	const buttonHanlder = () => {
		new EditModal(this.app, lang, code.innerText);
	};

	plugin.registerDomEvent(button, 'click', buttonHanlder);
	pre?.parentElement?.appendChild(button);

	// @ts-ignore
	const name = app?.account?.name || '';
	console.log('🚀 ~ file: postprocessor.ts:9 ~ codeBlockPostProcessor ~ name', name);
}