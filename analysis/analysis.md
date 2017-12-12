# connect-timeout analysis
## 一. Readme文档    
### 1. 安装    
  $npm install connect-timeout
### 2. API  

   App.use(timeout('5s')) 
   当请求超过给定的超时时，库发出超时事件，节点继续处理缓慢的请求，直到它终止，即使您在超时回调中返回HTTP响应，缓慢的请求也将继续使用CPU和内存。为了更好控制CPU、内存、您可能需要查找很长时间的事件（第三方HTTP请求，磁盘I/O请求，数据库调用），并找到取消他们的方法，和/或关闭附加的套接字。 
   
### 3. 超时（时间，[选项]）    
  返回以time 毫秒为单位的超时的中间件。Time 也可以是ms模块接受的字符串。超时后，req发出‘timeout’。 
  
   **选项** 
   该timeout函数采用options可能包含以下任何键的可选对象。    
   >响应    
   > 控制此模块是否会以转发错误的形式“回应”。如果true传递超时错误，next()以便您可以自定义响应行为。这个错误有一个.timeout属性以及.status == 503。这个默认为true。  
   
   >req.clearTimeout（）  
   >清除请求的超时时间。超时被完全删除，将来不会触发此请求。  
     
   >req.timedout  
   >true如果超时被解雇; false除此以外
   
##  二.文件解读  
### 1. package.json 文件中的依赖项  

 **http-errors 创建HTTP错误**  
>createError([status], [message], [properties])    
>status:503 作为数字状态码 503 暂停服务  
>message 错误信息，默认为该状态的节点文本  
>properties 要附加到对象的自定义属性  

**On-headers 响应即将写入标头时执行侦听器**  
>onHeaders（res，listener）  
>这将添加侦听器listener在发出标题时触发res。监听器通过responsecontext（this）传递对象。在发送给客户之前，头部被认为只发出一次。
当这个被多次调用时res，listeners被按照相反的顺序被触发。  

**On-finished HTTP请求关闭，完成或错误时执行回调**  
>onFinished（res，listener）  
>附加一个监听器来监听响应结束。响应完成后，侦听器只会被调用一次。如果响应完成了一个错误，第一个参数将包含错误。如果响应已经完成，则监听器将被调用。
>听到响应的结尾将被用于关闭与响应相关的事物，如打开的文件。
>监听器被调用为listener(err, res)。  

**ms 时间格式转换为毫秒**  
>如果提供一个数字ms，则返回一个带有单位的字符串  
>如果提供包含数字的字符串，它返回它作为一个号码（例如：它返回100对'100'）  
>如果用一个数字和一个有效单位传递一个字符串，则返回等价的毫秒数  
 
### 2. index.js 代码
**代码注释**[https://github.com/douoooou/connect-timeout/blob/master/index1.js](https://github.com/douoooou/connect-timeout/blob/master/index1.js)
