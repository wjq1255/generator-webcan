# LoftMobile

LoftMobile是针对移动端研发的组件库

## 介绍说明

目录介绍：

    dist
    └── loft-mobile
    │    ├── css
    │    │    ├── loft-mobile-compact.css
    │    │    ├── loft-mobile-compact.min.css
    │    │    ├── loft-mobile-default.css
    │    │    ├── loft-mobile-default.min.css
    │    ├── img
    │    ├── js
    │    │    ├── loft-mobile-all.js
    │    │    ├── loft-mobile-all.min.js
    │    │    └── loft-mobile-require.js
    │    ├── locale
    │    │    ├── loft-mobile-locale.en.js
    │    │    └── loft-mobile-locale.zh.js
    │    └── widget

- `css` 目录放置主题样式文件，提供默认/紧凑风格
- `img` 放置用到的图标
- `js` 放置生成的`js`文件
    - `loft-mobile-all.js` 包含常用组件和一些大型组件(`grid`,`tree`等），适用于企业`ERP`应用
    - `loft-mobile-net.js` 包含常用组件，是用于互联网应用
    - `loft-mobile-require.js` 用于业务`AMD`模块化加载
- `locale` 放置国际化资源文件
- `widget` 放置非核心组件

## 安装编译

环境准备

- nodejs
- ruby (api生成需要)


安装grunt命令

    npm install -g grunt-cli

下载工程

    git clone http://172.16.128.161/loft/loft-mobile-dist.git


## 使用示例

典型的index页代码

    <!DOCTYPE html>
    <!--[if !IE]><!-->
    <html class="no-js">
    <!--<![endif]-->
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta name="renderer" content="webkit">
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="">
        <meta name="author" content="">
        <title>标题</title>
        <link href="frm/loft-mobile/dist/css/loft-mobile-default.min.css" rel="stylesheet">
    </head>

    <body>

    </body>
    <script type="text/javascript" src="frm/loft-mobile/dist/js/loft-mobile-all.min.js"></script>
    <script type="text/javascript" src="frm/loft-mobile/dist/libs/bootstrap/html5shiv.js"></script>
    <script type="text/javascript" src="frm/loft-mobile/dist/js/loft-mobile-require.js" data-main="app/config.js"></script>
    </html>

## Important

1. <!DOCTYPE html>声明是必须的，此声明必须位于第一行，此声明之前不能出现任何内容（包括空格），否则浏览器无法检测。
2. 针对IE的注释是必不可少的；
3. X-UA-Compatible元标签的配置是必不可少的，尤其是针对IE的配置，可以强制IE使用“标准模式”渲染页面，而不是以“怪异模式”；
4. renderer元标签用来兼容国产的一些垃圾双核浏览器，如360等，强制它们以chrome内核渲染页面；
5. viewport元标签用来支持响应式设计；


## 组件库

## dialog组件（不需要引用js）

1.默认模式（不自动消失）
   
   $.dialog({'content':'我是dialog'});
   
2.定时消失dialog
    
    $.dialog({
              content : '窗口将在2秒后自动关闭',
              title: "alert",
              width: 600,
              time : 2000
            });

3.带确认取消按钮dialog
    
    $.dialog({
            content : '对话框内容',
            title : 'ok',
            ok : function() {
                    alert('我是确定按钮，回调函数返回false时不会关闭对话框。');
                      return false;
                    },
            cancel : function() {
                    alert('我是取消按钮');
                    },
            lock : false
            });
   
## 滑动删除组件（不需要引用js）
   
html片段：
   
    <div>
       <ul>
         <li data-itemid="0001">Item 1</li>
         <li data-itemid="0002">Item 2</li>
         <li data-itemid="0003">Item 3</li>
         <li data-itemid="0004">Item 4</li>
         <li data-itemid="0005">Item 5</li>
        </ul>
    </div>

JS片段：
   
    $("ul").deleteitem({
        onDelClick:function(e){
            $.dialog({
                        content: '确认删除',
                        title: '确认',
                        ok: function() {
                            console.log(e.data.eventData)
                            return false;
                        },
                        cancel: function() {},
                        lock: false
                    });
        }
    })

## tab组件
需要引用核心js --- loft-mobile/dist/widget/tabs/loft.tabs.js 
                 loft-mobile/dist/widget/tabs/loft.tabs.swipe.js 
          css  --- loft-mobile/dist/widget/tabs/tabs.css
    
html片段：
    
    <div id="tabs1">
        <ul>
            <li><a href="#conten1">Tab1</a></li>
            <li><a href="#conten2">Tab2</a></li>
            <li><a href="#conten3">Tab3</a></li>
        </ul>
        <div id="conten1">content1</div>
        <div id="conten2">content2</div>
        <div id="conten3">content3</div>
    </div>

JS片段
    $('#tabs1').tabs({
        swipe: true
    })

## carsouel走马灯组件
需要引用核心js --- loft-mobile/dist/widget/carsouel/loft.carsouel.js  
          css  --- loft-mobile/dist/widget/carsouel/carsouel.css）
    
html片段：
    
    <div id="slider">
        <div>
            <a href="http://www.baidu.com/"><img src="image1.png"></a>
            <p>1,让Coron的太阳把自己晒黑—小天</p>
        </div>
        <div>
            <a href="http://www.baidu.com/"><img src="image2.png"></a>
            <p>2,让Coron的太阳把自己晒黑—小天</p>
        </div>
        <div>
            <a href="http://www.baidu.com/"><img src="image3.png"></a>
            <p>3,让Coron的太阳把自己晒黑—小天</p>
        </div>
        <div>
            <a href="http://www.baidu.com/"><img src="image4.png"></a>
            <p>4,让Coron的太阳把自己晒黑—小天</p>
        </div>
    </div>

JS片段：

    $('.slider').carsouel()


## icheck
需要引用核心js --- loft-mobile/dist/widget/icheck/loft.icheck.js  
          css  --- loft-mobile/dist/widget/icheck/icheck.css）
    
html片段(普通模式)：
    
    <div class="radio">
        <label>
            <input type="radio" name="fruit" value="orange">Orange
        </label>
        <label>
            <input type="radio" name="fruit" value="apple">Apple
        </label>
        <label>
            <input type="radio" name="fruit" value="banan">Banana
        </label>
    </div>

JS片段：

    $('input').icheck()

html片段(checkradio模式)：
    
    <div class="radio">
        <label>
            <input type="radio" name="fruit" value="orange">Orange
        </label>
        <label>
            <input type="radio" name="fruit" value="apple">Apple
        </label>
        <label>
            <input type="radio" name="fruit" value="banan">Banana
        </label>
    </div>

JS片段：

    $('input').icheck({'checkradio':true})


















