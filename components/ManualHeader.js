import { useMoralis } from "react-moralis";
import { useEffect } from "react";

export default function ManualHeader() {
  const {
    enableWeb3,
    account,
    isWeb3Enabled,
    Moralis,
    deactivateWeb3,
    isWeb3EnableLoading,
  } = useMoralis(); //useMoralis是一个钩子（可以感知哪些状态变量变化了，重新渲染页面？），还需要在app.js中将整个应用程序包裹在react-moralis中
  //no depencyArray:run anytime something re-renders（重新渲染）
  //Calful with this!! Because then you can get circular render
  //blank dependency array,run once on load? 还会被react.strictMode 影响？
  //如果array里的参数变化，也会触发函数调用
  useEffect(() => {
    //链接过后，再刷新页面，isWeb3Enabled 会被重置为false
    if (isWeb3Enabled) {
      return;
    } else {
      console.log(`isWeb3Enabled: ${isWeb3Enabled}`);
    }
    if (typeof window != "undefined") {
      if (window.localStorage.getItem("connected", "inject")) {
        enableWeb3(); //会触发连接钱包的请求，如果钱包内是已连接则不会弹窗
      }
    }
  }, [isWeb3Enabled]);
  useEffect(() => {
    //这个方法会启动一个监听事件？
    Moralis.onAccountChanged((account) => {
      //为什么会被调用两次?
      console.log(`Account change to ${account}`);
      if (account == null) {
        //钱包断开链接
        window.localStorage.removeItem("connected");
        //将isWeb3Enabled置为false
        deactivateWeb3();
        console.log("NUll Account Fund");
      }
    });
  }, []);

  return (
    <div>
      {account ? (
        <div>
          Connected to {account.slice(0, 6)}...
          {account.slice(account.length - 4)}
        </div>
      ) : (
        /* 这种刷新页面后链接又失效了，必须重新点击按钮触发enableWeb3 */
        <button
          onClick={async () => {
            await enableWeb3();
            if (typeof window != "undefined") {
              window.localStorage.setItem("connected", "inject");
            }
          }}
          disabled={isWeb3EnableLoading}
        >
          Connect
        </button>
      )}
    </div>
  );
}
