import { TagParser } from '../src/utils/tagParser';
import { expect, test, describe, it } from 'vitest';

describe('TagParser', () => {
  describe('parseReviewTag', () => {
    it('should parse valid review tag with default prefix', () => {
      const tag = '#review/2026/1/20';
      const result = TagParser.parseReviewTag(tag);

      expect(result.isValid).toBe(true);
      expect(result.tag).toBe(tag);
      expect(result.date).toEqual(new Date(2026, 0, 20));
    });

    it('should parse valid review tag with custom prefix', () => {
      const tag = '#myreview/2026/12/31';
      const result = TagParser.parseReviewTag(tag, 'myreview');

      expect(result.isValid).toBe(true);
      expect(result.tag).toBe(tag);
      expect(result.date).toEqual(new Date(2026, 11, 31));
    });

    it('should return invalid for tag with wrong prefix', () => {
      const tag = '#wrongprefix/2026/1/20';
      const result = TagParser.parseReviewTag(tag);

      expect(result.isValid).toBe(false);
    });

    it('should return invalid for tag with wrong date format', () => {
      const tag = '#review/2026/13/20'; // 无效月份
      const result = TagParser.parseReviewTag(tag);

      expect(result.isValid).toBe(false);
    });

    it('should return invalid for tag with missing date parts', () => {
      const tag = '#review/2026/1'; // 缺少日期
      const result = TagParser.parseReviewTag(tag);

      expect(result.isValid).toBe(false);
    });
  });

  describe('isReviewTag', () => {
    it('should return true for valid review tag', () => {
      const tag = '#review/2026/1/20';
      const result = TagParser.isReviewTag(tag);

      expect(result).toBe(true);
    });

    it('should return false for invalid review tag', () => {
      const tag = '#review/invalid/date';
      const result = TagParser.isReviewTag(tag);

      expect(result).toBe(false);
    });

    it('should return false for non-review tag', () => {
      const tag = '#normal/tag';
      const result = TagParser.isReviewTag(tag);

      expect(result).toBe(false);
    });
  });

  describe('extractReviewTags', () => {
    it('should extract multiple review tags from text', () => {
      const text = `
        # 标题
        这是一段包含多个复习标签的文本。
        第一个标签：#review/2026/1/20
        第二个标签：#review/2026/2/15
        普通标签：#normal/tag
      `;

      const result = TagParser.extractReviewTags(text);

      expect(result.length).toBe(2);
      expect(result[0].tag).toBe('#review/2026/1/20');
      expect(result[1].tag).toBe('#review/2026/2/15');
    });

    it('should extract review tags with custom prefix', () => {
      const text = `
        # 标题
        自定义前缀标签：#myreview/2026/3/10
        普通标签：#normal/tag
      `;

      const result = TagParser.extractReviewTags(text, 'myreview');

      expect(result.length).toBe(1);
      expect(result[0].tag).toBe('#myreview/2026/3/10');
    });

    it('should return empty array when no review tags found', () => {
      const text = `
        # 标题
        这是一段没有复习标签的文本。
        只有普通标签：#normal/tag
      `;

      const result = TagParser.extractReviewTags(text);

      expect(result.length).toBe(0);
    });

    it('should handle text with no tags', () => {
      const text = `
        # 标题
        这是一段没有任何标签的文本。
      `;

      const result = TagParser.extractReviewTags(text);

      expect(result.length).toBe(0);
    });
  });
});
