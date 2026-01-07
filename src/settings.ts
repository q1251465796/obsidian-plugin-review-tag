import { Plugin, PluginSettingTab, Setting } from "obsidian";

export interface ReviewTagSettings {
  tagPrefix: string;
  includeSubdirectories: boolean;
}

export const DEFAULT_SETTINGS: ReviewTagSettings = {
  tagPrefix: "review",
  includeSubdirectories: true,
};

export class ReviewTagSettingTab extends PluginSettingTab {
  plugin: Plugin;

  constructor(app: any, plugin: Plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    const plugin = this.plugin as any;

    containerEl.empty();
    containerEl.createEl("h2", { text: "Review Tag 设置" });

    new Setting(containerEl)
      .setName("标签前缀")
      .setDesc('自定义复习标签的前缀，例如 "review" 对应标签格式 "#review/2026/1/20"')
      .addText((text) =>
        text
          .setPlaceholder("review")
          .setValue(plugin.settings?.tagPrefix || DEFAULT_SETTINGS.tagPrefix)
          .onChange(async (value) => {
            plugin.settings.tagPrefix = value;
            await plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("包含子目录")
      .setDesc("是否扫描所有子目录中的Markdown文件")
      .addToggle((toggle) =>
        toggle
          .setValue(
            plugin.settings?.includeSubdirectories || DEFAULT_SETTINGS.includeSubdirectories
          )
          .onChange(async (value) => {
            plugin.settings.includeSubdirectories = value;
            await plugin.saveSettings();
          })
      );
  }
}
