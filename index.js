var fs = require('fs');

fs.readFile('RAP.json', 'utf-8',
    // 读取文件完成时调用的回调函数
    function(err, data) { 
      if(err){
        console.log(err)
        return
      } 
        // json数据
        var jsonData = JSON.parse(data); 
        // 解析json 每个tab页面
        const apiList = jsonData.item;
        if(apiList.length){
            fs.mkdir(`./${jsonData.info.name}`, (error) => {
                if (error) {
                  console.log(error);
                } else {
                  console.log("文件夹创建成功！");
                }
              });
        }
        apiList.forEach((list,index)=>{
            // 接口模块名
            const fileName = list.name
            let fileData=''
            list.item.forEach(api=>{
                const path= api.request.url.path.length&&api.request.url.path[0]
                if(path){
                    const nameIndex = path.lastIndexOf("/")
                    // 接口名
                    const name = path.substring(nameIndex+1,path.length)
                    // get post
                    const method= api.request.method.toLowerCase()
                    const queryKey=method==='get'?'params':'data'
                    const value = '//'+api.name+'\r\nexport function '+name+"(params) { \r\n  return axios({ \r\n    url:'"+api.request.url.path[0]+"', \r\n"
                    +"    method:'"+method+"', \r\n    "+queryKey+':params \r\n  }) \r\n}\r\n'
                    fileData+=value
                }
                
            })
            fs.appendFileSync(`./${jsonData.info.name}/`+fileName+".js",fileData,function(err){},console.log(fileName+': 开始写入'))
        })
        
 })