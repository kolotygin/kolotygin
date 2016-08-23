var tweetsaver = tweetsaver || {};

// the semi-colon before function invocation is a safety net against concatenated 
// scripts and/or other plugins which may not be closed properly.
(function ($, window, document, undefined, ko) {
    "use strict";

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variables rather than globals
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    var ViewModel = this.ViewModel = function (options) {
        var me = this;

        me._options = options;
        me.availableTweets = ko.observableArray([]);
        me.selectedTweets = ko.observableArray([]);
        me.searchText = ko.observable("fine day");
        me.searching = ko.observable(false);
        me.searchable = ko.computed(function () {
            return $.trim(this.searchText()).length > 0;
        }, me);
        me.init();
    };

    ViewModel.prototype = {
        constructor: ViewModel,

        init: function () {
            var me = this,
                $searchButton = $(".ts-available-tweets-search-panel > a");

            $(".ts-available-tweets-search-panel > input").onEnter(function () { $searchButton.focus(); $searchButton[0].click(); }).focus();

            $(".ts-available-tweets").sortable({
                connectWith: "ul",
                receive: function (event, ui) {
                    var $element = ui.item,
                        tweet = ko.dataFor($element[0]),
                        index = $element.index();
                    $element.remove();
                    me.availableTweets.splice(index, 0, tweet);
                },
                remove: function (event, ui) {
                    var tweet = ko.dataFor(ui.item[0]);
                    me.availableTweets.remove(tweet);
                    var items = me.availableTweets();
                    me.availableTweets([]);
                    me.availableTweets(items);
                }
            });

            $(".ts-selected-tweets").sortable({
                connectWith: "ul",
                receive: function (event, ui) {
                    var $element = ui.item,
                        tweet = ko.dataFor($element[0]),
                        index = $element.index();
                    $element.remove();
                    me.selectedTweets.splice(index, 0, tweet);
                    localStorage.setObject("selected-tweets", me.selectedTweets());
                },
                remove: function (event, ui) {
                    var tweet = ko.dataFor(ui.item[0]);
                    me.selectedTweets.remove(tweet);
                    var items = me.selectedTweets();
                    me.selectedTweets([]);
                    me.selectedTweets(items);
                    localStorage.setObject("selected-tweets", me.selectedTweets());
                }
            });
            $(".ts-available-tweets li, .ts-selected-tweets li").disableSelection();

            var tweets = localStorage.getObject("selected-tweets");
            me.selectedTweets(tweets || []);

            me._controller = new Controller({ serviceUrl: "http://tweetsaver.herokuapp.com" });
            me.searchTweets();
        },

        _onGetTweets: function (data) {
            this.searching(false);
            // remove already selected tweets
            var selectedItems = this.selectedTweets();
            for (var i = 0, iSize = data.length; i < iSize; i++) {
                for (var j = 0, jSize = selectedItems.length; j < jSize; j++) {
                    if (data[i].id === selectedItems[j].id) {
                        data.splice(i, 1);
                        iSize--;
                        i--;
                    }
                }
            }
            this.availableTweets(data);
        },

        searchTweets: function () {
            var me = this;
            if (!me.searchable()) {
                return;
            }
            me.searching(true);
            var callback = $.proxy(me._onGetTweets, me);
            me._controller.getTweets(me.searchText(), 10, callback);
        }

    };

    this.initialize = function (selector, options) {
        $(document).ready(function () {
            var $element = $(selector),
                element = $element[0],
                model = new ViewModel(options);

            ko.bindingHandlers.showTweetDate = {
                update: function (element, valueAccessor, allBindingsAccessor, elementViewModel, bindingContext) {
                    // This will be called once when the binding is first applied to an element,
                    // and again whenever the associated observable changes value.
                    // Update the DOM element based on the supplied values here.
                    var date = new Date(elementViewModel.createdAt);
                    $(element).text(date.format("h:mmt dd-MM-yyyy")).attr("datetime", date.toLocaleTimeString());
                }
            };
            ko.applyBindings(model, element);
        });
    };

    var Controller = this.Controller = function (options) {
        this.options = options;
    };

    Controller.prototype = {
        constructor: Controller,

        _callGet: function (searchText, count, onLoadHandler, jsonpCallback) {
            var serviceSettings = {
                url: this.options.serviceUrl,
                dataType: "jsonp",
                data: { q: searchText, count: count },
                jsonpCallback: jsonpCallback,
                contentType: "application/json; charset=utf-8",
                type: "GET",
                async: true,
                success: onLoadHandler,
                error: function () { alert("Request failed."); }
            };
            $.ajax(serviceSettings);
        },

        getTweets: function (searchText, count, onGetDataCallback) {
            var handler = $.proxy(this._onGetTweets, this, onGetDataCallback);
            this._callGet(searchText, count, handler);
        },

        _onGetTweets: function (callback, data) {
            typeof callback === "function" && callback.apply(this, [data.tweets || []]);
        }

    };

}).apply(tweetsaver, [jQuery, window, document, undefined, ko]);


tweetsaver.initialize("#content");
