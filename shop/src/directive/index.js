// 一般配合store使用
export const permission = {
  inserted (el, binding) {
    let hasPermission = null;
    const storeBtn = ['2', '4'];
    if (Array.isArray(binding.value)) {
      console.info('array');
      // hasPermission = store.getters.btns.some(item => binding.value.includes(item));
    } else {
      console.info(binding.value);
      hasPermission = storeBtn.includes(binding.value);
    }
    console.info(hasPermission);
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
      console.info(binding.value);
      hasPermission = storeBtn.includes(binding.value);
    }
    console.info(hasPermission);
    el.style.display = hasPermission ? 'inline-block' : 'none';
  }
};
