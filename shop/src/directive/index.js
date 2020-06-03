// 一般配合store使用
export const permission = {
  inserted (el, binding) {
    let hasPermission = null;
    const storeBtn = ['2', '4'];
    if (Array.isArray(binding.value)) {
      // hasPermission = store.getters.btns.some(item => binding.value.includes(item));
    } else {
      hasPermission = storeBtn.includes(binding.value);
    }
    el.style.display = hasPermission ? 'inline-block' : 'none';
  }
};
export const dock = {
  inserted (el, binding) {
    let hasPermission = null;
    const storeBtn = ['2', '4'];
    if (Array.isArray(binding.value)) {
      console.info('array');
      // hasPermission = store.getters.btns.some(item => binding.value.includes(item));
    } else {
      hasPermission = storeBtn.includes(binding.value);
    }
    el.style.display = hasPermission ? 'inline-block' : 'none';
  }
};
