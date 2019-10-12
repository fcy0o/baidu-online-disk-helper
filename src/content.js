import { createClient } from 'connect.io';

const client = createClient();

// 注意，必须设置了run_at=document_start 此段代码才会生效
document.addEventListener('DOMContentLoaded', function() {
  // 注入自定义JS
  injectCustomJs();
});

// 向页面注入JS
function injectCustomJs(jsPath) {
  jsPath = jsPath || 'baidu-online-disk-helper.js';
  var temp = document.createElement('script');
  temp.setAttribute('type', 'text/javascript');
  // 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
  temp.src = chrome.extension.getURL(jsPath);
  temp.onload = function() {
    // 放在页面不好看，执行完后移除掉
    this.parentNode.removeChild(this);
  };
  document.body.appendChild(temp);
}

// 监听来自 inject js 的消息
window.addEventListener(
  'message',
  e => {
    let message = e.data;
    if (!message['baiduOnlineDiskHelper']) {
      return;
    }
    let data = message['baiduOnlineDiskHelper'];
    // 发送给 background
    client.send('setAutoExtractUrls', data, false);
  },
  false
);
