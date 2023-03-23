var request = require('request');
var fs = require('fs');

request.get({url:'https://rap2-delos.yscredit.com/repository/get?id=21', headers: {
    "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.62 Safari/537.36',
    Cookie:''
},
}, function(error, response, body) {
    if(error){
        console.log(error,'cookie失效')
        return
    }


      var jsonData = JSON.parse(body); 
       const apiList = jsonData.data&&jsonData.data.modules;
       if(!apiList){
           console.log('该仓库无接口')
           return
       }
       fs.mkdir(`./${jsonData.data.name}`, (error) => {
        if (error) {
          console.log(error);
        } else {
          console.log("文件夹创建成功！");
        }
      });
       apiList.forEach((list,index)=>{
        // 接口模块名
        const fileName = list.name
        let fileData=''
        list.interfaces.forEach(api=>{
            const path=api.url
            if(path){
                const nameIndex = path.lastIndexOf("/")
                // 接口名
                const name = path.substring(nameIndex+1,path.length)
                // get post
                const method= api.method.toLowerCase()
                const queryKey=method==='get'?'params':'data'
                const value = '//'+api.name+'\r\nexport function '+name+"(params) { \r\n  return axios({ \r\n    url:'"+path+"', \r\n"
                +"    method:'"+method+"', \r\n    "+queryKey+':params \r\n  }) \r\n}\r\n'
                fileData+=value
            }
            
        })
        fs.appendFileSync(`./${jsonData.data.name}/`+fileName+".js",fileData,function(err){},console.log(': 开始写入'))

    })


})
