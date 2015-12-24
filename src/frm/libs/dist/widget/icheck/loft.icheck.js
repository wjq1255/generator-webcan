/**
 * 第三方checkbox组件<br/>
 *
 * @class loft.mobile.widget.icheck
 * @extends loft.mobile.widget
 */
(function($, undefined) {

    $.ui.define('icheck', {
        _data: {
            /**
             * 是否为radio模式(radio样式--圆形，非radio--勾)
             * @cfg {Boolean} checkradio=false
             */
            checkradio : false
        },

        _setup: function() {
            this.element = this.root();
            var type = this.element.attr('type');
            var className = type === 'checkbox' ? 'icheckbox' : 'iradio';
            this.$parent = this._data.checkradio === true ? this.element.wrap('<div class="' + 'icheckradio ' + className + '"></div>').parent() : this.element.wrap('<div class="' + className + '"></div>').parent();
            this.$helper = $('<ins class="icheck-helper"/>');
            this.$helper.appendTo(this.$parent);
            this._update();
            // this._delegateEvent();
        },

        _init:function(){
            eventHandler = $.proxy(this._delegateEvent, this);
            this.element.on('click tap', eventHandler).parent().parent().highlight('ui-state-hover');
        },
        _delegateEvent: function() {
            this.element.on(
                'change', $.proxy(this._onChange, this));

            this.$helper.on('click', $.proxy(this._onHelperClick, this));
        },

        _setOption: function(key, value) {
            this._super(key, value);

            if (key === 'disabled') {
                this.element.attr(key, value);
                this.$parent.toggleClass('disabled', value);
            }
        },

        _destroy: function() {
            this.$helper.remove();
            this.element.unwrap();
        },

        _update: function() {
            this.$parent[this.element.prop('checked') ? 'addClass' : 'removeClass']('checked');
        },

        _onChange: function() {
            var type = this.element.attr('type'),
                checked;

            

            if (type === 'radio') {
                this._offOtherCheck();
                checked = true;
            } else {
                checked = this.element.prop('checked');
                this.$parent.removeClass('indeterminate');
            }
            this.$parent.toggleClass('checked', checked);
        },

        _onHelperClick: function() {
            if (!this._data.disabled) {
                this._onChange();
            }
        },

        _offOtherCheck: function() {
            var that = this,
                $form,
                inputs;

            $form = this.element.closest('form');
            inputs = 'input[name="' + this.element.attr('name') + '"]';
            inputs = $form.length ? $form.find(inputs) : $(inputs);
            inputs.each(function() {
                if (this != that.element[0]) {
                    $(this).icheck('uncheck');
                }
            });
        },
        /**
         * 设置为选中状态
         * @method check
         */
        check: function() {
            var checked = this.element.prop('checked'),
                type = this.element.attr('type'),
                name = this.element.attr('name');

            if (!checked) {
                if (type === 'radio' && name) {
                    this._offOtherCheck();
                } else {
                    this.element.prop('indeterminate', false);
                }
                this.element.prop('checked', true);
            }

            this.$parent.removeClass('indeterminate').addClass('checked');
        },
        /**
         * 设置为不选中状态
         * @method  uncheck
         */
        uncheck: function() {
            var checked = this.element.prop('checked');

            if (checked) {
                this.element.prop('checked', false);
            }

            this.$parent.removeClass('checked').addClass('unchecked');
        },
        /**
         * 设置为不定态（icheck共有3种状态）
         * @method  indeterminate
         */
        indeterminate: function() {
            var indeterminate = this.element.prop('indeterminate');

            if (!indeterminate) {
                this.element.prop('indeterminate', true);
                this.element.prop('checked', false);
            }

            this.$parent.removeClass('checked').addClass('indeterminate');
        },
        /**
         * 取消不定状态（icheck共有3种状态）
         * @method  determinate
         */
        determinate: function() {
            var indeterminate = this.element.prop('indeterminate');

            if (indeterminate) {
                this.element.prop('indeterminate', false);
            }

            this.$parent.removeClass('indeterminate');
        },
        /**
         * 判断当前是否处于选中状态
         * @method  isChecked
         * @return {Boolean}
         */
        isChecked: function() {
            var checked = this.element.prop('checked');
            if (checked) {
                return true;
            }
            return false;
        },
        /**
         * 获取选中项的值
         * @method  getValue
         * @return {String}
         */
        getValue:function(){
            var name = this.element.attr('name');
            return $('input[name="'+name+'"]:checked ').val();
        }
    });
})(Zepto);
