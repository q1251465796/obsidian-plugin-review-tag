<template>
  <div class="review-tag-component">
    <div class="review-tag-header">
      <h3>待复习标签</h3>
      <div class="tag-count">{{ reviewTags.length }} 个待复习</div>
    </div>

    <div class="review-tag-list" v-if="reviewTags.length > 0">
      <!-- 按文件分组显示 -->
      <div v-for="(fileGroup, filePath) in groupedTags" :key="filePath" class="file-group">
        <div class="file-header" @click="toggleFile(filePath)">
          <span class="toggle-icon">{{ expandedFiles[filePath] ? "▼" : "►" }}</span>
          <span class="file-path">{{ filePath }}</span>
        </div>

        <div v-if="expandedFiles[filePath]" class="tag-items">
          <div
            v-for="tag in fileGroup"
            :key="tag.lineNumber"
            class="tag-item"
            @click="navigateToTag(tag)"
          >
            <div class="tag-title-path">
              {{ tag.titlePath.join(" → ") || "无标题" }}
            </div>
            <div class="tag-info">
              <span class="tag-text">{{ tag.tag }}</span>
              <span class="tag-date">{{ formatDate(tag.date) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">目前没有待复习的标签</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useReviewTagStore } from "../stores/reviewTagStore";
import ReviewTagPlugin, { ReviewTag } from "../main";
import { MarkdownView } from "obsidian";

const props = defineProps<{
  plugin: ReviewTagPlugin;
}>();

const reviewTagStore = useReviewTagStore();
const reviewTags = computed(() => reviewTagStore.reviewTags);

// 状态管理
const expandedFiles = ref<Record<string, boolean>>({});

// 按文件分组标签
const groupedTags = computed(() => {
  return reviewTags.value.reduce(
    (groups, tag) => {
      const filePath = tag.file.path;
      if (!groups[filePath]) {
        groups[filePath] = [];
      }
      groups[filePath].push(tag);
      return groups;
    },
    {} as Record<string, ReviewTag[]>
  );
});

// 初始化时展开所有文件
onMounted(() => {
  Object.keys(groupedTags.value).forEach((filePath) => {
    expandedFiles.value[filePath] = true;
  });
});

// 切换文件展开/折叠状态
const toggleFile = (filePath: string) => {
  expandedFiles.value[filePath] = !expandedFiles.value[filePath];
};

// 导航到标签位置
const navigateToTag = (tag: ReviewTag) => {
  const app = props.plugin.app;
  const workspace = app.workspace;

  workspace.openLinkText(tag.file.path, "", true).then(() => {
    const activeLeaf = workspace.getActiveViewOfType(MarkdownView);
    if (activeLeaf) {
      const editor = activeLeaf.editor;
      if (editor) {
        const line = editor.getLine(tag.lineNumber - 1);
        if (line !== null) {
          editor.setCursor({ line: tag.lineNumber - 1, ch: 0 });
          editor.focus();
        }
      }
    }
  });
};

// 格式化日期
const formatDate = (date: Date) => {
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};
</script>

<style scoped>
.review-tag-component {
  width: 500px;
  max-height: 600px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.review-tag-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  border-bottom: 1px solid var(--background-modifier-border);
}

.review-tag-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.tag-count {
  font-size: 12px;
  color: var(--text-muted);
  background-color: var(--background-secondary);
  padding: 2px 8px;
  border-radius: 10px;
}

.review-tag-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.file-group {
  margin-bottom: 8px;
}

.file-header {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  cursor: pointer;
  background-color: var(--background-secondary);
  border-radius: 4px;
  transition: background-color 0.2s;
}

.file-header:hover {
  background-color: var(--background-modifier-hover);
}

.toggle-icon {
  font-size: 10px;
  margin-right: 8px;
  color: var(--text-muted);
  width: 12px;
  text-align: center;
}

.file-path {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-normal);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tag-items {
  margin-left: 24px;
  margin-top: 4px;
  margin-bottom: 4px;
}

.tag-item {
  padding: 10px 16px;
  margin-bottom: 4px;
  background-color: var(--background-primary);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid var(--background-modifier-border);
}

.tag-item:hover {
  background-color: var(--background-modifier-hover);
  border-color: var(--interactive-accent);
}

.tag-title-path {
  font-size: 13px;
  color: var(--text-normal);
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tag-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tag-text {
  font-size: 12px;
  color: var(--text-muted);
  background-color: var(--background-secondary);
  padding: 2px 6px;
  border-radius: 3px;
}

.tag-date {
  font-size: 12px;
  color: var(--text-accent);
}

.empty-state {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--text-muted);
  font-style: italic;
}

/* 滚动条样式 */
.review-tag-list::-webkit-scrollbar {
  width: 8px;
}

.review-tag-list::-webkit-scrollbar-track {
  background: var(--background-secondary);
}

.review-tag-list::-webkit-scrollbar-thumb {
  background: var(--background-modifier-border);
  border-radius: 4px;
}

.review-tag-list::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}
</style>
