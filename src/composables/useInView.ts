import { onBeforeUnmount, ref, watch, type Ref } from 'vue';

/**
 * Track whether an element is visible in the viewport
 * @param target Element to observe
 * @param rootMargin Margin around the viewport, to start loading before the element is in view
 * @returns Whether the element is in view
 */
export function useInView(target: Ref<HTMLElement | null>, rootMargin = '300px'): Ref<boolean> {
  const isInView = ref(false);
  const observer = new IntersectionObserver(
    ([entry]) => {
      isInView.value = entry.isIntersecting;
    },
    { rootMargin }
  );

  watch(
    target,
    (element, oldElement) => {
      if (oldElement) observer.unobserve(oldElement);
      if (element) observer.observe(element);
    },
    { immediate: true }
  );

  onBeforeUnmount(() => observer.disconnect());

  return isInView;
}
