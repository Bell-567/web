// 知识点：uni-app 页面生命周期 —— onPageScroll 只能在页面 setup 中注册，
// 因此封装为组合式函数，由各页面调用，再把结果传给 AppShell / BackToTop。
import { ref } from 'vue'
import { onPageScroll } from '@dcloudio/uni-app'

export function usePageScroll(threshold = 400) {
  const showBackTop = ref(false)

  onPageScroll((e) => {
    showBackTop.value = (e.scrollTop || 0) > threshold
  })

  return { showBackTop }
}
