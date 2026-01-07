import { defineStore } from "pinia";
import { ref } from "vue";
import { ReviewTag } from "../main";

export const useReviewTagStore = defineStore("reviewTag", () => {
  const reviewTags = ref<ReviewTag[]>([]);

  function setReviewTags(tags: ReviewTag[]) {
    reviewTags.value = tags;
  }

  function addReviewTags(tags: ReviewTag[]) {
    reviewTags.value.push(...tags);
  }

  function clearReviewTags() {
    reviewTags.value = [];
  }

  return {
    reviewTags,
    setReviewTags,
    addReviewTags,
    clearReviewTags,
  };
});
