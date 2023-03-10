import type { LanguageType } from '@/ui/Codemirror/lang';
import type { CodeToImagePluginType } from '@/types';

import { Modal, type App, Notice } from 'obsidian';
import EditModalContent from './EditModalContent.svelte';
import { toPng, toBlob } from 'html-to-image';

export default class EditModal extends Modal {
  plugins: CodeToImagePluginType;
  modalContent: EditModalContent;
  lang: LanguageType;
  code: string;

  constructor(app: App, plugins: CodeToImagePluginType, lang: LanguageType, code: string) {
    super(app);

    this.plugins = plugins;
    this.lang = lang;
    this.code = code;
    this.initModal();
  }

  private getEditElement = () => {
    const ele = document.querySelector('#code-to-image-content') as HTMLDivElement;
    return ele;
  };

  private toPng = () => {
    toPng(this.getEditElement())
      .then(dataUrl => {
        const img = new Image();
        img.src = dataUrl;
        new Notice('图片生成成功', 3000);
        this.getEditElement().appendChild(img);
      })
      .catch(() => {});
  };

  private initModal = () => {
    this.modalEl.addClass('code-to-image-modal');
    this.titleEl.innerText = 'CodeToImage';

    this.modalContent = new EditModalContent({
      target: this.contentEl,
      props: {
        lang: this.lang,
        value: this.code,
        actions: {
          toPng: this.toPng,
          onCopyAsImage: this.onCopyAsImage,
        },
      },
    });

    this.open();
  };

  public onOpen(): void {
    super.onOpen();
  }

  public onClose(): void {
    super.onClose();
    this.modalContent.$destroy();
  }

  onCopyAsImage = async () => {
    const target = this.contentEl.querySelector('#ctj-edit_background') as HTMLElement;
    const blob = await toBlob(target, {
      canvasHeight: target.clientHeight,
      canvasWidth: target.clientWidth,
    });
    if (blob) {
      new Notice('Copy As Image Success');
      window.navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    }
  };
}
