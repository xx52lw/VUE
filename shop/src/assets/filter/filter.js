// 日期格式 yyyy-MM-dd hh:mm:ss
// eslint-disable-next-line no-unused-vars
const dateFormatFilter = function (date) {
  if (date == null) {
    return ''
  } else {
    const dt = new Date()
    const yyyy = dt.getFullYear()
    const MM = (dt.getMonth() + 1 + '').padStart(2, '0')
    const dd = (dt.getDay() + '').padStart(2, '0')
    const hh = (dt.getHours() + '').padStart(2, '0')
    const mm = (dt.getMinutes() + '').padStart(2, '0')
    const ss = (dt.getSeconds() + '').padStart(2, '0')
    return yyyy + '-' + MM + '-' + dd + ' ' + hh + ':' + mm + ':' + ss
  }
}

export default {
  dateFormatFilter
}
