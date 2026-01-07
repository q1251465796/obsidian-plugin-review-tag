import { Plugin, TFile } from "obsidian";
import { createPinia, setActivePinia } from "pinia";
import { ReviewTagSettings, DEFAULT_SETTINGS, ReviewTagSettingTab } from "./settings";
import { ReviewTagModal } from "./modal";
import { TagParser } from "./utils/tagParser";
import { useReviewTagStore } from "./stores/reviewTagStore";

export interface ReviewTag {
  file: TFile;
  tag: string;
  date: Date;
  titlePath: string[];
  lineNumber: number;
}

export default class ReviewTagPlugin extends Plugin {
  settings: ReviewTagSettings | null = null;
  reviewTags: ReviewTag[] = [];
  pinia: ReturnType<typeof createPinia> | null = null;

  async onload() {
    this.pinia = createPinia();
    setActivePinia(this.pinia);
    await this.loadSettings();
    this.addSettingTab(new ReviewTagSettingTab(this.app, this));
    this.addRibbonIcon("tag", "复习标签", async () => {
      await this.scanFilesForReviewTags();
      new ReviewTagModal(this.app, this).open();
    });
    console.log("Review Tag plugin loaded");
  }

  onunload() {
    console.log("Review Tag plugin unloaded");
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData()) as ReviewTagSettings;
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  /**
   * 扫描所有Markdown文件，收集待复习标签
   */
  async scanFilesForReviewTags() {
    const markdownFiles = this.app.vault.getMarkdownFiles();
    this.reviewTags = [];

    for (const file of markdownFiles) {
      const tagsInFile = await this.extractTagsFromFile(file);
      this.reviewTags.push(...tagsInFile);
    }
    console.log("扫描完成，共发现", this.reviewTags.length, "个待复习标签");

    // 按日期排序，先显示最早的复习标签
    this.reviewTags.sort((a, b) => a.date.getTime() - b.date.getTime());

    // 将数据存储到Pinia store
    const store = useReviewTagStore();
    const pendingTags = this.getPendingReviewTags();
    store.setReviewTags(pendingTags);
    console.log("已将待复习标签存储到Pinia store，数量:", pendingTags.length);
  }

  /**
   * 从单个文件中提取复习标签
   * @param file Markdown文件
   * @returns 该文件中的所有待复习标签
   */
  async extractTagsFromFile(file: TFile): Promise<ReviewTag[]> {
    const content = await this.app.vault.cachedRead(file);
    const lines = content.split("\n");
    const tags: ReviewTag[] = [];
    const titlePath: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // 更新标题路径
      const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const title = headingMatch[2].trim();

        // 调整标题路径
        titlePath.splice(level - 1);
        titlePath.push(title);
      }

      // 提取标签
      const extractedTags = TagParser.extractReviewTags(line, this.settings?.tagPrefix || "review");
      for (const parsedTag of extractedTags) {
        tags.push({
          file,
          tag: parsedTag.tag,
          date: parsedTag.date,
          titlePath: [...titlePath],
          lineNumber: i + 1,
        });
      }
    }

    return tags;
  }

  /**
   * 获取当前需要复习的标签
   * @returns 截至当前日期的所有待复习标签
   */
  getPendingReviewTags(): ReviewTag[] {
    const now = new Date();
    const pendingTags = this.reviewTags.filter((tag) => tag.date <= now);
    console.log("待复习标签数量:", pendingTags.length, "当前时间:", now);
    console.log("所有标签:", this.reviewTags);
    return pendingTags;
  }
}
