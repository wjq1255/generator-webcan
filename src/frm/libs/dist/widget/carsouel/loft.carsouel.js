/**
 * Created by huangjc on 2015/9/1.
 */

(function($, undefined) {
    /**
     * 图片轮播组件,需从widget目录引入
     * @class loft.mobile.widget.carsouel
     * @extends loft.mobile.widget
     * <pre>
     *   $('#carsouel-demo').carsouel();
     * </pre>
     */
    $.ui.define('carsouel', {
        _data: {
            /**
             * 一屏展示图片数
             * @cfg {Number} viewNum=1
             */
            viewNum: 1,
            
            imgInit: 2,
            /**
             * 支持缩放
             * @cfg {Boolean} imgZoom=false
             */
            imgZoom: false,
            /**
             * 图片循环
             * @cfg {Boolean} loop=false
             */
            loop: false,
            /**
             * 防止事件冒泡--针对非IOS系统
             * @cfg {Boolean} stopPropagation=false
             */
            stopPropagation: false,
            springBackDis: 15,
            /**
             * 自动播放
             * @cfg {Boolean} autoPlay=true
             */
            autoPlay: true,
            /**
             * 自动播放间隔
             * @cfg {Number} autoPlayTime=4000
             */
            autoPlayTime: 4000,
            /**
             * 动画持续事件
             * @cfg {Number} animationTime=400
             */
            animationTime: 400,
            /**
             * 展示箭头
             * @cfg {Boolean} showArr=true
             */
            showArr: false,
            /**
             * 展示小圆点
             * @cfg {Boolean} showDot=true
             */
            showDot: true,
            /**
             * 触发页面slide事件
             * @cfg {Function} slide
             */
            slide: null,
            /**
             * 滑动结束触发事件
             * @cfg {Function} slideend
             */
            slideend: null,
            index: 0,
            _stepLength: 1,
            _direction: 1
        },

        _create: function() {
            var me = this,
                i = 0,
                j, k = [],
                content = me.data('content');
            me._initConfig();
            (me.root() || me.root($('<div></div>'))).addClass('ui-slider').appendTo(me.data('container') || (me.root().parent().length ? '' : document.body)).html(
                '<div class="ui-slider-wheel"><div class="ui-slider-group">' +
                (function() {
                    for (; j = content[i]; i++) k.push(me._itemRender(j));
                    k.push(me.data('loop') ? '</div><div class="ui-slider-group">' + k.join('') + '</div></div>' : '</div></div>');
                    return k.join('');
                }()));
            me._addDots();
        },

        _itemRender: function(item) {
            var data = this._data;
            if (data.itemRender) {
                return data.itemRender.call(this, item);
            }
            return '<div class="ui-slider-item">' +
                '<a href="' + item.href + '"><img lazyload="' + item.pic + '"/></a>' +
                (item.title ? '<p>' + item.title + '</p>' : '') + '</div>';
        },

        _setup: function(mode) {
            var me = this,
                root = me.root().addClass('ui-slider');
            me._initConfig();
            if (!mode) {
                var items = root.children(),
                    group = $('<div class="ui-slider-group"></div>').append(items.addClass('ui-slider-item'));
                root.empty().append($('<div class="ui-slider-wheel"></div>').append(group).append(me.data('loop') ? group.clone() : ''));
                me._addDots();
            } else me.data('loop') && $('.ui-slider-wheel', root).append($('.ui-slider-group', root).clone());
        },

        _init: function() {
            var me = this,
                index = me.data('index'),
                root = me.root(),
                _eventHandler = $.proxy(me._eventHandler, me);
            me._setWidth();
            $(me.data('wheel')).on('touchstart touchmove touchend touchcancel webkitTransitionEnd', _eventHandler);
            $(window).on('ortchange', _eventHandler);
            $('.ui-slider-pre', root).on('tap', function() {
                me.pre()
            });
            $('.ui-slider-next', root).on('tap', function() {
                me.next()
            });
            me.on('destroy', function() {
                clearTimeout(me.data('play'));
                $(window).off('ortchange', _eventHandler);
            });
            me.data('autoPlay') && me._setTimeout();
        },

        
        _initConfig: function() {
            var o = this._data;
            if (o.viewNum > 1) {
                o.loop = false;
                o.showDot = false;
                o.imgInit = o.viewNum + 1;
            }
        },

        
        _addDots: function() {
            var me = this,
                root = me.root(),
                length = $('.ui-slider-item', root).length / (me.data('loop') ? 2 : 1),
                html = [];
            if (me.data('showDot')) {
                html.push('<p class="ui-slider-dots">');
                while (length--) html.push('<b></b>');
                html.push('</p>');
            }
            me.data('showArr') && (html.push('<span class="ui-slider-pre"><b></b></span><span class="ui-slider-next"><b></b></span>'));
            root.append(html.join(''));
        },
        
        _setWidth: function() {
            var me = this,
                o = me._data,
                root = me.root(),
                width = Math.ceil(root.width() / o.viewNum),
                height = root.height(),
                loop = o.loop,
                items = $('.ui-slider-item', root).toArray(),
                length = items.length,
                wheel = $('.ui-slider-wheel', root).width(width)[0],
                dots = $('.ui-slider-dots b', root).toArray(),
                allImgs = $('img', root).toArray(),
                lazyImgs = allImgs.concat(),
                dotIndex = {},
                i, j,
                l = o.imgInit || length;
            o.showDot && (dots[0].className = 'ui-slider-dot-select');
            if (o.imgZoom) $(lazyImgs).on('load', function() {
                var h = this.height,
                    w = this.width,
                    min_h = Math.min(h, height),
                    min_w = Math.min(w, width);
                if (h / height > w / width) this.style.cssText += 'height:' + min_h + 'px;' + 'width:' + min_h / h * w + 'px;';
                else this.style.cssText += 'height:' + min_w / w * h + 'px;' + 'width:' + min_w + 'px';
                this.onload = null;
            });
            for (i = 0; i < length; i++) {
                items[i].style.cssText += 'width:' + width + 'px;position:absolute;-webkit-transform:translate3d(' + i * width + 'px,0,0);z-index:' + (900 - i);
                dotIndex[i] = loop ? (i > length / 2 - 1 ? i - length / 2 : i) : i;
                if (i < l) {
                    j = lazyImgs.shift();
                    j && (j.src = j.getAttribute('lazyload'));
                    if (o.loop) {
                        j = allImgs[i + length / 2];
                        j && (j.src = j.getAttribute('lazyload'));
                    }
                }
            }
            me.data({
                root: root[0],
                wheel: wheel,
                items: items,
                lazyImgs: lazyImgs,
                allImgs: allImgs,
                length: length,
                imgCountPerItem: allImgs.length / length,
                width: width,
                height: height,
                dots: dots,
                dotIndex: dotIndex,
                dot: dots[0]
            });
            return me;
        },

        
        _eventHandler: function(e) {
            var me = this;
            switch (e.type) {
                case 'touchmove':
                    me._touchMove(e);
                    break;
                case 'touchstart':
                    me._touchStart(e);
                    break;
                case 'touchcancel':
                case 'touchend':
                    me._touchEnd();
                    break;
                case 'webkitTransitionEnd':
                    me._transitionEnd();
                    break;
                case 'ortchange':
                    me._resize.call(me);
                    break;
            }
        },

        
        _touchStart: function(e) {
            var me = this;
            me.data({
                pageX: e.touches[0].pageX,
                pageY: e.touches[0].pageY,
                S: false, //isScrolling
                T: false, //isTested
                X: 0 //horizontal moved
            });
            me.data('wheel').style.webkitTransitionDuration = '0ms';
        },

        
        _touchMove: function(e) {
            var o = this._data,
                X = o.X = e.touches[0].pageX - o.pageX;
            if (!o.T) {
                var index = o.index,
                    length = o.length,
                    S = Math.abs(X) < Math.abs(e.touches[0].pageY - o.pageY);
                o.loop && (o.index = index > 0 && (index < length - 1) ? index : (index === length - 1) && X < 0 ? length / 2 - 1 : index === 0 && X > 0 ? length / 2 : index);
                S || clearTimeout(o.play);
                o.T = true;
                o.S = S;
            }
            if (!o.S) {
                o.stopPropagation && e.stopPropagation();
                e.preventDefault();
                o.wheel.style.webkitTransform = 'translate3d(' + (X - o.index * o.width) + 'px,0,0)';
            }
        },

        
        _touchEnd: function() {
            var me = this,
                o = me._data;
            if (!o.S) {
                var distance = o.springBackDis,
                    stepLength = o.X <= -distance ? Math.ceil(-o.X / o.width) : (o.X > distance) ? -Math.ceil(o.X / o.width) : 0;
                o._stepLength = Math.abs(stepLength);
                me._slide(o.index + stepLength);
            }
        },

        
        _slide: function(index, auto) {
            var me = this,
                o = me._data,
                length = o.length,
                end = length - o.viewNum + 1;
            if (-1 < index && index < end) {
                me._move(index);
            } else if (index >= end) {
                if (!o.loop) {
                    me._move(end - (auto ? 2 : 1));
                    o._direction = -1;
                } else {
                    o.wheel.style.cssText += '-webkit-transition:0ms;-webkit-transform:translate3d(-' + (length / 2 - 1) * o.width + 'px,0,0);';
                    o._direction = 1;
                    $.later(function() {
                        me._move(length / 2)
                    }, 20);
                }
            } else {
                if (!o.loop) me._move(auto ? 1 : 0);
                else {
                    o.wheel.style.cssText += '-webkit-transition:0ms;-webkit-transform:translate3d(-' + (length / 2) * o.width + 'px,0,0);';
                    $.later(function() {
                        me._move(length / 2 - 1)
                    }, 20);
                }
                o._direction = 1;
            }
            return me;
        },

        
        _move: function(index) {
            var o = this._data,
                dotIndex = o.dotIndex[index];
            this.trigger('slide', dotIndex);
            if (o.lazyImgs.length) {
                var j = o.allImgs[index];
                j && j.src || (j.src = j.getAttribute('lazyload'));
            }
            if (o.showDot) {
                o.dot.className = '';
                o.dots[dotIndex].className = 'ui-slider-dot-select';
                o.dot = o.dots[dotIndex];
            }
            o.index = index;
            o.wheel.style.cssText += '-webkit-transition:' + o.animationTime + 'ms;-webkit-transform:translate3d(-' + index * o.width + 'px,0,0);';
            this._setTimeout();
        },

        
        _transitionEnd: function() {
            var me = this,
                o = me._data;
            me.trigger('slideend', o.dotIndex[o.index]);
            if (o.lazyImgs.length) {
                for (var length = o._stepLength * o.imgCountPerItem, i = 0; i < length; i++) {
                    var j = o.lazyImgs.shift();
                    j && (j.src = j.getAttribute('lazyload'));
                    if (o.loop) {
                        j = o.allImgs[o.index + o.length / 2];
                        j && !j.src && (j.src = j.getAttribute('lazyload'));
                    }
                }
                o._stepLength = 1;
            }
        },

        
        _setTimeout: function() {
            var me = this,
                o = me._data;
            if (!o.autoPlay) return me;
            clearTimeout(o.play);
            o.play = $.later(function() {
                me._slide.call(me, o.index + o._direction, true);
            }, o.autoPlayTime);
            return me;
        },

        
        _resize: function() {
            var me = this,
                o = me._data,
                width = o.root.offsetWidth / o.viewNum, //todo 添加获取隐藏元素大小的方法
                length = o.length,
                items = o.items;
            if (!width) return me;
            o.width = width;
            clearTimeout(o.play);
            for (var i = 0; i < length; i++) items[i].style.cssText += 'width:' + width + 'px;-webkit-transform:translate3d(' + i * width + 'px,0,0);';
            o.wheel.style.removeProperty('-webkit-transition');
            o.wheel.style.cssText += 'width:' + width * length + 'px;-webkit-transform:translate3d(-' + o.index * width + 'px,0,0);';
            o._direction = 1;
            me._setTimeout();
            return me;
        },

        /**
         * 滚动到上一张
         * @method pre
         * @chainable
         * @return {Object} jQuery Object
         */
        pre: function() {
            var me = this;
            me._slide(me.data('index') - 1);
            return me;
        },

        /**
         * 滚动到下一张
         * @method next
         * @chainable
         * @return {Object} jQuery Object
         */
        next: function() {
            var me = this;
            me._slide(me.data('index') + 1);
            return me;
        },

        /**
         * 停止自动播放
         * @method stop
         * @chainable
         * @return {Object} jQuery Object
         */
        stop: function() {
            var me = this;
            clearTimeout(me.data('play'));
            me.data('autoPlay', false);
            return me;
        },

        /**
         * 恢复自动播放
         * @method resume
         * @chainable
         * @return {Object} jQuery Object
         */
        resume: function() {
            var me = this;
            me.data('_direction', 1);
            me.data('autoPlay', true);
            me._setTimeout();
            return me;
        }
    });
})(Zepto);
