import { App, Modal } from 'obsidian';
import { createApp } from 'vue';
import MinimalPlugin from './main';
import ReviewTagComponent from './components/ReviewTag.vue';

export class ReviewTagModal extends Modal {
  plugin: MinimalPlugin;
  vueApp: any;

  constructor(app: App, plugin: MinimalPlugin) {
    super(app);
    this.plugin = plugin;
  }

  onOpen() {
    const { contentEl } = this;

    this.vueApp = createApp(ReviewTagComponent);
    this.vueApp.mount(contentEl);
  }

  onClose() {
    const { contentEl } = this;
    if (this.vueApp) {
      this.vueApp.unmount();
    }
    contentEl.empty();
  }
}
