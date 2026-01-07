import { PluginSettingTab } from 'obsidian';

export interface ReviewTagSettings {
  defaultTag: string;
}

export const DEFAULT_SETTINGS: ReviewTagSettings = {
  defaultTag: '#review',
};

export class ReviewTagSettingTab extends PluginSettingTab {
  display(): void {
    const { containerEl } = this;

    containerEl.empty();
    containerEl.createEl('h2', { text: 'Review Tag 设置' });
  }
}
