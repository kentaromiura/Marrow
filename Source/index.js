var prime = require('prime'), $ = {}
var array = require('prime/shell/array')
var moofx = require('moofx')
var type = require('prime/type')
var ready = require('elements/domready')

/* nodes */
var $$ = require('elements')
require('elements/traversal')
require('elements/events')
require('elements/attributes')

// For JQ compat only, this breaks elements api coherency
// TODO: externalize this and make a new prime so it will not ovveride elements methods.
$$.implement({
    val : function(value){
        return this.value(value);
    },
    width: function(value){
        if(value) {
            moofx(this).style('width', value)
            return this
        }
        return moofx(this).compute('width')
    },
    get: function(index){
        if(!index) return this;
        if(index < 0){
            index = this.length + index;
        }
        return this[index];
    },
    parent: function(){
        var results = [];
        this.forEach(function(node){
            results.push(node.parentNode);
        })
        return $.$$(results);
    },
    html: function(html){
        if (html){
            this.forEach(function(node){node.innerHTML = html})
        } else {
            return (this[0] || {innerHTML:''}).innerHTML
        }

    },
    hide: function(){
        moofx(this).style({'display':'none'});
    },
    ///  other methods, not needed by bb.

    offset: function(obj){
        moofx(this).style(obj);
        return this;
    },
    css: function(obj){
        moofx(this).style(obj);
        return this;
    },
    attr: function(obj){
        if(type(obj) === 'string'){
            return this[0].getAttribute(obj)
        }
        for(var attr in obj){
            this.setAttribute(attr, obj[attr]);
        }
        return this;
    },
    "class": function(name){
        this.addClass(name);
        return this;
    },
    click: function(handler){
        if(handler){
            this.on('click', handler);
        }else{
            this.emit('click');
        }
        return this;
    },
    remove:function(){
        this.forEach(function(node){
            if(node.parentNode){
                node.parentNode.removeChild(node);
            }
        })
        return this;
    }
})

var div = document.createElement('div');
// nodes returns null, while jquery [];
var empty = function(){
    var empty = $$(div);
    delete empty['0'];
    empty.length = 0;
    return empty;
};

$.$$ = function(selector, context){
    var result = $$(selector, context);
    if(result && type(selector) === 'string'){
        result.selector = selector;

//        result.on = function(result, on){
//            return function ( event, selector, callback ){
//
//                var els = this.find(selector)
//                if(els) els.on(event.split('.')[0], callback);
//                //on.call(result, event.split('.')[0], selector, callback);
//            }
//        }(result, result.on);

        result.on = (function(result, on){
            return function(event, selector, callback){
                on.call( result.find(selector) || result, event.split('.')[0], callback )
            }
        })(result, result.on)
    }
    return result || empty();
}

/* agent */
$.agent = require('agent');

var sugar = prime({
    constructor: function(a, options){

        switch(type(a)){
            case 'array':
                var result = $.$$(a);
                if(result.length) return result;
                //not an element array :p

                return array(a);

            case 'string':
                if(!a || a === '#') return empty();
                if( a.charAt(0) == '<' && a.charAt(a.length-1) == '>' ){ //jQuery here also check if length >3 ???
                    //element creation via innerHTML
                    var element = document.createElement('div');
                    var results = [];

                    // fixes element autoclose.
                    element.innerHTML = a.replace(/<([^ /]+)[^>]*>/g,function(x, tagname){
                        div.innerHTML = x.replace('/>', '></' + tagname + '>');
                        var result = div.childNodes.length == 1 ? x.replace('/>', '></' + tagname + '>') : a;
                        div.innerHTML = '';
                        return result;
                    });

                    while(element.childNodes.length){
                        results.push(element.childNodes[0]);
                        element.removeChild(element.childNodes[0]);
                    }

                    results = $.$$(results)

                    for( var option in options){
                        var value = options[option];
                        if(type(value) == 'function'){
                            // it must be an event
                            results.on(option, value)
                        } else {
                            results[option](value)
                        }

                    }
                    return results;
                }



                return $.$$(a);
                break;
            case 'function':
                var wrapper = function(){
                    a.apply($, arguments)
                };
                ready(wrapper)
                break;
            default :
                return $.$$(a);
                break;
        }
    }
});

// sugar.implement($)
sugar.fn = sugar.prototype;

/* export namespace */
global.jQuery = sugar;

window.jQuery.ajax = function(params){
    var emulation = false;
    var data = params.data;

    /* agent doesn't support emulation (yet)
     if (Backbone.emulateJSON){
     emulation = true;
     data = data ? { model: data } : {};
     }
     */


    var req;
    if (data){
        req = new agent(params.type, params.url, data)
    } else {
        req = new agent(params.type, params.url)
    }

    req.header('Content-Type', params.contentType || 'application/json')


    if('headers' in params){
        for(var header in params.headers){
            req.header(header, params.headers[header])
        }
    }

    req.send(function(res){

        if(res.ok){
            (params.success || isNaN)(JSON.parse(res.text))
        }else{
            (params.failure || isNaN)(res)
        }
    })
};
