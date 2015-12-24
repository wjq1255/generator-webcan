/**
 * Created by shihw11 on 2015/9/18.
 */

define([],function(){
    var redirectTo = function(param) {
        var frameId = 'my_iframe_' + new Date().getTime();
        var $frame = $('<iframe />');
        $frame.attr({
            style: "display:none;width:0;height:0",
            id: frameId,
            name: frameId,
            src: "javascript:false;"
        });
        $(document.body).append($frame);


        var callbackName = 'my_own_callback_name_' + new Date().getTime();
        var queryData = {
            callback: callbackName
        };
        window[callbackName] = param.callback;
        $.extend(queryData, param.data || {}, parseUrlQuery(param.url));

        var formId = 'my_form_KHJKHJ_' + new Date().getTime();
        var $form = createForm(queryData);

        $form.attr({
            action: param.url,
            method: param.method || 'get',
            target: frameId,
            id: formId
        });
        $(document.body).append($form);

        $frame.on('load', function() {
            var io = $frame[0];
            var xml = {};
            try {
                // 存在跨域脚本访问问题，如遇到‘无法访问’提示则需要在响应流中加一段脚块：<script ...>document.domain =
                // 'xxx.com';</script>
                if (io.contentWindow) { // 兼容各个浏览器，可取得子窗口的 window 对象
                    xml.responseText = io.contentWindow.document.body ? io.contentWindow.document.body.innerHTML : null;
                    xml.responseXML = io.contentWindow.document.XMLDocument ? io.contentWindow.document.XMLDocument : io.contentWindow.document;


                } else if (io.contentDocument) { // contentDocument Firefox 支持，> ie8
                    // 的ie支持。可取得子窗口的 document 对象。
                    xml.responseText = io.contentDocument.document.body ? io.contentDocument.document.body.innerHTML : null;
                    xml.responseXML = io.contentDocument.document.XMLDocument ? io.contentDocument.document.XMLDocument : io.contentDocument.document;
                }
                var respObj = redirectHttpData(xml, param.dataType || "htmlJson");
                respObj?param.callback(respObj):"";
            } catch (e) {
                console.log(e);
            }

        });

        $form[0].submit();
        $form.remove();
    };

    return redirectTo;

    function createForm(queryData) {
        var $form = $('<form></form>');
        $form.append(createInputHtml("mainHost", location.protocol + '//' + location.host));
        $form.append(createInputHtml("target", "frame"));
        $.each(queryData, function(key, value) {
            $form.append(createInputHtml(key, value));
        });
        return $form;
    }

    function createInputHtml(name, value) {
        var html = '<input type="hidden" name="$name" value="$value" />';
        return html.replace(/\$name/, name).replace(/\$value/, decodeURIComponent(value));
    }

    function parseUrlQuery(url) {
        var search = url.split('?')[1];
        if (!search) {
            return {};
        }
        var uri = search;
        var obj = {};
        $.each(uri.split('&'), function(i, v) {
            var arr = v.split('=');
            obj[arr[0]] = arr[1];
        });
        return obj;
    }

    function redirectHttpData(r, type) {
        var data = !type;
        data = type == "xml" || data ? r.responseXML : r.responseText;
        // If the type is "script", eval it in global context
        if (type == "script")
            globalEval(data);
        // Get the JavaScript object, if JSON is used.
        if (type == "json")
            eval("data = " + data);

        if (type == "htmlJson") {
            data = data.replace(/^\s+|\s+$/g, "").replace(/[\r\n]/g, "");
            if (typeof data == 'undefined' || data.length <= 0) {
                data = null;
            } else {
                data = data.replace(/<[^>]+>/g, "");
                eval("data = " + data);
            }
        }
        return data;
    }

    function globalEval(data) {
        if (data && rnotwhite.test(data)) {
            (window.execScript || function(data) {
                window["eval"].call(window, data);
            })(data);
        }
    }

});