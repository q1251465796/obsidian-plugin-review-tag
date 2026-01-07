export interface ParsedReviewTag {
  tag: string;
  date: Date;
  isValid: boolean;
}

export class TagParser {
  /**
   * 解析复习标签，提取复习时间
   * @param tag 标签字符串，如 "#review/2026/1/20"
   * @param tagPrefix 自定义标签前缀，默认 "review"
   * @returns 解析结果，包含标签、日期和是否有效
   */
  static parseReviewTag(tag: string, tagPrefix: string = "review"): ParsedReviewTag {
    // 移除标签前缀的 # 符号
    const cleanTag = tag.replace("#", "");

    // 检查标签是否以指定前缀开头
    if (!cleanTag.startsWith(tagPrefix)) {
      return {
        tag,
        date: new Date(),
        isValid: false,
      };
    }

    // 提取日期部分
    const datePart = cleanTag.substring(tagPrefix.length + 1);
    const dateParts = datePart.split("/").map((part) => parseInt(part, 10));

    // 检查日期格式是否正确
    if (dateParts.length !== 3 || dateParts.some((part) => isNaN(part))) {
      return {
        tag,
        date: new Date(),
        isValid: false,
      };
    }

    // 解析日期
    const [year, month, day] = dateParts;
    const date = new Date(year, month - 1, day);

    // 验证日期是否有效
    const isValid =
      !isNaN(date.getTime()) &&
      date.getFullYear() === year &&
      date.getMonth() + 1 === month &&
      date.getDate() === day;

    return {
      tag,
      date,
      isValid,
    };
  }

  /**
   * 检查标签是否为有效复习标签
   * @param tag 标签字符串
   * @param tagPrefix 自定义标签前缀
   * @returns 是否为有效复习标签
   */
  static isReviewTag(tag: string, tagPrefix: string = "review"): boolean {
    return this.parseReviewTag(tag, tagPrefix).isValid;
  }

  /**
   * 从文本中提取所有复习标签
   * @param text 文本内容
   * @param tagPrefix 自定义标签前缀
   * @returns 所有有效复习标签的解析结果
   */
  static extractReviewTags(text: string, tagPrefix: string = "review"): ParsedReviewTag[] {
    // 匹配所有标签，格式为 #review/YYYY/MM/DD
    const tagRegex = new RegExp(`#${tagPrefix}/\\d{4}/\\d{1,2}/\\d{1,2}`, "g");
    const tags = text.match(tagRegex) || [];

    // 解析所有标签并返回有效标签
    return tags.map((tag) => this.parseReviewTag(tag, tagPrefix)).filter((tag) => tag.isValid);
  }
}
