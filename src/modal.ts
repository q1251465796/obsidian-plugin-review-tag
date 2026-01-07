import { App, Modal } from "obsidian";
import { createApp } from "vue";
import ReviewTagPlugin from "./main";
import ReviewTagComponent from "./components/ReviewTag.vue";

export class ReviewTagModal extends Modal {
  plugin: ReviewTagPlugin;
  vueApp: any;

  constructor(app: App, plugin: ReviewTagPlugin) {
    super(app);
    this.plugin = plugin;
    this.titleEl.setText("待复习标签");
  }

  onOpen() {
    const { contentEl } = this;

    // 使用插件中的Pinia实例
    if (!this.plugin.pinia) {
      throw new Error("Pinia instance not found in plugin");
    }

    this.vueApp = createApp(ReviewTagComponent, {
      plugin: this.plugin,
    });
    this.vueApp.use(this.plugin.pinia);
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
