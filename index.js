

/**
 * esp-ai IAT 插件开发 
*/
module.exports = {
    // 插件名字
    name: "esp-ai-plugin-iat-example",
    // 插件类型 LLM | TTS | IAT
    type: "IAT",
    /**
     * 语音识别插件  
     * @param {String}      device_id           设备ID    
     * @param {Number}      devLog              日志输出等级，为0时不应该输出任何日志   
     * @param {Object}      iat_config          用户配置的 apikey 等信息   
     * @param {String}      iat_server          用户配置的 iat 服务 
     * @param {String}      llm_server          用户配置的 llm 服务 
     * @param {String}      tts_server          用户配置的 tts 服务 
     * @param {Number}      vad_eos             用户配置的静默时间，超过这个时间不说话就结束语音识别  
     * @param {Function}    logWSServer         将 ws 服务回传给框架，如果不是ws服务可以这么写: logWSServer({ close: ()=> {} })
     * @param {Function}    iatServerErrorCb    与 TTS 服务之间发生错误时调用，并且传入错误说明，eg: ttsServerErrorCb("意外错误") 
     * @param {Function}    cb                  IAT 识别的结果调用这个方法回传给框架 eg: cb({ text: "我是语音识别结果"  })
     * @param {Function}    logSendAudio        记录发送音频数据给服务的函数，框架在合适的情况下会进行调用
     * @param {Function}    connectServerBeforeCb 连接 iat 服务逻辑开始前需要调用这个方法告诉框架：eg: connectServerBeforeCb()
     * @param {Function}    connectServerCb     连接 iat 服务后需要调用这个方法告诉框架：eg: connectServerCb(true)
     * @param {Function}    serverTimeOutCb     当 IAT 服务连接成功了，但是长时间不响应时
     * @param {Function}    iatEndQueueCb       iat 静默时间达到后触发， 一般在这里面进行最后一帧的发送，告诉服务端结束识别 
     * @param {Function}    log                 为保证日志输出的一致性，请使用 log 对象进行日志输出，eg: log.error("错误信息")、log.info("普通信息")、log.iat_info("iat 专属信息")
    */
    main({ device_id, log, devLog, iat_config, vad_eos, cb, iatServerErrorCb, logWSServer, logSendAudio, connectServerCb, serverTimeOutCb, iatEndQueueCb, connectServerBeforeCb, onIATText }) {
        const config = { ...iat_config }

        // connectServerBeforeCb();
        // // 连接 ws 服务后并且上报给框架
        // const iat_ws = new WebSocket("ws:/xxx")
        // logWSServer({ close: ()=>{  /** 直接断开WS服务 **/ }, end: ()=>{ /** 安全结束 ASR 服务 **/ } });
        // iat_ws.on('open', (event) => {
        //     // 服务连接成功后必须调用这个方法
        //     connectServerCb(true);
        // })
        // iat_ws.on('close', () => {
        //     // 关闭或者意外断开时也必须调用这个方法
        //     connectServerCb(false);
        // })

        // // 建连错误
        // iat_ws.on('error', (err) => { 
        //     // 必须调用下面两个方法
        //     iatServerErrorCb(err);
        //     connectServerCb(false);
        // })


        // 当达到静默时间后会自动执行这个任务
        iatEndQueueCb(() => {
            // 比如发送最后一帧数据等...
        })

        /**
         * 函数回到中可以收到客户端采集到的 pcm 音频：单通道/16khz 
        */
        function send_pcm(data) {
            const { iat_server_connected } = G_devices.get(device_id);
            if (!iat_server_connected) return;

            // 要发送给服务器的参数
            let frameDataSection = {
                "status": 0,
                // 这里的帧率一定要和 inmp441 终端对上
                "format": "audio/L16;rate=16000",
                "audio": data.toString('base64'),
                "encoding": "raw"
            }
            // 发送给服务器的请求... 
            console.log("PCM:", data)
        }

        // 必须将这个函数传给框架，当硬件采集到音频数据后，会调用这个函数
        logSendAudio(send_pcm)


        setTimeout(() => {
            // 不管逻辑怎么写，语音识别完毕都都只需要执行 cb 即可
            cb({ device_id, text: "帮我写一首小诗" })
            onIATText && onIATText("帮我写一首小诗");
        }, 3000)
    }
}
