const querystring = require('querystring');
const express = require('express');
const request = require('request');

const githubConfig = require('./oauth.conf')

let app = express();

// 做一个路由函数，监听/github/login 的get请求
app.get('/github/login', async function(req,res){
    
  //read code from url
  let code = req.query.code

  // 收到code后，向GitHub请求用户的token
  request.post(githubConfig.access_token_url, {
      form:{
        client_id: githubConfig.client_ID,
        client_secret: githubConfig.client_Secret,
        code: code
      }
    },function(error, response, body) {
     //正常情况下，返回值应该是形如access_token=9094eb58a23093fd59
     // 3d43eb28c1f06ce7904ed5&scope=&token_type=bearer
     // 的字符串，可以通过下面的函数来解析
      let result = querystring.parse(body)
      
      // 拿到token后，返回结果，表示我们成功了
      let access_token = result["access_token"]
      if(access_token == undefined){
        res.send(result.error_description)
      }
      res.send(`You are login! you token is ${access_token}`)
    })
})

// 监听 8999 ，启动程序。注意端口号要和我们之前填写的保持一致
app.listen(8099,function(){
    console.log('listening localhost:8099')
})