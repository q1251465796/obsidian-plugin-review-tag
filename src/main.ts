import { Plugin } from 'obsidian';
import { ReviewTagSettings, DEFAULT_SETTINGS, ReviewTagSettingTab } from './settings';
import { ReviewTagModal } from './modal';

export default class MinimalPlugin extends Plugin {
  settings: ReviewTagSettings | null = null;

  async onload() {
    await this.loadSettings();
    this.addSettingTab(new ReviewTagSettingTab(this.app, this));
    this.addRibbonIcon('tag', '复习标签', () => {
      new ReviewTagModal(this.app, this).open();
    });
    console.log('Review Tag plugin loaded');
  }

  onunload() {
    console.log('Review Tag plugin unloaded');
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData()) as ReviewTagSettings;
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
