

/**
 * esp-ai TTS 插件开发
 * 
 * 演示请求海豚配音服务，并且流式返回到客户端
*/
module.exports = {
    // 插件名字
    name: "esp-ai-plugin-iat-example",
    // 插件类型 LLM | TTS | IAT
    type: "IAT",
    /**
    * 插件逻辑
    * @param {String} device_id 设备id  
    * @param {Function} cb ({text, device_id})=> void 回调函数   
    */
    main(device_id, cb) {
        const { devLog, api_key, iat_server } = G_config;
        devLog && console.log('\n=== 开始请求语音识别 ===');
        const config = {
            appid: api_key[iat_server]?.appid,
        }

        /**
         * 函数回到中可以收到客户端采集到的 pcm 音频：单通道/16khz 
        */
        function send_pcm(data) {
            const { iat_server_connected } = G_devices.get(device_id);
            if (!iat_server_connected) return;

            // 要发送给服务器的参数
            let frameDataSection = {
                "status": iat_status,
                // 这里的帧率一定要和 inmp441 终端对上
                "format": "audio/L16;rate=16000",
                "audio": data.toString('base64'),
                "encoding": "raw"
            }
            // ... 
            console.log("PCM:", data)
        }
        // 固定写法
        G_devices.set(device_id, {
            ...G_devices.get(device_id),
            send_pcm: send_pcm
        })


        setTimeout(() => {
            // 不管逻辑怎么写，语音识别完毕都都只需要执行 cb 即可
            cb({ device_id, text: "帮我写一首小诗" })
        }, 3000)
    }
}
