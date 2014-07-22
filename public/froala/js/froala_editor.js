/*!
 * froala_editor v1.1.7 (http://editor.froala.com)
 * Copyright 2014-2014 Froala
 */
if ("undefined" == typeof jQuery) throw new Error("Froala requires jQuery");
! function (a) {
    "use strict";
    var b = function (c, d) {
        this.options = a.extend({}, b.DEFAULTS, a(c).data(), "object" == typeof d && d), this.browser = b.browser(), this.disabledList = [], this._id = ++b.count, this.init(c), this.callback("initialized", [], !1)
    };
    b.count = 0, b.VALID_NODES = ["P", "PRE", "BLOCKQUOTE", "H1", "H2", "H3", "H4", "H5", "H6", "DIV", "LI", "TD"], b.LANGS = [], b.DEFAULTS = {
        allowedImageTypes: ["jpeg", "jpg", "png", "gif"],
        alwaysBlank: !1,
        alwaysVisible: !1,
        autosave: !1,
        autosaveInterval: 1e4,
        blockTags: ["n", "p", "blockquote", "pre", "h1", "h2", "h3", "h4", "h5", "h6"],
        borderColor: "#dddddd",
        buttons: ["bold", "italic", "underline", "strikeThrough", "fontSize", "fontFamily", "color", "sep", "align", "insertOrderedList", "insertUnorderedList", "outdent", "indent", "sep", "createLink", "insertImage", "insertVideo", "insertHorizontalRule"],
        crossDomain: !0,
        customButtons: {},
        customDropdowns: {},
        customText: !1,
        defaultImageWidth: 300,
        direction: "ltr",
        disableRightClick: !1,
        editorClass: "",
        enableScript: !1,
        fontList: ["Arial, Helvetica", "Impact, Charcoal", "Tahoma, Geneva", "Verdana, Geneva", "Times New Roman, Times"],
        height: "auto",
        icons: {},
        imageButtons: ["floatImageLeft", "floatImageNone", "floatImageRight", "linkImage", "replaceImage", "removeImage"],
        imageErrorCallback: !1,
        imageDeleteURL: null,
        imageDeleteParams: {},
        imageMargin: 10,
        imageMove: !0,
        imageResize: !0,
        imageLink: !0,
        imageUpload: !0,
        imageUploadParams: {},
        imageUploadParam: "file",
        imageUploadToS3: !1,
        imageUploadURL: "http://i.froala.com/upload",
        imagesLoadURL: "http://i.froala.com/images",
        imagesLoadParams: {},
        inlineMode: !0,
        initOnClick: !1,
        language: "en_us",
        linkList: [],
        linkText: !0,
        maxImageSize: 10485760,
        maxHeight: "auto",
        minHeight: "auto",
        noFollow: !0,
        paragraphy: !0,
        placeholder: "Type something",
        plainPaste: !1,
        preloaderSrc: "",
        saveURL: null,
        saveParams: {},
        saveRequestType: "POST",
        simpleAmpersand: !1,
        shortcuts: !0,
        spellcheck: !1,
        textNearImage: !0,
        theme: null,
        toolbarFixed: !0,
        trackScroll: !1,
        unlinkButton: !0,
        typingTimer: 200,
        width: "auto",
        zIndex: 1e3
    }, b.prototype.destroy = function () {
        this.sync(), this.isHTML && this.html(), this.$bttn_wrapper && (this.$bttn_wrapper.html("").remove(), this.$bttn_wrapper.html("").removeData()), this.$editor && (this.$editor.html("").remove(), this.$editor.html("").removeData()), this.$element.blur(), this.$image_editor && (this.$image_editor.html("").remove(), this.$image_editor.removeData()), this.$image_wrapper && (this.$image_wrapper.html("").remove(), this.$image_wrapper.removeData()), this.$link_wrapper && (this.$link_wrapper.html("").remove(), this.$link_wrapper.removeData()), this.$video_wrapper && (this.$video_wrapper.html("").remove(), this.$video_wrapper.removeData()), this.$popup_editor && (this.$popup_editor.html("").remove(), this.$popup_editor.removeData()), this.$overlay && (this.$overlay.html("").remove(), this.$overlay.removeData()), this.$image_modal && (this.hideMediaManager(), this.$image_modal.html("").remove(), this.$image_modal.removeData()), this.isLink ? this.$element.removeData("fa.editable") : (this.$element.replaceWith(this.getHTML()), this.$box && (this.$box.removeClass("froala-box"), this.$box.find(".html-switch").remove(), this.$box.removeData("fa.editable"), clearTimeout(this.typingTimer))), clearTimeout(this.ajaxInterval), clearTimeout(this.typingTimer), this.$element.off("mousedown mouseup click keydown keyup focus keypress touchstart touchend touch drop"), this.$element.off("mousedown mouseup click keydown keyup focus keypress touchstart touchend touch drop", "**"), a(window).off("mouseup." + this._id), a(window).off("keydown." + this._id), a(window).off("keyup." + this._id), a(window).off("hide." + this._id), a(window).off("scroll." + this._id), a(document).off("selectionchange." + this._id), void 0 !== this.$upload_frame && this.$upload_frame.remove(), this.$textarea && (this.$box.remove(), this.$textarea.removeData("fa.editable"), this.$textarea.show())
    }, b.prototype.callback = function (b, c, d) {
        void 0 === d && (d = !0);
        var e = b + "Callback",
            f = !0;
        return this.options[e] && a.isFunction(this.options[e]) && (f = c ? this.options[e].apply(this, c) : this.options[e].call(this)), d === !0 && this.sync(), void 0 === f ? !0 : f
    }, b.prototype.html5Compliant = function (a) {
        return a = a.replace(/<b>(((?!<\/b>)[\s\S])*)<\/b>/g, "<strong>$1</strong>"), a = a.replace(/<i>(((?!<\/i>)[\s\S])*)<\/i>/g, "<em>$1</em>")
    }, b.prototype.syncCleanHTML = function (a, b) {
        var c;
        if (b)
            for (c = a.replace(/<span((?!class\s*=\s*["']?f-marker["']?)[^>])*?><\/span>/gi, ""); a != c;) a = c, c = a.replace(/<span((?!class\s*=\s*["']?f-marker["']?)[^>])*?><\/span>/gi, "");
        else
            for (c = a.replace(/<span[^>]*?><\/span>/g, ""); a != c;) a = c, c = a.replace(/<span[^>]*?><\/span>/g, "");
        return a
    }, b.prototype.syncClean = function (b, c) {
        var d = "span:empty";
        c && (d = "span:empty:not(.f-marker)");
        for (var e = !1, f = function (b, c) {
            0 === c.attributes.length && (a(c).remove(), e = !1)
        }, g = b.find(d); g.length && e === !1;) e = !0, g.each(f), g = b.find(d)
    }, b.prototype.sync = function (a) {
        void 0 == a && (a = !0), !a || this.isResizing() || this.options.editInPopup || this.restoreSelectionByMarkers(), this.syncClean(this.$element), this.disableImageResize(), this.isLink || this.isImage || this.$element.trigger("placeholderCheck");
        var b = this.getHTML();
        this.trackHTML !== b && null != this.trackHTML ? (this.callback("contentChanged", [], !1), this.refreshImageList(), this.trackHTML = b) : null == this.trackHTML && (this.trackHTML = b), this.$textarea && this.$textarea.val(b), this.isResizing() || this.isLink || this.isImage || this.options.editInPopup || this.android() || this.$element.focus()
    }, b.prototype.emptyElement = function (b) {
        if ("IMG" == b.tagName || a(b).find("img").length > 0) return !1;
        if (a(b).find("input, iframe").length > 0) return !1;
        for (var c = a(b).text(), d = 0; d < c.length; d++)
            if ("\n" !== c[d] && "\r" !== c[d] && "	" !== c[d]) return !1;
        return !0
    }, b.prototype.continueInit = function () {
        this.isImage || this.isLink || (this.initUndoRedo(), this.enableTyping(), this.initShortcuts()), this.initEditor(), this.isLink || this.initDrag(), this.initOptions(), this.initEditorSelection(), this.initAjaxSaver(), (!this.isLink || this.isImage) && (this.initImageResizer(), this.initImagePopup()), this.initLink(), this.setLanguage(), this.setCustomText(), this.isImage || this.isLink || this.registerPaste(), this.$element.blur()
    }, b.prototype.init = function (b) {
        this.initElement(b), this.initElementStyle(), this.options.initOnClick ? (this.isLink || this.isImage || this.options.editInPopup || a(b).attr("contenteditable", !0), a(b).bind("mousedown", a.proxy(function () {
            a(b).unbind("mousedown"), this.saveSelectionByMarkers(), this.continueInit(), this.restoreSelectionByMarkers()
        }, this))) : this.continueInit()
    }, b.prototype.iOS = function () {
        return /(iPad|iPhone|iPod)/g.test(navigator.userAgent)
    }, b.prototype.iPad = function () {
        return /(iPad)/g.test(navigator.userAgent)
    }, b.prototype.iPhone = function () {
        return /(iPhone)/g.test(navigator.userAgent)
    }, b.prototype.iPod = function () {
        return /(iPod)/g.test(navigator.userAgent)
    }, b.prototype.android = function () {
        return /(Android)/g.test(navigator.userAgent)
    }, b.prototype.blackberry = function () {
        return /(Blackberry)/g.test(navigator.userAgent)
    }, b.prototype.initElement = function (b) {
        if ("TEXTAREA" == b.tagName) this.$textarea = a(b), void 0 !== this.$textarea.attr("placeholder") && "Type something" == this.options.placeholder && (this.options.placeholder = this.$textarea.attr("placeholder")), this.$element = a("<div>").html(this.$textarea.val()), this.$textarea.before(this.$element).hide(), this.$textarea.on("submit", a.proxy(function () {
            this.sync()
        }, this));
        else if ("A" == b.tagName) this.isLink = !0, this.selectionDisabled = !0, this.editableDisabled = !0, this.options.buttons = [], this.$element = a(b), this.options.paragraphy = !1;
        else if ("IMG" == b.tagName) {
            var c = (a(b).attr("class"), a(b).css("float"));
            "A" == a(b).parent().get(0).tagName && (b = a(b).parent()), this.isImage = !0, this.editableDisabled = !0, this.imageList = [], this.options.buttons = ["insertImage"], this.options.paragraphy = !1, this.options.imageMargin = "auto", a(b).wrap("<div>"), this.$element = a(b).parent(), this.$element.css("display", "inline-block"), this.$element.css("max-width", "100%"), this.$element.css("margin-left", "auto"), this.$element.css("margin-right", "auto"), this.$element.css("float", c), this.$element.addClass("f-image")
        } else this.options.editInPopup ? (this.$element = a(b), this.editableDisabled = !0, this.options.buttons = [], this.$element.on("click", a.proxy(function (a) {
            a.preventDefault(), a.stopPropagation(), this.showEditPopup()
        }, this))) : ("DIV" != b.tagName && this.options.buttons.indexOf("formatBlock") >= 0 && this.disabledList.push("formatBlock"), this.$element = a(b));
        this.isImage || this.isLink || this.options.editInPopup || (this.$box = this.$element, this.$element = a("<div>"), this.setHTML(this.$box.html(), !1), this.$box.html(this.$element).addClass("froala-box"), this.$element.on("keydown", a.proxy(function (b) {
            var c = b.which,
                d = ["PRE", "BLOCKQUOTE"],
                e = this.getSelectionElements()[0];
            if (13 == c && "" === this.text() && d.indexOf(e.tagName) >= 0)
                if (this.getSelectionTextInfo(e).atEnd && !b.shiftKey) {
                    b.preventDefault();
                    var f = a("<p><br></p>");
                    a(e).after(f), this.setSelection(f.get(0))
                } else(this.browser.webkit || this.browser.msie) && (b.preventDefault(), this.insertHTML(this.endsWith(a(e).html(), "<br>") || !this.getSelectionTextInfo(e).atEnd ? "<br>" : "<br><br>"))
        }, this)), this.$element.on("keyup", a.proxy(function (b) {
            var c = b.which;
            if (13 == c && "" === this.text() && this.browser.safari) {
                var d = a(this.getSelectionElement());
                if (d.parent("li").length) {
                    this.saveSelectionByMarkers(), d.before('<span id="li-before"></span>'), d.after('<span id="li-after"></span>');
                    var e = this.$element.html();
                    e = e.replace(/<span id=\"li-before\"><\/span>/g, "</li><li>"), e = e.replace(/<span id=\"li-after\"><\/span>/g, "</li>"), this.$element.html(e), this.restoreSelectionByMarkers()
                }
            }
            13 == c && this.webkitParagraphy()
        }, this))), this.$element.on("drop", a.proxy(function () {
            setTimeout(a.proxy(function () {
                a("html").click(), this.$element.find(".f-img-wrap").each(function (b, c) {
                    0 == a(c).find("img").length && a(c).remove()
                })
            }, this), 1)
        }, this)), this.sync()
    }, b.prototype.webkitParagraphy = function () {
        this.$element.find("*").each(a.proxy(function (b, c) {
            if (this.emptyElement(c) && "DIV" == c.tagName && this.options.paragraphy === !0) {
                var d = a("<p><br/></p>");
                a(c).replaceWith(d), this.setSelection(d.get(0))
            }
        }, this))
    }, b.prototype.trim = function (a) {
        return String(a).replace(/^\s+|\s+$/g, "")
    }, b.prototype.unwrapText = function () {
        this.options.paragraphy || this.$element.find("div").each(function (b, c) {
            void 0 === a(c).attr("style") && a(c).replaceWith(a(c).html() + "<br/>")
        })
    }, b.prototype.wrapText = function () {
        if (this.isImage || this.isLink) return !1;
        this.webkitParagraphy();
        var b = [],
            c = ["SPAN", "A", "B", "I", "EM", "U", "S", "STRONG", "STRIKE", "FONT"],
            d = this,
            e = function () {
                if (0 != b.length) {
                    var c;
                    c = a(d.options.paragraphy === !0 ? "<p>" : "<div>");
                    var e = a(b[0]);
                    if (1 == b.length && "f-marker" == e.attr("class")) return void(b = []);
                    for (var f = 0; f < b.length; f++) {
                        var g = a(b[f]);
                        c.append(g.clone()), f == b.length - 1 ? g.replaceWith(c) : g.remove()
                    }
                    b = []
                }
            };
        this.$element.contents().filter(function () {
            var d = a(this);
            this.nodeType == Node.TEXT_NODE && d.text().trim().length > 0 || c.indexOf(this.tagName) >= 0 ? b.push(this) : this.nodeType == Node.TEXT_NODE && 0 === d.text().trim().length ? d.remove() : e()
        }), e(), this.$element.find("> p, > div").each(function (b, c) {
            0 === a(c).text().trim().length && 0 === a(c).find("img").length && 0 === a(c).find("br").length && a(c).append("<br/>")
        }), this.$element.find("div:empty, > br").remove()
    }, b.prototype.setHTML = function (a, b) {
        void 0 === b && (b = !0), this.options.enableScript || (a = this.stripScript(a)), a = this.clean(a, !0, !1), this.$element.html(a), this.imageList = [], this.refreshImageList(), this.options.paragraphy && this.wrapText(), b === !0 && this.sync()
    }, b.prototype.registerPaste = function () {
        var b = this;
        this.$element.get(0).onpaste = function () {
            if (!b.isHTML) {
                if (b.callback("beforePaste", [], !1) !== !0) return !1;
                b.pasting = !0, b.saveSelection();
                var c, d = a(window).scrollTop();
                if (b.$pasteDiv) c = b.$pasteDiv;
                else var c = a('<div contenteditable="true" style="position: fixed; top: 0; left: -9999px; width: 0;"></div>').appendTo("body");
                c.focus(), window.setTimeout(function () {
                    var e = c.html();
                    c.remove(), a(window).scrollTop(d), b.restoreSelection(), b.insertHTML(b.options.plainPaste ? e.replace(/<(?!br\s*\/?)[^>]+>/g, "") : b.clean(e, !1, !0)), b.sync(), b.$element.trigger("placeholderCheck"), b.pasting = !1, b.callback("afterPaste")
                }, 1)
            }
        }
    }, b.prototype._extractContent = function (a) {
        for (var b, c = document.createDocumentFragment(); b = a.firstChild;) c.appendChild(b);
        return c
    }, b.prototype.clean = function (b, c, d) {
        var e = ["title", "href", "alt", "src", "style", "width", "height", "target", "rel", "name", "value", "type", "colspan", "rowspan"],
            f = [];
        c === !0 && (e.push("id"), e.push("class"));
        var g = this,
            h = a("<div>").html(b);
        return h.find("*").each(function (b, c) {
            var h = a(c);
            f.indexOf(c.tagName) >= 0 && h.html(h.text()), a.each(c.attributes, function () {
                void 0 !== this && e.indexOf(this.name) < 0 && 0 !== this.name.indexOf("data-") && h.removeAttr(this.name)
            }), d === !0 && h.removeAttr("style"), "A" == c.tagName && h.attr("href", g.sanitizeURL(h.attr("href")))
        }), this.cleanNewLine(h.html())
    }, b.prototype.cleanNewLine = function (a) {
        var b = new RegExp("\\n", "g");
        return a.replace(b, "")
    }, b.prototype.stripScript = function (a) {
        return this.options.enableScript ? a : a = a.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    }, b.prototype.initElementStyle = function () {
        this.editableDisabled || this.$element.attr("contenteditable", !0);
        var a = "froala-element " + this.options.editorClass;
        this.browser.msie && b.getIEversion() < 9 && (a += " ie8"), this.$element.css("outline", 0), this.browser.msie || (a += " not-msie"), this.$element.addClass(a)
    }, b.prototype.initUndoRedo = function () {
        (this.isEnabled("undo") || this.isEnabled("redo")) && (this.undoStack = [], this.undoIndex = 0, this.saveUndoStep()), this.disableBrowserUndo()
    }, b.prototype.enableTyping = function () {
        this.typingTimer = null, this.$element.on("keydown", a.proxy(function () {
            clearTimeout(this.typingTimer), this.ajaxSave = !1, this.oldHTML = this.$element.html(), this.typingTimer = setTimeout(a.proxy(function () {
                this.$element.html() != this.oldHTML && ((this.isEnabled("undo") || this.isEnabled("redo")) && this.$element.html() != this.undoStack[this.undoIndex - 1] && this.saveUndoStep(), this.sync())
            }, this), Math.max(this.options.typingTimer, 200))
        }, this))
    }, b.prototype.removeMarkersByRegex = function (a) {
        return a.replace(/<span[^>]*? class\s*=\s*["']?f-marker["']?[^>]+>[\S\s]*<\/span>/gi, "")
    }, b.prototype.getHTML = function (b) {
        if (this.isHTML) return this.$html_area.val();
        this.$element.find("a").addClass("f-link"), this.$element.find(".f-img-editor > img").each(function (b, c) {
            a(c).css("margin-left", a(c).parent().css("margin-left")).css("margin-right", a(c).parent().css("margin-right")).css("margin-bottom", a(c).parent().css("margin-bottom")).css("margin-top", a(c).parent().css("margin-top"))
        });
        var c = this.$element.html();
        return this.$element.find(".f-img-editor > img").css("margin", "auto"), c = this.html5Compliant(c), c = this.syncCleanHTML(c, b), c = c.replace(/\s*contenteditable="[^"]*"/gi, ""), c = c.replace(/<a[^>]*?><\/a>/g, ""), void 0 === b && (c = this.removeMarkersByRegex(c)), c = c.replace(/<span[^>]*? class\s*=\s*["']?f-img-handle[^>]+><\/span>/gi, ""), c = c.replace(/^([\S\s]*)<span[^>]*? class\s*=\s*["']?f-img-editor[^>]+>([\S\s]*)<\/span>([\S\s]*)$/gi, "$1$2$3"), this.isImage && (c = c.replace(/^([\S\s]*)<span[^>]*? class\s*=\s*["']?f-img-wrap[^>]+>([\S\s]*)<\/span>([\S\s]*)$/gi, "$1$2$3")), c = c.replace(/\&amp;/gi, "&"), this.options.simpleAmpersand && (c = c.replace(/\&amp;/gi, "&")), c.replace(/\u200B/gi, "")
    }, b.prototype.getText = function () {
        return this.$element.text()
    }, b.prototype.initAjaxSaver = function () {
        this.ajaxHTML = this.getHTML(), this.ajaxSave = !0, this.ajaxInterval = setInterval(a.proxy(function () {
            var a = this.getHTML();
            this.ajaxHTML != a && this.ajaxSave && (this.options.autosave && this.save(), this.ajaxHTML = a), this.ajaxSave = !0
        }, this), Math.max(this.options.autosaveInterval, 100))
    }, b.prototype.disableBrowserUndo = function () {
        a("body").keydown(function (a) {
            var b = a.which,
                c = a.ctrlKey || a.metaKey;
            if (!this.isHTML && c) {
                if (75 == b) return a.preventDefault(), !1;
                if (90 == b && a.shiftKey) return a.preventDefault(), !1;
                if (90 == b) return a.preventDefault(), !1
            }
        })
    }, b.prototype.saveUndoStep = function () {
        if (this.isEnabled("undo") || this.isEnabled("redo")) {
            for (; this.undoStack.length > this.undoIndex;) this.undoStack.pop();
            var a = this.getHTML(!0);
            if (this.undoStack[this.undoIndex - 1] && this.removeMarkersByRegex(this.undoStack[this.undoIndex - 1]) == a) return !1;
            this.selectionInEditor() && this.$element.is(":focus") && this.saveSelectionByMarkers(), this.undoStack.push(this.getHTML(!0)), this.undoIndex++, this.selectionInEditor() && this.$element.is(":focus") && this.restoreSelectionByMarkers(), this.refreshUndoRedo()
        }
    }, b.prototype.initShortcuts = function () {
        this.options.shortcuts && this.$element.on("keydown", a.proxy(function (a) {
            var b = a.which,
                c = a.ctrlKey || a.metaKey;
            if (!this.isHTML && c) {
                if (70 == b) return this.show(null), !1;
                if (66 == b) return this.execDefaultShortcut("bold");
                if (73 == b) return this.execDefaultShortcut("italic");
                if (85 == b) return this.execDefaultShortcut("underline");
                if (75 == b) return this.execDefaultShortcut("createLink");
                if (80 == b) return this.repositionEditor(), this.execDefaultShortcut("insertImage");
                if (65 == b) return this.execDefaultShortcut("selectAll");
                if (221 == b) return this.execDefaultShortcut("indent");
                if (219 == b) return this.execDefaultShortcut("outdent");
                if (72 == b) return this.execDefaultShortcut("html");
                if (48 == b) return this.execDefaultShortcut("formatBlock", "n");
                if (49 == b) return this.execDefaultShortcut("formatBlock", "h1");
                if (50 == b) return this.execDefaultShortcut("formatBlock", "h2");
                if (51 == b) return this.execDefaultShortcut("formatBlock", "h3");
                if (52 == b) return this.execDefaultShortcut("formatBlock", "h4");
                if (53 == b) return this.execDefaultShortcut("formatBlock", "h5");
                if (54 == b) return this.execDefaultShortcut("formatBlock", "h6");
                if (222 == b) return this.execDefaultShortcut("formatBlock", "blockquote");
                if (220 == b) return this.execDefaultShortcut("formatBlock", "pre");
                if (83 == b) return this.execDefaultShortcut("strikeThrough");
                if (90 == b && a.shiftKey) return this.redo(), a.stopPropagation(), !1;
                if (90 == b) return this.undo(), a.stopPropagation(), !1
            }
            9 != b || a.shiftKey ? 9 == b && a.shiftKey && a.preventDefault() : (a.preventDefault(), this.insertHTML("&nbsp;&nbsp;&nbsp;&nbsp;", !1))
        }, this))
    }, b.prototype.textEmpty = function (b) {
        return ("" === a(b).text() || b === this.$element.get(0)) && 0 === a(b).find("br").length
    }, b.prototype.focus = function (a) {
        if (void 0 == a && (a = !0), !this.isHTML && (a && this.$element.focus(), "" === this.text())) {
            var c, d, e = this.getSelectionElements();
            if (e.length >= 1 && e[0] != this.$element.get(0))
                for (var c = 0; c < e.length; c++)
                    if (d = e[c], !this.textEmpty(d)) return void this.setSelection(d);
            e = this.$element.find(b.VALID_NODES.join(","));
            for (var c = 0; c < e.length; c++)
                if (d = e[c], !this.textEmpty(d)) return void this.setSelection(d);
            this.setSelection(this.$element.get(0))
        }
    }, b.prototype.insertHTML = function (a, b) {
        this.isHTML || (this.$element.focus(), this.selectionInEditor() || this.setSelection(this.$element.get(0)));
        var c, d;
        if (window.getSelection) {
            if (c = window.getSelection(), c.getRangeAt && c.rangeCount) {
                d = c.getRangeAt(0), d.deleteContents();
                var e = document.createElement("div");
                e.innerHTML = a;
                for (var f, g, h = document.createDocumentFragment(); f = e.firstChild;) g = h.appendChild(f);
                var i = h.firstChild;
                d.insertNode(h), g && (d = d.cloneRange(), d.setStartAfter(g), b ? d.setStartBefore(i) : d.collapse(!0), c.removeAllRanges(), c.addRange(d))
            }
        } else if ((c = document.selection) && "Control" != c.type) {
            var j = c.createRange();
            j.collapse(!0), c.createRange().pasteHTML(a), b && (d = c.createRange(), d.setEndPoint("StartToStart", j), d.select())
        }
    }, b.prototype.execDefaultShortcut = function (a, b) {
        return this.isEnabled(a) ? (this.exec(a, b), !1) : !0
    }, b.prototype.initEditor = function () {
        var c = "froala-editor";
        this.isTouch() && (c += " touch"), this.browser.msie && b.getIEversion() < 9 && (c += " ie8"), this.$editor = a('<div class="' + c + '" style="display: none;">'), a("body").append(this.$editor), this.options.inlineMode ? this.initInlineEditor() : this.initBasicEditor()
    }, b.prototype.toolbarTop = function () {
        a(window).on("scroll resize", a.proxy(function () {
            this.options.toolbarFixed || this.options.inlineMode || (a(window).scrollTop() > this.$box.offset().top && a(window).scrollTop() < this.$box.offset().top + this.$box.height() ? (this.$editor.addClass("f-scroll"), this.$box.css("padding-top", this.$editor.height()), this.$editor.css("top", a(window).scrollTop() - this.$box.offset().top)) : a(window).scrollTop() < this.$box.offset().top && (this.$editor.removeClass("f-scroll"), this.$box.css("padding-top", ""), this.$editor.css("top", "")))
        }, this))
    }, b.prototype.initBasicEditor = function () {
        this.$element.addClass("f-basic"), this.$popup_editor = this.$editor.clone(), this.$popup_editor.appendTo(a("body")), this.$editor.addClass("f-basic").show(), this.$editor.insertBefore(this.$element), this.toolbarTop()
    }, b.prototype.initInlineEditor = function () {
        this.$popup_editor = this.$editor
    }, b.prototype.initDrag = function () {
        this.drag_support = {
            filereader: "undefined" != typeof FileReader,
            formdata: !!window.FormData,
            progress: "upload" in new XMLHttpRequest
        }
    }, b.prototype.initOptions = function () {
        this.setDimensions(), this.setBorderColor(), this.setPlaceholder(), this.setPlaceholderEvents(), this.setSpellcheck(), this.setImageUploadURL(), this.setButtons(), this.setDirection(), this.setTextNearImage(), this.setZIndex(), this.setTheme(), this.options.editInPopup && this.buildEditPopup()
    }, b.prototype.isTouch = function () {
        return WYSIWYGModernizr.touch && void 0 !== window.Touch
    }, b.prototype.initEditorSelection = function () {
        a(window).on("hide." + this._id, a.proxy(function () {
            this.isResizing() || this.hide(!1)
        }, this)), this.$element.on("mousedown touchstart", a.proxy(function () {
            this.isResizing() || (this.closeImageMode(), this.hide())
        }, this)), this.options.disableRightClick && this.$element.contextmenu(a.proxy(function (a) {
            return a.preventDefault(), this.options.inlineMode && this.$element.focus(), !1
        }, this)), this.$element.on("mouseup touchend", a.proxy(function (b) {
            if (!this.isResizing()) {
                var c = this.text();
                !("" !== c || this.options.alwaysVisible || this.options.editInPopup || (3 == b.which || 2 == b.button) && this.options.inlineMode && !this.isImage && this.options.disableRightClick) || this.link || this.imageMode ? this.options.inlineMode || (b.stopPropagation(), this.refreshButtons()) : (b.stopPropagation(), setTimeout(a.proxy(function () {
                    c = this.text(), !("" !== c || this.options.alwaysVisible || this.options.editInPopup || (3 == b.which || 2 == b.button) && this.options.inlineMode && !this.isImage && this.options.disableRightClick) || this.link || this.imageMode || this.show(b)
                }, this), 0)), this.imageMode = !1
            }
        }, this)), this.$element.on("mousedown", "img, a", a.proxy(function (a) {
            this.isResizing() || a.stopPropagation()
        }, this)), this.$element.on("mousedown touchstart", ".f-img-handle", a.proxy(function () {
            this.$element.attr("data-resize", !0)
        }, this)), this.$element.on("mouseup", ".f-img-handle", a.proxy(function (b) {
            var c = a(b.target).prevAll("img");
            setTimeout(a.proxy(function () {
                this.$element.removeAttr("data-resize"), c.click()
            }, this), 0)
        }, this)), this.$editor.on("mouseup", a.proxy(function (a) {
            this.isResizing() || (a.stopPropagation(), this.options.inlineMode === !1 && this.hide())
        }, this)), this.$editor.on("mousedown", ".fr-dropdown-menu", a.proxy(function (a) {
            a.stopPropagation(), this.noHide = !0
        }, this)), this.$popup_editor.on("mousedown", ".fr-dropdown-menu", a.proxy(function (a) {
            a.stopPropagation(), this.noHide = !0
        }, this)), this.$popup_editor.on("mouseup", a.proxy(function (a) {
            this.isResizing() || a.stopPropagation()
        }, this)), this.$link_wrapper && this.$link_wrapper.on("mouseup", a.proxy(function (a) {
            this.isResizing() || (a.stopPropagation(), this.$link_wrapper.trigger("hideLinkList"))
        }, this)), this.$edit_popup_wrapper && this.$edit_popup_wrapper.on("mouseup", a.proxy(function (a) {
            this.isResizing() || a.stopPropagation()
        }, this)), this.$image_wrapper && this.$image_wrapper.on("mouseup", a.proxy(function (a) {
            this.isResizing() || a.stopPropagation()
        }, this)), this.$video_wrapper && this.$video_wrapper.on("mouseup", a.proxy(function (a) {
            this.isResizing() || a.stopPropagation()
        }, this)), this.$overlay && this.$overlay.on("mouseup", a.proxy(function (a) {
            this.isResizing() || a.stopPropagation()
        }, this)), this.$image_modal && this.$image_modal.on("mouseup", a.proxy(function (a) {
            this.isResizing() || a.stopPropagation()
        }, this)), this.options.trackScroll && (a(window).bind("scroll." + this._id, a.proxy(function () {
            clearTimeout(this.scrollTimer), this.isScrolling = !0, this.scrollTimer = setTimeout(a.proxy(function () {
                this.isScrolling = !1
            }, this), 2500)
        }, this)), a(window).on("scroll", a.proxy(function () {
            a(window).trigger("scroll." + this._id)
        }, this))), a(window).on("mouseup." + this._id, a.proxy(function () {
            this.isResizing() || this.isScrolling || (this.$bttn_wrapper.find("button[data-cmd]").removeClass("active"), this.selectionInEditor() && "" !== this.text() && !this.isTouch() ? this.show(null) : this.$popup_editor.is(":visible") && (this.hide(), this.closeImageMode()))
        }, this)), a(window).on("mouseup", a.proxy(function () {
            a(window).trigger("window." + this._id)
        }, this)), a(document).on("selectionchange." + this._id, a.proxy(function (b) {
            this.isResizing() || this.isScrolling || (clearTimeout(this.selectionChangedTimeout), this.selectionChangedTimeout = setTimeout(a.proxy(function () {
                if (this.options.inlineMode && this.selectionInEditor() && this.link !== !0 && this.isTouch()) {
                    var a = this.text();
                    "" !== a ? (this.iPhone() || this.iPod() ? this.hide() : this.show(null), b.stopPropagation()) : (this.hide(), this.closeImageMode())
                }
            }, this), 75))
        }, this)), a(document).on("selectionchange", function (b) {
            a(document).trigger("selectionchange." + this._id, [b])
        }), a(window).bind("keydown." + this._id, a.proxy(function (b) {
            var c = b.which;
            if (this.imageMode) {
                if (13 == c) return this.$element.find(".f-img-editor").parents(".f-img-wrap").before("<br/>"), this.sync(), this.$element.find(".f-img-editor img").click(), !1;
                if (46 == c || 8 == c) return this.removeImage(this.$element.find(".f-img-editor")), !1
            }
            var d = this.getRange();
            if (d) {
                var e = a(d.startContainer);
                if (13 == c && e.hasClass("f-img-wrap")) {
                    var f = a("<p><br/></p>");
                    return 1 == d.startOffset ? e.closest(a.Editable.VALID_NODES.join(",")).after(f) : 0 == d.startOffset && e.closest(a.Editable.VALID_NODES.join(",")).before(f), this.setSelection(f.get(0)), this.sync(), !1
                }
                if (8 == c) {
                    var g = null;
                    if (e.hasClass("f-img-wrap") && 1 == d.startOffset) g = e;
                    else {
                        var h = a(d.startContainer.childNodes[d.startOffset]);
                        if (h.hasClass("f-img-wrap")) g = h;
                        else if (h.get(0) && "BR" == h.get(0).tagName) return h.remove(), !1
                    } if (g) return g.next().get(0) && "BR" == g.next().get(0).tagName ? g.remove() : g.replaceWith("<br/>"), !1
                }
            }!b.ctrlKey && this.$popup_editor.is(":visible") && (this.hide(), this.closeImageMode())
        }, this)), a(window).bind("keydown", function (b) {
            a(window).trigger("keydown." + this._id, [b])
        }), a(window).bind("keyup." + this._id, a.proxy(function () {
            this.selectionInEditor() && "" !== this.text() && this.repositionEditor()
        }, this)), a(window).bind("keyup", function (b) {
            a(window).trigger("keyup." + this._id, [b])
        })
    }, b.prototype.setTextNearImage = function (a) {
        void 0 !== a && (this.options.textNearImage = a), this.options.textNearImage === !0 ? this.$element.removeClass("f-tni") : this.$element.addClass("f-tni")
    }, b.prototype.setPlaceholder = function (a) {
        a && (this.options.placeholder = a), this.$textarea && this.$textarea.attr("placeholder", this.options.placeholder), this.$element.attr("data-placeholder", this.options.placeholder)
    }, b.prototype.isEmpty = function () {
        var a = this.$element.text().replace(/(\r\n|\n|\r|\t)/gm, "");
        return "" === a && 0 === this.$element.find("img, iframe, input").length && 0 === this.$element.find("p > br, div > br").length && 0 === this.$element.find("li, h1, h2, h3, h4, h5, h6, blockquote, pre").length
    }, b.prototype.fakeEmpty = function (a) {
        void 0 === a && (a = this.$element);
        var b = a.text().replace(/(\r\n|\n|\r|\t)/gm, "");
        return "" === b && 1 == a.find("p, div").length && 1 == a.find("p > br, div > br").length && 0 === a.find("img, table, iframe, input").length
    }, b.prototype.setPlaceholderEvents = function () {
        this.$element.on("focus", a.proxy(function () {
            "" == this.$element.text() && this.focus(!1)
        }, this)), this.$element.on("keyup keydown focus placeholderCheck", a.proxy(function () {
            if (this.pasting) return !1;
            if (this.options.editInPopup) return !1;
            if (!this.isHTML)
                if (!this.isEmpty() || this.fakeEmpty() || this.isHTML)!this.$element.find("p").length && this.options.paragraphy ? (this.wrapText(), this.$element.find("p, div").length && "" == this.text() ? this.setSelection(this.$element.find("p, div")[0], this.$element.find("p, div").text().length, null, this.$element.find("p, div").text().length) : this.$element.removeClass("f-placeholder")) : this.fakeEmpty() === !1 || this.$element.find(b.VALID_NODES.join(",")).length > 1 ? this.$element.removeClass("f-placeholder") : this.$element.addClass("f-placeholder");
                else {
                    var c, d = this.selectionInEditor() || this.$element.is(":focus");
                    this.options.paragraphy ? (c = a("<p><br/></p>"), this.$element.html(c), d && this.setSelection(c.get(0)), this.$element.addClass("f-placeholder")) : this.$element.addClass("f-placeholder")
                }
        }, this)), this.$element.trigger("placeholderCheck")
    }, b.prototype.setDimensions = function (a, b, c, d) {
        a && (this.options.height = a), b && (this.options.width = b), c && (this.options.minHeight = c), d && (this.options.maxHeight = d), "auto" != this.options.height && this.$element.css("height", this.options.height), "auto" != this.options.minHeight && this.$element.css("minHeight", this.options.minHeight), "auto" != this.options.maxHeight && this.$element.css("maxHeight", this.options.maxHeight), "auto" != this.options.width && this.$box.css("width", this.options.width)
    }, b.prototype.setDirection = function (a) {
        a && (this.options.direction = a), "ltr" != this.options.direction && "rtl" != this.options.direction && (this.options.direction = "ltr"), "rtl" == this.options.direction ? (this.$element.addClass("f-rtl"), this.$editor.addClass("f-rtl"), this.$popup_editor.addClass("f-rtl"), this.$image_modal && this.$image_modal.addClass("f-rtl")) : (this.$element.removeClass("f-rtl"), this.$editor.removeClass("f-rtl"), this.$popup_editor.removeClass("f-rtl"), this.$image_modal && this.$image_modal.removeClass("f-rtl"))
    }, b.prototype.setZIndex = function (a) {
        a && (this.options.zIndex = a), this.$editor.css("z-index", this.options.zIndex), this.$popup_editor.css("z-index", this.options.zIndex + 1), this.$overlay && this.$overlay.css("z-index", this.options.zIndex + 2), this.$image_modal && this.$image_modal.css("z-index", this.options.zIndex + 3)
    }, b.prototype.setTheme = function (a) {
        a && (this.options.theme = a), null != this.options.theme && (this.$editor.addClass(this.options.theme + "-theme"), this.$popup_editor.addClass(this.options.theme + "-theme"), this.$box && this.$box.addClass(this.options.theme + "-theme"), this.$image_modal && this.$image_modal.addClass(this.options.theme + "-theme"))
    }, b.prototype.setBorderColor = function (a) {
        a && (this.options.borderColor = a);
        var c = b.hexToRGB(this.options.borderColor);
        null !== c && (this.$editor.css("border-color", this.options.borderColor), this.$editor.attr("data-border-color", this.options.borderColor), this.$image_modal && this.$image_modal.find(".f-modal-wrapper").css("border-color", this.options.borderColor), this.options.inlineMode || this.$element.css("border-color", this.options.borderColor))
    }, b.prototype.setSpellcheck = function (a) {
        void 0 !== a && (this.options.spellcheck = a), this.$element.attr("spellcheck", this.options.spellcheck)
    }, b.prototype.customizeText = function (b) {
        if (b) {
            var c = this.$editor.find("[title]").add(this.$popup_editor.find("[title]"));
            this.$image_modal && (c = c.add(this.$image_modal.find("[title]"))), c.each(a.proxy(function (c, d) {
                for (var e in b) a(d).attr("title").toLowerCase() == e.toLowerCase() && a(d).attr("title", b[e])
            }, this)), c = this.$editor.find('[data-text="true"]').add(this.$popup_editor.find('[data-text="true"]')), this.$image_modal && (c = c.add(this.$image_modal.find('[data-text="true"]'))), c.each(a.proxy(function (c, d) {
                for (var e in b) a(d).text().toLowerCase() == e.toLowerCase() && a(d).text(b[e])
            }, this))
        }
    }, b.prototype.setLanguage = function (b) {
        void 0 !== b && (this.options.language = b), a.Editable.LANGS[this.options.language] && (this.customizeText(a.Editable.LANGS[this.options.language].translation), a.Editable.LANGS[this.options.language].direction && this.setDirection(a.Editable.LANGS[this.options.language].direction), a.Editable.LANGS[this.options.language].translation[this.options.placeholder] && this.setPlaceholder(a.Editable.LANGS[this.options.language].translation[this.options.placeholder]))
    }, b.prototype.setCustomText = function (a) {
        a && (this.options.customText = a), this.options.customText && this.customizeText(this.options.customText)
    }, b.prototype.execHTML = function () {
        this.html()
    }, b.prototype.initHTMLArea = function () {
        this.$html_area = a('<textarea wrap="hard">').keydown(function (b) {
            var c = b.keyCode || b.which;
            if (9 == c) {
                b.preventDefault();
                var d = a(this).get(0).selectionStart,
                    e = a(this).get(0).selectionEnd;
                a(this).val(a(this).val().substring(0, d) + "	" + a(this).val().substring(e)), a(this).get(0).selectionStart = a(this).get(0).selectionEnd = d + 1
            }
        })
    }, b.prototype.command_dispatcher = {
        align: function (a) {
            var b = this.buildDropdownAlign(a),
                c = this.buildDropdownButton(a, b, "fr-selector");
            this.$bttn_wrapper.append(c)
        },
        formatBlock: function (a) {
            var b = this.buildDropdownFormatBlock(a),
                c = this.buildDropdownButton(a, b);
            this.$bttn_wrapper.append(c)
        },
        createLink: function (a) {
            var b = this.buildDefaultButton(a);
            this.$bttn_wrapper.append(b)
        },
        insertImage: function (a) {
            var b = this.buildDefaultButton(a);
            this.$bttn_wrapper.append(b)
        },
        undo: function (a) {
            var b = this.buildDefaultButton(a);
            this.$bttn_wrapper.append(b)
        },
        redo: function (a) {
            var b = this.buildDefaultButton(a);
            this.$bttn_wrapper.append(b)
        },
        html: function (b) {
            var c = this.buildDefaultButton(b);
            this.$bttn_wrapper.append(c), this.options.inlineMode && this.$box.append(a(c).clone(!0).addClass("html-switch").attr("title", "Hide HTML").click(a.proxy(this.execHTML, this))), this.initHTMLArea()
        }
    }, b.prototype.setButtons = function (a) {
        a && (this.options.buttons = a), this.$editor.append('<div class="bttn-wrapper" id="bttn-wrapper-' + this._id + '">'), this.$bttn_wrapper = this.$editor.find("#bttn-wrapper-" + this._id), this.isTouch() && this.$bttn_wrapper.addClass("touch");
        for (var c, d, e = 0; e < this.options.buttons.length; e++) {
            var f = this.options.buttons[e];
            if ("sep" != f) {
                var g = b.commands[f];
                if (void 0 !== g) {
                    g.cmd = f;
                    var h = this.command_dispatcher[g.cmd];
                    h ? h.apply(this, [g]) : (g.seed ? (c = this.buildDefaultDropdown(g), d = this.buildDropdownButton(g, c)) : d = this.buildDefaultButton(g), this.$bttn_wrapper.append(d))
                } else {
                    if (g = this.options.customButtons[f], void 0 === g) {
                        if (g = this.options.customDropdowns[f], void 0 === g) continue;
                        d = this.buildCustomDropdown(g), this.$bttn_wrapper.append(d);
                        continue
                    }
                    d = this.buildCustomButton(g), this.$bttn_wrapper.append(d)
                }
            } else this.$bttn_wrapper.append(this.options.inlineMode ? '<div class="f-clear"></div><hr/>' : '<span class="f-sep"></span>')
        }
        this.$bttn_wrapper.find('button[data-cmd="undo"], button[data-cmd="redo"]').prop("disabled", !0), this.buildCreateLink(), this.buildInsertImage(), this.options.mediaManager && this.buildMediaManager(), this.bindButtonEvents()
    }, b.prototype.buildDefaultButton = function (a) {
        var b = '<button type="button" class="fr-bttn" title="' + a.title + '" data-cmd="' + a.cmd + '">';
        return b += void 0 == this.options.icons[a.cmd] ? this.addButtonIcon(a) : this.prepareIcon(this.options.icons[a.cmd], a.title), b += "</button>"
    }, b.prototype.prepareIcon = function (a, b) {
        switch (a.type) {
        case "font":
            return this.addButtonIcon({
                icon: a.value
            });
        case "img":
            return this.addButtonIcon({
                icon_img: a.value,
                title: b
            });
        case "txt":
            return this.addButtonIcon({
                icon_txt: a.value
            })
        }
    }, b.prototype.addButtonIcon = function (a) {
        return a.icon ? '<i class="' + a.icon + '"></i>' : a.icon_alt ? '<i class="for-text">' + a.icon_alt + "</i>" : a.icon_img ? '<img src="' + a.icon_img + '" alt="' + a.title + '"/>' : a.icon_txt ? "<i>" + a.icon_txt + "</i>" : a.title
    }, b.prototype.buildCustomButton = function (b) {
        var c = a('<button type="button" class="fr-bttn" title="' + b.title + '">' + this.prepareIcon(b.icon, b.title) + "</button>");
        return c.on("click touchend", a.proxy(function (a) {
            a.stopPropagation(), a.preventDefault(), b.callback(this)
        }, this)), c
    }, b.prototype.callDropdown = function (b, c, d) {
        b.on("click touch", a.proxy(function () {
            c.options[d].call(this)
        }, this))
    }, b.prototype.buildCustomDropdown = function (b) {
        var c = '<div class="fr-bttn fr-dropdown">';
        c += '<button type="button" class="fr-trigger" title="' + b.title + '">' + this.prepareIcon(b.icon, b.title) + "</button>";
        var d = a('<ul class="fr-dropdown-menu"></ul>');
        for (var e in b.options) {
            var f = a('<a href="#">' + e + "</a>"),
                g = a("<li>").append(f);
            this.callDropdown(f, b, e), d.append(g)
        }
        return a(c).append(d)
    }, b.prototype.buildDropdownButton = function (a, b, c) {
        c = c || "";
        var d = '<div class="fr-bttn fr-dropdown ' + c + '" data-name="' + a.cmd + '">',
            e = '<button type="button" class="fr-trigger" title="' + a.title + '">' + this.addButtonIcon(a) + "</button>";
        return d += e, d += b, d += "</div>"
    }, b.prototype.buildDropdownAlign = function (a) {
        for (var b = '<ul class="fr-dropdown-menu f-align">', c = 0; c < a.seed.length; c++) {
            var d = a.seed[c];
            b += '<li data-cmd="' + d.cmd + '" title="' + d.title + '"><a href="#"><i class="' + d.icon + '"></i></a></li>'
        }
        return b += "</ul>"
    }, b.prototype.buildDropdownFormatBlock = function (b) {
        for (var c = '<ul class="fr-dropdown-menu">', d = 0; d < b.seed.length; d++) {
            var e = b.seed[d];
            if (-1 != a.inArray(e.value, this.options.blockTags)) {
                var f = '<li data-cmd="' + b.cmd + '" data-val="' + e.value + '">';
                f += '<a href="#" data-text="true" class="format-' + e.value + '" title="' + e.title + '">' + e.title + "</a></li>", c += f
            }
        }
        return c += "</ul>"
    }, b.prototype.buildDefaultDropdown = function (a) {
        for (var b = '<ul class="fr-dropdown-menu">', c = 0; c < a.seed.length; c++) {
            var d = a.seed[c],
                e = '<li data-cmd="' + (d.cmd || a.cmd) + '" data-val="' + d.value + '" data-param="' + (d.param || a.param) + '">';
            e += '<a href="#" data-text="true" class="' + d.value + '" title="' + d.title + '">' + d.title + "</a></li>", b += e
        }
        return b += "</ul>"
    }, b.prototype.createEditPopupHTML = function () {
        var a = '<div class="froala-popup froala-text-popup">';
        return a += '<h4><span data-text="true">Edit text</span><i title="Cancel" class="fa fa-times" id="f-text-close-' + this._id + '"></i></h4></h4>', a += '<div class="f-popup-line"><input type="text" placeholder="http://www.example.com" class="f-lu" id="f-ti-' + this._id + '">', a += '<button data-text="true" type="button" class="f-ok" id="f-edit-popup-ok-' + this._id + '">OK</button>', a += "</div>", a += "</div>"
    }, b.prototype.buildEditPopup = function () {
        this.$edit_popup_wrapper = a(this.createEditPopupHTML()), this.$popup_editor.append(this.$edit_popup_wrapper), this.$edit_popup_wrapper.find("#f-ti-" + this._id).on("mouseup keydown", function (a) {
            a.stopPropagation()
        }), this.$edit_popup_wrapper.on("click", "#f-edit-popup-ok-" + this._id, a.proxy(function () {
            this.$element.text(this.$edit_popup_wrapper.find("#f-ti-" + this._id).val()), this.sync(), this.hide()
        }, this)), this.$edit_popup_wrapper.on("click", "i#f-text-close-" + this._id, a.proxy(function () {
            this.hide()
        }, this))
    }, b.prototype.createCORSRequest = function (a, b) {
        var c = new XMLHttpRequest;
        return "withCredentials" in c ? c.open(a, b, !0) : "undefined" != typeof XDomainRequest ? (c = new XDomainRequest, c.open(a, b)) : c = null, c
    }, b.prototype.getSelectionLinks = function () {
        var a, b, c, d, e = [];
        if (window.getSelection) {
            var f = window.getSelection();
            if (f.getRangeAt && f.rangeCount) {
                d = document.createRange();
                for (var g = 0; g < f.rangeCount; ++g)
                    if (a = f.getRangeAt(g), b = a.commonAncestorContainer, 1 != b.nodeType && (b = b.parentNode), "a" == b.nodeName.toLowerCase()) e.push(b);
                    else {
                        c = b.getElementsByTagName("a");
                        for (var h = 0; h < c.length; ++h) d.selectNodeContents(c[h]), d.compareBoundaryPoints(a.END_TO_START, a) < 1 && d.compareBoundaryPoints(a.START_TO_END, a) > -1 && e.push(c[h])
                    }
                d.detach()
            }
        } else if (document.selection && "Control" != document.selection.type)
            if (a = document.selection.createRange(), b = a.parentElement(), "a" == b.nodeName.toLowerCase()) e.push(b);
            else {
                c = b.getElementsByTagName("a"), d = document.body.createTextRange();
                for (var i = 0; i < c.length; ++i) d.moveToElementText(c[i]), d.compareEndPoints("StartToEnd", a) > -1 && d.compareEndPoints("EndToStart", a) < 1 && e.push(c[i])
            }
        return e
    }, b.prototype.isEnabled = function (b) {
        return a.inArray(b, this.options.buttons) >= 0
    }, b.prototype.bindButtonEvents = function () {
        this.bindDropdownEvents(), this.bindCommandEvents()
    }, b.prototype.canTouch = function (b) {
        var c = b.currentTarget;
        return "touchend" == b.type && a(c).data("touched", !0), "mouseup" == b.type && 1 != b.which ? !1 : "mouseup" == b.type && a(c).data("touched") ? !1 : !0
    }, b.prototype.bindDropdownEvents = function () {
        var b = this;
        this.$bttn_wrapper.on("mouseup touchend", ".fr-dropdown .fr-trigger", function (c) {
            return c.stopPropagation(), c.preventDefault(), b.canTouch(c) ? ("touchend" == c.type && b.android() && (b.saveSelectionByMarkers(), setTimeout(function () {
                b.restoreSelectionByMarkers()
            }, 10)), b.options.inlineMode === !1 && b.hide(), a(this).toggleClass("active").trigger("blur"), void b.$bttn_wrapper.find(".fr-dropdown").not(a(this).parent()).find(".fr-trigger").removeClass("active")) : !1
        }), a(window).on("mouseup selectionchange", a.proxy(function () {
            this.$bttn_wrapper.find(".fr-dropdown .fr-trigger").removeClass("active")
        }, this)), this.$element.on("mouseup", "img, a", a.proxy(function () {
            this.$bttn_wrapper.find(".fr-dropdown .fr-trigger").removeClass("active")
        }, this)), this.$bttn_wrapper.find(".fr-selector button.fr-bttn").bind("select", function () {
            a(this).parents(".fr-selector").find(" > button > i").attr("class", a(this).find("i").attr("class"))
        }).on("click touch", function () {
            a(this).parents("ul").find("button").removeClass("active"), a(this).parents(".fr-selector").removeClass("active").trigger("mouseout"), a(this).trigger("select")
        }), this.$bttn_wrapper.on("click", "li[data-cmd] > a", function (a) {
            a.preventDefault()
        })
    }, b.prototype.bindCommandEvents = function () {
        var b = this;
        this.$bttn_wrapper.on("mouseup touchend touchmove", "button[data-cmd], li[data-cmd], span[data-cmd]", a.proxy(function (c) {
            var d = c.currentTarget;
            if ("touchmove" != c.type) {
                if (c.stopPropagation(), c.preventDefault(), !this.canTouch(c)) return !1;
                if (a(d).data("dragging")) return a(d).removeData("dragging"), !1;
                var e = a(d).data("cmd"),
                    f = a(d).data("val"),
                    g = a(d).data("param");
                "touchend" == c.type && b.android() && this.saveSelectionByMarkers(), b.exec(e, f, g), b.$bttn_wrapper.find(".fr-dropdown .fr-trigger").removeClass("active"), "touchend" == c.type && b.android() && this.restoreSelectionByMarkers()
            } else a(d).data("dragging", !0)
        }, this))
    }, b.prototype._startInDefault = function (a, b) {
        this.$element.focus(), this.$bttn_wrapper.find('[data-cmd="' + a + '"]').toggleClass("active"), void 0 == b ? document.execCommand(a, !1, !1) : document.execCommand(a, !1, b)
    }, b.prototype._startInFontExec = function (a, b, c) {
        this.$element.focus(), this.insertHTML('<span data-inserted="true" data-font="' + b + '" style="' + a + ": " + c + '"></span>', !0);
        var d = this.$element.find("[data-inserted]");
        d.removeAttr("data-inserted"), this.setSelection(d.get(0))
    }, b.prototype.removeFormat = function () {
        document.execCommand("removeFormat", !1, !1), document.execCommand("unlink", !1, !1)
    }, b.prototype.undo = function () {
        if (this.undoIndex > 1) {
            var a = this.getHTML(),
                b = this.undoStack[--this.undoIndex - 1];
            this.$element.html(b), this.$element.focus(), this.restoreSelectionByMarkers(), this.callback("undo", [this.getHTML(), a]), "" != this.text() ? this.repositionEditor() : this.hide()
        }
        this.refreshUndoRedo(), this.focus()
    }, b.prototype.redo = function () {
        if (this.undoIndex < this.undoStack.length) {
            var a = this.$element.html(),
                b = this.undoStack[this.undoIndex++];
            this.$element.html(b), this.$element.focus(), this.restoreSelectionByMarkers(), this.callback("redo", [this.getHTML(), a]), "" != this.text() ? this.repositionEditor() : this.hide()
        }
        this.refreshUndoRedo(), this.focus()
    }, b.prototype.save = function () {
        if (this.callback("beforeSave", [], !1) !== !0) return !1;
        if (this.options.saveURL) {
            var b = {};
            for (var c in this.options.saveParams) {
                var d = this.options.saveParams[c];
                b[c] = "function" == typeof d ? d.call(this) : d
            }
            a.ajax({
                type: this.options.saveRequestType,
                url: this.options.saveURL,
                data: a.extend({
                    body: this.getHTML()
                }, this.options.saveParams)
            }).done(a.proxy(function (a) {
                this.callback("afterSave", [a])
            }, this)).fail(a.proxy(function () {
                this.callback("saveError", ["Save request failed on the server."])
            }, this))
        } else this.callback("saveError", ["Missing save URL."])
    }, b.prototype.sanitizeURL = function (a) {
        return this.options.enableScript ? a : /^https?:\/\//.test(a) ? String(a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;") : encodeURIComponent(a).replace(/%23/g, "#").replace(/%2F/g, "/").replace(/%25/g, "%").replace(/%3A/g, ":").replace(/%3F/g, "?").replace(/%3D/g, "=").replace(/%26/g, "&").replace(/%2C/g, ",").replace(/%3B/g, ";").replace(/%2B/g, "+").replace(/%40/g, "@")
    }, b.prototype.option = function (b, c) {
        if (void 0 === b) return this.options;
        if (b instanceof Object) this.options = a.extend({}, this.options, b), this.initOptions(), this.setCustomText(), this.setLanguage();
        else {
            if (void 0 === c) return this.options[b];
            switch (this.options[b] = c, b) {
            case "borderColor":
                this.setBorderColor();
                break;
            case "direction":
                this.setDirection();
                break;
            case "height":
            case "width":
            case "minHeight":
            case "maxHeight":
                this.setDimensions();
                break;
            case "spellcheck":
                this.setSpellcheck();
                break;
            case "placeholder":
                this.setPlaceholder();
                break;
            case "customText":
                this.setCustomText();
                break;
            case "language":
                this.setLanguage();
                break;
            case "textNearImage":
                this.setTextNearImage();
                break;
            case "zIndex":
                this.setZIndex();
                break;
            case "theme":
                this.setTheme()
            }
        }
    };
    var c = a.fn.editable;
    a.fn.editable = function (c) {
        for (var d = [], e = 0; e < arguments.length; e++) d.push(arguments[e]);
        if ("string" == typeof c) {
            var f = [];
            return this.each(function () {
                var b = a(this),
                    e = b.data("fa.editable");
                if (void 0 !== e) {
                    var g = e[c].apply(e, d.slice(1));
                    f.push(void 0 === g ? this : g)
                } else f.push(void 0)
            }), f
        }
        return this.each(function () {
            var d = this,
                e = a(d),
                f = e.data("fa.editable");
            f || e.data("fa.editable", f = new b(d, c))
        })
    }, a.fn.editable.Constructor = b, a.Editable = b, a.fn.editable.noConflict = function () {
        return a.fn.editable = c, this
    }
}(window.jQuery), $.Editable.commands = {
        bold: {
            title: "Bold",
            icon: "fa fa-bold",
            shortcut: "(Ctrl + B)"
        },
        italic: {
            title: "Italic",
            icon: "fa fa-italic",
            shortcut: "(Ctrl + I)"
        },
        underline: {
            cmd: "underline",
            title: "Underline",
            icon: "fa fa-underline",
            shortcut: "(Ctrl + U)"
        },
        strikeThrough: {
            title: "Strikethrough",
            icon: "fa fa-strikethrough"
        },
        formatBlock: {
            title: "Format Block",
            icon: "fa fa-paragraph",
            seed: [{
                value: "n",
                title: "Normal"
            }, {
                value: "p",
                title: "Paragraph"
            }, {
                value: "pre",
                title: "Code"
            }, {
                value: "blockquote",
                title: "Quote"
            }, {
                value: "h1",
                title: "Heading 1"
            }, {
                value: "h2",
                title: "Heading 2"
            }, {
                value: "h3",
                title: "Heading 3"
            }, {
                value: "h4",
                title: "Heading 4"
            }, {
                value: "h5",
                title: "Heading 5"
            }, {
                value: "h6",
                title: "Heading 6"
            }]
        },
        align: {
            title: "Alignment",
            icon: "fa fa-align-center",
            seed: [{
                cmd: "justifyLeft",
                title: "Align Left",
                icon: "fa fa-align-left"
            }, {
                cmd: "justifyCenter",
                title: "Align Center",
                icon: "fa fa-align-center"
            }, {
                cmd: "justifyRight",
                title: "Align Right",
                icon: "fa fa-align-right"
            }, {
                cmd: "justifyFull",
                title: "Justify",
                icon: "fa fa-align-justify"
            }]
        },
        insertOrderedList: {
            title: "Numbered List",
            icon: "fa fa-list-ol"
        },
        insertUnorderedList: {
            title: "Bulleted List",
            icon: "fa fa-list-ul"
        },
        outdent: {
            title: "Indent Less",
            icon: "fa fa-dedent",
            activeless: !0,
            shortcut: "(Ctrl + <)"
        },
        indent: {
            title: "Indent More",
            icon: "fa fa-indent",
            activeless: !0,
            shortcut: "(Ctrl + >)"
        },
        selectAll: {
            title: "Select All",
            icon: "fa fa-file-text",
            shortcut: "(Ctrl + A)"
        },
        createLink: {
            title: "Insert Link",
            icon: "fa fa-link",
            shortcut: "(Ctrl + K)"
        },
        insertImage: {
            title: "Insert Image",
            icon: "fa fa-picture-o",
            activeless: !0,
            shortcut: "(Ctrl + P)"
        },
        undo: {
            title: "Undo",
            icon: "fa fa-undo",
            activeless: !0,
            shortcut: "(Ctrl+Z)",
            disabled: function () {
                return !0
            }
        },
        redo: {
            title: "Redo",
            icon: "fa fa-repeat",
            activeless: !0,
            shortcut: "(Shift+Ctrl+Z)",
            disabled: function () {
                return !0
            }
        },
        html: {
            title: "Show HTML",
            icon: "fa fa-code"
        },
        save: {
            title: "Save",
            icon: "fa fa-floppy-o"
        },
        insertHorizontalRule: {
            title: "Insert Horizontal Line",
            icon: "fa fa-minus"
        }
    }, $.Editable.prototype.execCommand = {
        formatBlock: function (a, b) {
            this.formatBlock(b)
        },
        createLink: function () {
            this.insertLink()
        },
        insertImage: function () {
            this.insertImage()
        },
        indent: function () {
            this.indent()
        },
        outdent: function () {
            this.outdent(!0)
        },
        justifyLeft: function (a) {
            this.align(a)
        },
        justifyRight: function (a) {
            this.align(a)
        },
        justifyCenter: function (a) {
            this.align(a)
        },
        justifyFull: function (a) {
            this.align(a)
        },
        insertOrderedList: function (a) {
            this.formatList(a)
        },
        insertUnorderedList: function (a) {
            this.formatList(a)
        },
        undo: function () {
            this.undo()
        },
        redo: function () {
            this.redo()
        },
        html: function () {
            this.html()
        },
        save: function () {
            this.save()
        },
        selectAll: function (a, b) {
            this.$element.focus(), this.execDefault(a, b)
        },
        insertHorizontalRule: function (a, b) {
            this.execDefault(a, b), this.hide()
        }
    }, $.Editable.prototype.exec = function (a, b, c) {
        if (!this.selectionInEditor() && "html" !== a && "undo" !== a && "redo" !== a && "selectAll" !== a && "save" != a && "insertImage" !== a && "insertVideo" !== a && "insertTable" != a) return !1;
        if (this.selectionInEditor()) {
            if ("" === this.text()) {
                if ("bold" === a || "italic" === a || "underline" === a || "strikeThrough" == a) return this._startInDefault(a), !1;
                if ("fontSize" == a) return this._startInFontExec("font-size", a, b), !1;
                if ("fontFamily" == a) return this._startInFontExec("font-family", a, b), !1;
                if ("backColor" == a || "foreColor" == a) return this._startInDefault(a, b), !1
            }
            if ("" === this.text() && "insertHorizontalRule" != a && "fontSize" !== a && "formatBlock" !== a && "blockStyle" !== a && "indent" !== a && "outdent" !== a && "justifyLeft" !== a && "justifyRight" !== a && "justifyFull" !== a && "justifyCenter" !== a && "html" !== a && "undo" !== a && "redo" !== a && "selectAll" !== a && "save" !== a && "insertImage" !== a && "insertVideo" !== a && "insertOrderedList" !== a && "insertUnorderedList" !== a && "insertTable" != a && "insertRowAbove" != a && "insertRowBelow" != a && "deleteRow" != a && "insertColumnBefore" != a && "insertColumnAfter" != a && "deleteColumn" != a && "insertHeader" != a && "deleteHeader" != a && "insertCellBefore" != a && "insertCellAfter" != a && "deleteCell" != a && "mergeCells" != a && "splitHorizontal" != a && "splitVertical" != a && "deleteTable" != a) return !1
        }
        this.execCommand[a] ? this.execCommand[a].apply(this, [a, b, c]) : this.execDefault(a, b), "undo" != a && "redo" != a && "selectAll" != a && "createLink" != a && "insertImage" != a && "html" != a && "insertVideo" != a && this.saveUndoStep(), "createLink" != a && "insertImage" != a && this.refreshButtons()
    }, $.Editable.prototype.beautify = function (a) {
        return "undefined" != typeof html_beautify ? html_beautify(a) : a
    }, $.Editable.prototype.html = function () {
        var a;
        this.isHTML ? (this.isHTML = !1, a = this.options.enableScript ? this.$html_area.val() : this.stripScript(this.$html_area.val()), a = this.clean(a, !0, !1), this.$element.html(a).attr("contenteditable", !0), this.$box.removeClass("f-html"), this.$editor.find('.fr-bttn:not([data-cmd="html"]), .fr-trigger').prop("disabled", !1), this.$editor.find('.fr-bttn[data-cmd="html"]').removeClass("active"), this.saveUndoStep(), this.options.pragraphy && this.wrapText(), this.refreshButtons(), this.callback("htmlHide", [a]), this.focus()) : (this.$element.removeClass("f-placeholder"), a = this.options.inlineMode ? "\n\n" + this.beautify(this.getHTML()) : this.beautify(this.getHTML()), a = a.replace(/\&amp;/g, "&"), this.$html_area.val(a).trigger("resize"), this.options.inlineMode && this.$box.find(".html-switch").css("top", this.$box.css("padding-top")), this.$html_area.css("height", this.$element.height() + 20), this.$element.html(this.$html_area).removeAttr("contenteditable"), this.$box.addClass("f-html"), this.$editor.find('button.fr-bttn:not([data-cmd="html"]), button.fr-trigger').prop("disabled", !0), this.$editor.find('.fr-bttn[data-cmd="html"]').addClass("active"), this.options.inlineMode && this.hide(), this.isHTML = !0, this.$element.blur(), this.$element.removeAttr("contenteditable"), this.callback("htmlShow", [a]))
    }, $.Editable.prototype.formatBlock = function (a, b, c) {
        if (this.disabledList.indexOf("formatBlock") >= 0) return !1;
        if (this.browser.msie && $.Editable.getIEversion() < 9) return document.execCommand("formatBlock", !1, "<" + a + ">"), !1;
        this.saveSelectionByMarkers(), this.wrapText(), this.restoreSelectionByMarkers();
        var d = this.getSelectionElements();
        this.saveSelectionByMarkers();
        for (var e, f = 0; f < d.length; f++) {
            var g = $(d[f]);
            if (!this.fakeEmpty(g))
                if (e = "n" == a ? this.options.paragraphy ? $("<div>").html(g.html()) : g.html() + "<br/>" : $("<" + a + ">").html(g.html()), g.get(0) != this.$element.get(0) && "LI" != g.get(0).tagName && "TD" != g.get(0).tagName && "TH" != g.get(0).tagName) {
                    var h = g.prop("attributes");
                    if (e.attr)
                        for (var i = 0; i < h.length; i++) "class" !== h[i].name && e.attr(h[i].name, h[i].value);
                    var j;
                    this.options.blockStyles && this.options.blockStyles[a], void 0 === j && (j = this.options.defaultBlockStyle);
                    try {
                        if (g.hasClass(b)) e.addClass(g.attr("class")).removeClass(b);
                        else {
                            if (void 0 === g.attr("class") || void 0 === j || !this.options.blockStylesToggle && "toggle" != c) e.addClass(g.attr("class"));
                            else
                                for (var k = g.attr("class").split(" "), l = 0; l < k.length; l++) {
                                    var m = k[l];
                                    void 0 == j[m] && void 0 == c ? e.addClass(m) : void 0 != j[m] && "toggle" == c && e.addClass(m)
                                }
                            "*" != b && e.addClass(b)
                        }
                    } catch (n) {}
                    g.replaceWith(e)
                } else g.html(e)
        }
        this.unwrapText(), this.restoreSelectionByMarkers(), this.callback("formatBlock"), this.repositionEditor()
    }, $.Editable.prototype.formatList = function (a) {
        if (this.browser.msie && $.Editable.getIEversion() < 9) return document.execCommand(a, !1, !1), !1;
        this.saveSelectionByMarkers();
        for (var b, c = this.getSelectionElements(), d = !0, e = !1, f = 0; f < c.length; f++)
            if (b = $(c[f]), b.parents("li").length > 0 || "LI" == b.get(0).tagName) {
                var g;
                g = "LI" == b.get(0).tagName ? b : b.parents("li"), b.parents("ol").length > 0 ? (g.before('<span class="close-ol"></span>'), g.after('<span class="open-ol"></span>')) : b.parents("ul").length > 0 && (g.before('<span class="close-ul"></span>'), g.after('<span class="open-ul"></span>')), g.replaceWith(g.contents()), e = !0
            } else d = !1;
        if (e) {
            var h = this.$element.html();
            h = h.replace(new RegExp('<span class="close-ul"></span>', "g"), "</ul>"), h = h.replace(new RegExp('<span class="open-ul"></span>', "g"), "<ul>"), h = h.replace(new RegExp('<span class="close-ol"></span>', "g"), "</ol>"), h = h.replace(new RegExp('<span class="open-ol"></span>', "g"), "<ol>"), this.$element.html(h), this.$element.find("ul:empty, ol:empty").remove()
        }
        if (this.clearSelection(), d === !1) {
            this.wrapText(), this.restoreSelectionByMarkers(), c = this.getSelectionElements(), this.saveSelectionByMarkers();
            var i = $("<ol>");
            "insertUnorderedList" == a && (i = $("<ul>"));
            for (var j = 0; j < c.length; j++) b = $(c[j]), b.get(0) != this.$element.get(0) && (i.append($("<li>").append(b.clone())), j != c.length - 1 ? b.remove() : (b.replaceWith(i), i.find("li")));
            this.unwrapText()
        }
        this.restoreSelectionByMarkers(), this.repositionEditor(), this.callback(a)
    }, $.Editable.prototype.align = function (a) {
        if (this.browser.msie && $.Editable.getIEversion() < 9) return document.execCommand(a, !1, !1), !1;
        var b = this.getSelectionElements();
        "justifyLeft" == a ? a = "left" : "justifyRight" == a ? a = "right" : "justifyCenter" == a ? a = "center" : "justifyFull" == a && (a = "justify");
        for (var c = 0; c < b.length; c++) $(b[c]).css("text-align", a);
        this.repositionEditor(), this.callback("align", [a])
    }, $.Editable.prototype.indent = function (a) {
        if (this.browser.msie && $.Editable.getIEversion() < 9) return a ? document.execCommand("outdent", !1, !1) : document.execCommand("indent", !1, !1), !1;
        var b = 20;
        a && (b = -20), this.saveSelectionByMarkers(), this.wrapText(), this.restoreSelectionByMarkers();
        var c = this.getSelectionElements();
        this.saveSelectionByMarkers();
        for (var d = 0; d < c.length; d++) {
            var e = $(c[d]);
            if (e.parentsUntil(this.$element, "li").length > 0 && (e = e.parentsUntil(this.$element, "li")), e.get(0) != this.$element.get(0)) {
                var f = parseInt(e.css("margin-left").replace(/px/, ""), 10),
                    g = Math.max(0, f + b);
                e.css("marginLeft", g), "LI" === e.get(0).tagName && (g % 60 === 0 ? 0 === e.parents("ol").length ? e.css("list-style-type", "disc") : e.css("list-style-type", "decimal") : g % 40 === 0 ? 0 === e.parents("ol").length ? e.css("list-style-type", "square") : e.css("list-style-type", "lower-latin") : 0 === e.parents("ol").length ? e.css("list-style-type", "circle") : e.css("list-style-type", "lower-roman"))
            } else {
                var h = $("<div>").html(e.html());
                e.html(h), h.css("marginLeft", Math.max(0, b))
            }
        }
        this.unwrapText(), this.restoreSelectionByMarkers(), this.repositionEditor(), a || this.callback("indent")
    }, $.Editable.prototype.outdent = function () {
        this.indent(!0), this.callback("outdent")
    }, $.Editable.prototype.insertLink = function () {
        this.showInsertLink(), this.options.inlineMode || this.positionPopup("createLink"), this.saveSelection();
        var a = this.getSelectionLink() || "",
            b = this.getSelectionLinks();
        b.length > 0 ? this.$link_wrapper.find('input[type="checkbox"]').prop("checked", "_blank" == $(b[0]).attr("target")) : this.$link_wrapper.find('input[type="checkbox"]').prop("checked", this.options.alwaysBlank), this.$link_wrapper.find(".f-external-link").attr("href", a || "#"), this.$link_wrapper.find('input[type="text"]').val(a.replace(/\&amp;/g, "&") || "http://")
    }, $.Editable.prototype.insertImage = function () {
        this.showInsertImage(), this.saveSelection(), this.options.inlineMode || this.positionPopup("insertImage"), this.imageMode = !1, this.$image_wrapper.find('input[type="text"]').val("")
    }, $.Editable.prototype.execDefault = function (a, b) {
        document.execCommand(a, !1, b), "insertOrderedList" == a ? this.$bttn_wrapper.find('[data-cmd="insertUnorderedList"]').removeClass("active") : "insertUnorderedList" == a && this.$bttn_wrapper.find('[data-cmd="insertOrderedList"]').removeClass("active"), this.callback(a)
    }, $.Editable.prototype._events = {}, $.Editable.prototype.addListener = function (a, b) {
        var c = this._events,
            d = c[a] = c[a] || [];
        d.push(b)
    }, $.Editable.prototype.raiseEvent = function (a, b) {
        void 0 == b && (b = []);
        var c = this._events[a];
        if (c)
            for (var d = 0, e = c.length; e > d; d++) c[d].apply(this, b)
    }, $.Editable.prototype.isActive = function (a, b) {
        switch (a) {
        case "fontFamily":
            return this._isActiveFontFamily(b);
        case "fontSize":
            return this._isActiveFontSize(b);
        case "backColor":
            return this._isActiveBackColor(b);
        case "foreColor":
            return this._isActiveForeColor(b);
        case "formatBlock":
            return this._isActiveFormatBlock(b);
        case "blockStyle":
            return this._isActiveBlockStyle(b);
        case "createLink":
        case "insertImage":
            return !1;
        case "justifyLeft":
        case "justifyRight":
        case "justifyCenter":
        case "justifyFull":
            return this._isActiveAlign(a);
        case "html":
            return this._isActiveHTML();
        case "undo":
        case "redo":
        case "save":
            return !1;
        default:
            return this._isActiveDefault(a)
        }
    }, $.Editable.prototype._isActiveFontFamily = function (a) {
        var b = this.getSelectionElement();
        return $(b).css("fontFamily").replace(/ /g, "") === a.replace(/ /g, "") ? !0 : !1
    }, $.Editable.prototype._isActiveFontSize = function (a) {
        var b = this.getSelectionElement();
        return $(b).css("fontSize") === a ? !0 : !1
    }, $.Editable.prototype._isActiveBackColor = function (a) {
        for (var b = this.getSelectionElement(); $(b).get(0) != this.$element.get(0);) {
            if ($(b).css("background-color") === a) return !0;
            if ("transparent" != $(b).css("background-color") && "rgba(0, 0, 0, 0)" != $(b).css("background-color")) return !1;
            b = $(b).parent()
        }
        return !1
    }, $.Editable.prototype._isActiveForeColor = function (a) {
        return document.queryCommandValue("foreColor") === a ? !0 : !1
    }, $.Editable.prototype._isActiveFormatBlock = function (a) {
        "CODE" === a.toUpperCase() ? a = "PRE" : "N" === a.toUpperCase() && (a = "DIV");
        for (var b = $(this.getSelectionElement()); b.get(0) != this.$element.get(0);) {
            if (b.get(0).tagName == a.toUpperCase()) return !0;
            b = b.parent()
        }
        return !1
    }, $.Editable.prototype._isActiveBlockStyle = function (a) {
        for (var b = $(this.getSelectionElement()); b.get(0) != this.$element.get(0);) {
            if (b.hasClass(a)) return !0;
            b = b.parent()
        }
        return !1
    }, $.Editable.prototype._isActiveAlign = function (a) {
        var b = this.getSelectionElements();
        return "justifyLeft" == a ? a = "left" : "justifyRight" == a ? a = "right" : "justifyCenter" == a ? a = "center" : "justifyFull" == a && (a = "justify"), a == $(b[0]).css("text-align") ? !0 : !1
    }, $.Editable.prototype._isActiveHTML = function () {
        return this.isHTML ? !0 : !1
    }, $.Editable.prototype._isActiveDefault = function (a) {
        try {
            if (document.queryCommandState(a) === !0) return !0
        } catch (b) {}
        return !1
    }, $.Editable.prototype.refresh_disabled = ["createLink", "insertImage", "undo", "redo", "save"], $.Editable.prototype.refresh_dispatcher = {
        fontSize: function (a) {
            this.refreshFontSize(a)
        },
        fontFamily: function (a) {
            this.refreshFontFamily(a)
        },
        formatBlock: function (a) {
            this.refreshFormatBlock(a)
        },
        justifyLeft: function (a) {
            this.refreshAlign(a)
        },
        justifyRight: function (a) {
            this.refreshAlign(a)
        },
        justifyCenter: function (a) {
            this.refreshAlign(a)
        },
        justifyFull: function (a) {
            this.refreshAlign(a)
        },
        html: function (a) {
            this.isActive("html") ? $(a).addClass("active") : $(a).removeClass("active")
        }
    }, $.Editable.prototype.registerRefreshEvent = function (a, b) {
        this.refresh_dispatcher[a] = b
    }, $.Editable.prototype.refreshButtons = function () {
        if (!(this.selectionInEditor() && !this.isHTML || this.browser.msie && $.Editable.getIEversion() < 9)) return !1;
        this.$bttn_wrapper.find('[data-cmd="formatBlock"]').each($.proxy(function (a, b) {
            this.refreshFormatBlock(b)
        }, this));
        for (var a = 0; a < this.options.buttons.length; a++) {
            var b = this.options.buttons[a];
            void 0 != $.Editable.commands[b] && (void 0 != $.Editable.commands[b].disabled && $.Editable.commands[b].disabled.call(this) === !0 ? this.$editor.find('[data-name="' + b + '"]').attr("data-disabled", !0) : this.$editor.find('[data-name="' + b + '"]').removeAttr("data-disabled"))
        }
        this.refreshUndoRedo(), this.raiseEvent("refresh"), this.$bttn_wrapper.find("[data-cmd]").not('[data-cmd="formatBlock"]').each($.proxy(function (a, b) {
            var c = $(b).data("cmd");
            this.refresh_dispatcher[c] ? this.refresh_dispatcher[c].apply(this, [b]) : this.refreshDefault(b)
        }, this))
    }, $.Editable.prototype.refreshFormatBlock = function (a) {
        this.disabledList.indexOf("formatBlock") >= 0 && $(a).parents(".fr-dropdown").attr("data-disabled", !0), $(a).removeClass("active"), this.isActive($(a).data("cmd"), $(a).data("val")) && $(a).addClass("active")
    }, $.Editable.prototype.refreshUndoRedo = function () {
        if (this.isEnabled("undo") || this.isEnabled("redo")) {
            if (void 0 === this.$editor) return;
            this.$bttn_wrapper.find('[data-cmd="undo"], [data-cmd="redo"]').prop("disabled", !1), (0 === this.undoStack.length || this.undoIndex <= 1 || this.isHTML) && this.$bttn_wrapper.find('[data-cmd="undo"]').prop("disabled", !0), (this.undoIndex == this.undoStack.length || this.isHTML) && this.$bttn_wrapper.find('[data-cmd="redo"]').prop("disabled", !0)
        }
    }, $.Editable.prototype.refreshDefault = function (a) {
        $(a).removeClass("active"), this.isActive($(a).data("cmd")) && $(a).addClass("active")
    }, $.Editable.prototype.refreshAlign = function (a) {
        var b = $(a).data("cmd");
        this.isActive(b) && ($(a).parents("ul").find("li").removeClass("active"), $(a).addClass("active"), $(a).parents(".fr-dropdown").find(".fr-trigger i").attr("class", $(a).find("i").attr("class")))
    }, $.Editable.prototype.refreshForeColor = function (a) {
        $(a).removeClass("active"), this.isActive("foreColor", a.style.backgroundColor) && $(a).addClass("active")
    }, $.Editable.prototype.refreshBackColor = function (a) {
        $(a).removeClass("active"), this.isActive("backColor", a.style.backgroundColor) && $(a).addClass("active")
    }, $.Editable.prototype.refreshFontSize = function (a) {
        $(a).removeClass("active"), this.isActive("fontSize", $(a).data("val")) && $(a).addClass("active")
    }, $.Editable.prototype.refreshFontFamily = function (a) {
        $(a).removeClass("active"), this.isActive("fontFamily", $(a).data("val")) && $(a).addClass("active")
    }, $.Editable.prototype.text = function () {
        var a = "";
        return window.getSelection ? a = window.getSelection() : document.getSelection ? a = document.getSelection() : document.selection && (a = document.selection.createRange().text), a.toString()
    }, $.Editable.prototype.selectionInEditor = function () {
        var a = this.getSelectionParent(),
            b = !1;
        return a == this.$element.get(0) && (b = !0), b === !1 && $(a).parents().each($.proxy(function (a, c) {
            c == this.$element.get(0) && (b = !0)
        }, this)), b
    }, $.Editable.prototype.getSelection = function () {
        var a = "";
        return a = window.getSelection ? window.getSelection() : document.getSelection ? document.getSelection() : document.selection.createRange()
    }, $.Editable.prototype.getRange = function () {
        var a = this.getRanges();
        return a.length > 0 ? a[0] : null
    }, $.Editable.prototype.getRanges = function () {
        var a = this.getSelection();
        if (a.getRangeAt && a.rangeCount) {
            for (var b = [], c = 0; c < a.rangeCount; c++) b.push(a.getRangeAt(c));
            return b
        }
        return document.createRange ? [document.createRange()] : []
    }, $.Editable.prototype.clearSelection = function () {
        window.getSelection ? window.getSelection().empty ? window.getSelection().empty() : window.getSelection().removeAllRanges && window.getSelection().removeAllRanges() : document.selection && document.selection.empty()
    }, $.Editable.prototype.getSelectionElement = function () {
        var a = this.getSelection();
        if (a.rangeCount) {
            var b = a.getRangeAt(0).startContainer;
            1 != b.nodeType && (b = b.parentNode), $(b).children().length > 0 && $($(b).children()[0]).text() == this.text() && (b = $(b).children()[0]);
            for (var c = b;
                "BODY" != c.tagName;) {
                if (c == this.$element.get(0)) return b;
                c = $(c).parent()[0]
            }
        }
        return this.$element.get(0)
    }, $.Editable.prototype.getSelectionParent = function () {
        var a, b = null;
        return window.getSelection ? (a = window.getSelection(), a.rangeCount && (b = a.getRangeAt(0).commonAncestorContainer, 1 != b.nodeType && (b = b.parentNode))) : (a = document.selection) && "Control" != a.type && (b = a.createRange().parentElement()), null != b && ($.inArray(this.$element.get(0), $(b).parents()) >= 0 || b == this.$element.get(0)) ? b : null
    }, $.Editable.prototype.nodeInRange = function (a, b) {
        var c;
        if (a.intersectsNode) return a.intersectsNode(b);
        c = b.ownerDocument.createRange();
        try {
            c.selectNode(b)
        } catch (d) {
            c.selectNodeContents(b)
        }
        return -1 == a.compareBoundaryPoints(Range.END_TO_START, c) && 1 == a.compareBoundaryPoints(Range.START_TO_END, c)
    }, $.Editable.prototype.getElementFromNode = function (a) {
        for (1 != a.nodeType && (a = a.parentNode); null !== a && $.Editable.VALID_NODES.indexOf(a.tagName) < 0;) a = a.parentNode;
        return null != a && "LI" == a.tagName && $(a).find($.Editable.VALID_NODES.join()).length > 0 ? null : $.makeArray($(a).parents()).indexOf(this.$element.get(0)) >= 0 ? a : null
    }, $.Editable.prototype.nextNode = function (a) {
        if (a.hasChildNodes()) return a.firstChild;
        for (; a && !a.nextSibling;) a = a.parentNode;
        return a ? a.nextSibling : null
    }, $.Editable.prototype.getRangeSelectedNodes = function (a) {
        var b = a.startContainer,
            c = a.endContainer;
        if (b == c) return [b];
        for (var d = []; b && b != c;) d.push(b = this.nextNode(b));
        for (b = a.startContainer; b && b != a.commonAncestorContainer;) d.unshift(b), b = b.parentNode;
        return d
    }, $.Editable.prototype.getSelectedNodes = function () {
        if (window.getSelection) {
            var a = window.getSelection();
            if (!a.isCollapsed) return this.getRangeSelectedNodes(a.getRangeAt(0));
            if (this.selectionInEditor()) {
                var b = a.getRangeAt(0).startContainer;
                return 3 == b.nodeType ? [b.parentNode] : [b]
            }
        }
        return []
    }, $.Editable.prototype.getSelectionElements = function () {
        var a = this.getSelectedNodes(),
            b = [];
        return $.each(a, $.proxy(function (a, c) {
            if (null !== c) {
                var d = this.getElementFromNode(c);
                b.indexOf(d) < 0 && d != this.$element.get(0) && null !== d && b.push(d)
            }
        }, this)), 0 === b.length && b.push(this.$element.get(0)), b
    }, $.Editable.prototype.getSelectionCells = function () {
        var a = [];
        if (this.browser.webkit)
            for (var b = this.getSelectionElements(), c = 0; c < b.length; c++) "TD" == b[c].tagName && a.push(b[c]);
        else
            for (var d = this.getRanges(), c = 0; c < d.length; c++) {
                var e = d[c];
                if ("TD" == e.startContainer.tagName || "TH" == e.startContainer.tagName) a.push(e.startContainer);
                else {
                    var f = e.startContainer.childNodes,
                        g = e.startOffset;
                    if (f.length > g && g >= 0) {
                        var h = f[g];
                        ("TD" == h.tagName || "TH" == h.tagName) && a.push(h)
                    }
                }
            }
        return a
    }, $.Editable.prototype.getSelectionLink = function () {
        var a, b = null;
        return window.getSelection ? (a = window.getSelection(), b = 1 !== a.anchorNode.nodeType ? a.anchorNode.parentNode.parentNode.href : a.anchorNode.parentNode.href) : (a = document.selection) && "Control" != a.type && (b = a.createRange().parentElement().href), void 0 === b ? null : b
    }, $.Editable.prototype.saveSelection = function () {
        if (!this.selectionDisabled) {
            var a, b, c, d = this.getSelection();
            if (d.getRangeAt && d.rangeCount) {
                for (c = [], a = 0, b = d.rangeCount; b > a; a += 1) c.push(d.getRangeAt(a));
                this.savedRanges = c
            } else this.savedRanges = null
        }
    }, $.Editable.prototype.restoreSelection = function () {
        if (!this.selectionDisabled) {
            var a, b, c = this.getSelection();
            if (this.savedRanges)
                for (c.removeAllRanges(), a = 0, b = this.savedRanges.length; b > a; a += 1) c.addRange(this.savedRanges[a])
        }
    }, $.Editable.prototype.saveSelectionByMarkers = function () {
        if (!this.selectionDisabled) {
            var a = this.getRanges();
            this.removeMarkers();
            for (var b = 0; b < a.length; b++) this.placeMarker(a[b], !0, b), this.placeMarker(a[b], !1, b)
        }
    }, $.Editable.prototype.restoreSelectionByMarkers = function () {
        if (!this.selectionDisabled) {
            var a = this.$element.find('.f-marker[data-type="true"]');
            if (a.length > 0) {
                var b = this.getSelection();
                this.$element.focus(), this.clearSelection()
            }
            for (var c = 0; c < a.length; c++) {
                var d = $(a[c]).data("id"),
                    e = a[c],
                    f = this.$element.find('.f-marker[data-type="false"][data-id="' + d + '"]');
                if (f.length > 0) {
                    f = f[0];
                    var g = document.createRange();
                    g.setStartAfter(e), g.setEndBefore(f), b.addRange(g)
                }
            }
            a.length > 0 && (this.editableDisabled || this.isHTML || this.options.editInPopup || this.$element.attr("contenteditable", !0), this.removeMarkers())
        }
    }, $.Editable.prototype.setSelection = function (a, b, c, d) {
        var e = this.getSelection();
        if (e) {
            this.clearSelection();
            try {
                c || (c = a), void 0 === b && (b = 0), void 0 == d && (d = b);
                var f = this.getRange();
                f.setStart(a, b), f.setEnd(c, d), e.addRange(f)
            } catch (g) {}
        }
    }, $.Editable.prototype.placeMarker = function (a, b, c) {
        try {
            var d = a.cloneRange();
            d.collapse(b), d.insertNode($('<span class="f-marker" data-type="' + b + '" data-id="' + c + '">', document)[0]), d.detach()
        } catch (e) {}
    }, $.Editable.prototype.removeMarkers = function () {
        this.$element.find(".f-marker").remove()
    }, $.Editable.prototype.getSelectionTextInfo = function (a) {
        var b, c, d = !1,
            e = !1;
        if (window.getSelection) {
            var f = window.getSelection();
            f.rangeCount && (b = f.getRangeAt(0), c = b.cloneRange(), c.selectNodeContents(a), c.setEnd(b.startContainer, b.startOffset), d = "" === c.toString(), c.selectNodeContents(a), c.setStart(b.endContainer, b.endOffset), e = "" === c.toString())
        } else document.selection && "Control" != document.selection.type && (b = document.selection.createRange(), c = b.duplicate(), c.moveToElementText(a), c.setEndPoint("EndToStart", b), d = "" === c.text, c.moveToElementText(a), c.setEndPoint("StartToEnd", b), e = "" === c.text);
        return {
            atStart: d,
            atEnd: e
        }
    }, $.Editable.prototype.endsWith = function (a, b) {
        return -1 !== a.indexOf(b, a.length - b.length)
    }, $.Editable.hexToRGB = function (a) {
        var b = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        a = a.replace(b, function (a, b, c, d) {
            return b + b + c + c + d + d
        });
        var c = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(a);
        return c ? {
            r: parseInt(c[1], 16),
            g: parseInt(c[2], 16),
            b: parseInt(c[3], 16)
        } : null
    }, $.Editable.hexToRGBString = function (a) {
        var b = this.hexToRGB(a);
        return "rgb(" + b.r + ", " + b.g + ", " + b.b + ")"
    }, $.Editable.getIEversion = function () {
        var a, b, c = -1;
        return "Microsoft Internet Explorer" == navigator.appName ? (a = navigator.userAgent, b = new RegExp("MSIE ([0-9]{1,}[\\.0-9]{0,})"), null !== b.exec(a) && (c = parseFloat(RegExp.$1))) : "Netscape" == navigator.appName && (a = navigator.userAgent, b = new RegExp("Trident/.*rv:([0-9]{1,}[\\.0-9]{0,})"), null !== b.exec(a) && (c = parseFloat(RegExp.$1))), c
    }, $.Editable.browser = function () {
        var a = {};
        if ($.Editable.getIEversion() > 0) a.msie = !0;
        else {
            var b = navigator.userAgent.toLowerCase(),
                c = /(chrome)[ \/]([\w.]+)/.exec(b) || /(webkit)[ \/]([\w.]+)/.exec(b) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(b) || /(msie) ([\w.]+)/.exec(b) || b.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(b) || [],
                d = {
                    browser: c[1] || "",
                    version: c[2] || "0"
                };
            c[1] && (a[d.browser] = !0), parseInt(d.version, 10) < 9 && a.msie && (a.oldMsie = !0), a.chrome ? a.webkit = !0 : a.webkit && (a.safari = !0)
        }
        return a
    }, $.Editable.prototype.show = function (a) {
        if (void 0 !== a) {
            if (this.options.inlineMode)
                if (null !== a && "touchend" !== a.type) {
                    var b = a.pageX,
                        c = a.pageY;
                    b < this.$element.offset().left && (b = this.$element.offset().left), b > this.$element.offset().left + this.$element.width() && (b = this.$element.offset().left + this.$element.width()), c < this.$element.offset.top && (c = this.$element.offset().top), c > this.$element.offset().top + this.$element.height() && (c = this.$element.offset().top + this.$element.height()), 20 > b && (b = 20), 0 > c && (c = 0), this.showByCoordinates(b, c), $(".froala-editor:not(.f-basic)").hide(), this.$editor.show(), 0 == this.options.buttons.length && this.$editor.hide()
                } else $(".froala-editor:not(.f-basic)").hide(), this.$editor.show(), this.repositionEditor();
            this.hidePopups(), this.options.editInPopup || this.showEditPopupWrapper(), this.$bttn_wrapper.show(), this.refreshButtons(), this.imageMode = !1
        }
    }, $.Editable.prototype.hideDropdowns = function () {
        this.$bttn_wrapper.find(".fr-dropdown .fr-trigger").removeClass("active"), this.$bttn_wrapper.find(".fr-dropdown .fr-trigger")
    }, $.Editable.prototype.hide = function (a) {
        void 0 === a && (a = !0), a ? this.hideOtherEditors() : (this.closeImageMode(), this.imageMode = !1), this.$popup_editor.hide(), this.hidePopups(!1), this.hideDropdowns(), this.link = !1
    }, $.Editable.prototype.hideOtherEditors = function () {
        for (var a = 1; a <= $.Editable.count; a++) a != this._id && $(window).trigger("hide." + a)
    }, $.Editable.prototype.hideBttnWrapper = function () {
        this.options.inlineMode && this.$bttn_wrapper.hide()
    }, $.Editable.prototype.showBttnWrapper = function () {
        this.options.inlineMode && this.$bttn_wrapper.show()
    }, $.Editable.prototype.showEditPopupWrapper = function () {
        this.$edit_popup_wrapper && (this.$edit_popup_wrapper.show(), setTimeout($.proxy(function () {
            this.$edit_popup_wrapper.find("input").val(this.$element.text()).focus().select()
        }, this), 1))
    }, $.Editable.prototype.hideEditPopupWrapper = function () {
        this.$edit_popup_wrapper && this.$edit_popup_wrapper.hide()
    }, $.Editable.prototype.hidePopups = function (a) {
        void 0 == a && (a = !0), a && this.hideBttnWrapper(), this.raiseEvent("hidePopups")
    }, $.Editable.prototype.showEditPopup = function () {
        this.hidePopups(), this.showEditPopupWrapper()
    }, $.Editable.prototype.getBoundingRect = function () {
        var a;
        if (this.isLink) {
            a = {};
            var b = this.$element;
            a.left = b.offset().left - $(window).scrollLeft(), a.top = b.offset().top - $(window).scrollTop(), a.width = b.outerWidth(), a.height = parseInt(b.css("padding-top").replace("px", "")) + b.height(), a.right = 1, a.bottom = 1, a.ok = !0
        } else a = this.getRange().getBoundingClientRect();
        return a
    }, $.Editable.prototype.repositionEditor = function (a) {
        var b, c, d;
        (this.options.inlineMode || a) && (b = this.getBoundingRect(), this.showBttnWrapper(), b.ok || b.left >= 0 && b.top >= 0 && b.right > 0 && b.bottom > 0 ? (c = b.left + b.width / 2, d = b.top + b.height, this.iPad() || (c += $(window).scrollLeft(), d += $(window).scrollTop()), this.showByCoordinates(c, d)) : this.options.alwaysVisible ? this.hide() : (document.execCommand("selectAll", !1, !1), b = this.getBoundingRect(), c = b.left, d = b.top + b.height, this.iPad() || (c += $(window).scrollLeft(), d += $(window).scrollTop()), this.showByCoordinates(c, d - 20), this.getRange().collapse(!1)), 0 == this.options.buttons.length && this.hide())
    }, $.Editable.prototype.showByCoordinates = function (a, b) {
        a -= 20, b += 15;
        var c = Math.max(this.$popup_editor.width(), 250);
        a + c >= $(window).width() - 50 && a + 40 - c > 0 ? (this.$popup_editor.addClass("right-side"), a = $(window).width() - (a + 40), this.$popup_editor.css("top", b), this.$popup_editor.css("right", a), this.$popup_editor.css("left", "auto")) : a + c < $(window).width() - 50 ? (this.$popup_editor.removeClass("right-side"), this.$popup_editor.css("top", b), this.$popup_editor.css("left", a), this.$popup_editor.css("right", "auto")) : (this.$popup_editor.removeClass("right-side"), this.$popup_editor.css("top", b), this.$popup_editor.css("left", Math.max($(window).width() - c, 10) / 2), this.$popup_editor.css("right", "auto")), this.$popup_editor.show()
    }, $.Editable.prototype.positionPopup = function (a) {
        if ($(this.$editor.find('button.fr-bttn[data-cmd="' + a + '"]')).length) {
            var b = this.$editor.find('button.fr-bttn[data-cmd="' + a + '"]'),
                c = b.width(),
                d = b.height() - 15,
                e = b.offset().left + c / 2,
                f = b.offset().top + d;
            this.showByCoordinates(e, f)
        }
    }, $.Editable.image_commands = {
        floatImageLeft: {
            title: "Float Left",
            icon: {
                type: "font",
                value: "fa fa-align-left"
            }
        },
        floatImageNone: {
            title: "Float None",
            icon: {
                type: "font",
                value: "fa fa-align-justify"
            }
        },
        floatImageRight: {
            title: "Float Right",
            icon: {
                type: "font",
                value: "fa fa-align-right"
            }
        },
        linkImage: {
            title: "Insert Link",
            icon: {
                type: "font",
                value: "fa fa-link"
            }
        },
        replaceImage: {
            title: "Replace Image",
            icon: {
                type: "font",
                value: "fa fa-exchange"
            }
        },
        removeImage: {
            title: "Remove Image",
            icon: {
                type: "font",
                value: "fa fa-trash-o"
            }
        }
    }, $.Editable.prototype.hideImageEditorPopup = function () {
        this.$image_editor && this.$image_editor.hide()
    }, $.Editable.prototype.showImageEditorPopup = function () {
        this.$image_editor && this.$image_editor.show(), this.options.imageMove || this.$element.attr("contenteditable", !1)
    }, $.Editable.prototype.showImageWrapper = function () {
        this.$image_wrapper && this.$image_wrapper.show()
    }, $.Editable.prototype.hideImageWrapper = function (a) {
        this.$image_wrapper && (this.$element.attr("data-resize") || a || (this.closeImageMode(), this.imageMode = !1), this.$image_wrapper.hide())
    }, $.Editable.prototype.showInsertImage = function () {
        this.hidePopups(), this.showImageWrapper()
    }, $.Editable.prototype.showImageEditor = function () {
        this.hidePopups(), this.showImageEditorPopup()
    }, $.Editable.prototype.insertImageHTML = function () {
        var a = '<div class="froala-popup froala-image-popup" style="display: block;"><h4><span data-text="true">Insert image</span><i title="Cancel" class="fa fa-times" id="f-image-close-' + this._id + '"></i></h4>';
        return a += '<div id="f-image-list-' + this._id + '">', this.options.imageUpload && (a += '<div class="f-popup-line drop-upload">', a += '<div class="f-upload" id="f-upload-div-' + this._id + '"><strong data-text="true">Drop Image</strong><br>(<span data-text="true">or click</span>)<form target="frame-' + this._id + '" enctype="multipart/form-data" encoding="multipart/form-data" action="' + this.options.imageUploadURL + '" method="post" id="f-upload-form-' + this._id + '"><input id="f-file-upload-' + this._id + '" type="file" name="' + this.options.imageUploadParam + '" accept="image/*"></form></div>', this.browser.msie && $.Editable.getIEversion() <= 9 && (a += '<iframe id="frame-' + this._id + '" name="frame-' + this._id + '" src="javascript:false;" style="width:0; height:0; border:0px solid #FFF; position: fixed; z-index: -1;" data-loaded="true"></iframe>'), a += "</div>"), this.options.imageLink && (a += '<div class="f-popup-line"><label><span data-text="true">Enter URL</span>: </label><input id="f-image-url-' + this._id + '" type="text" placeholder="http://example.com"><button class="f-browse" id="f-browser-' + this._id + '"><i class="fa fa-search"></i></button><button data-text="true" class="f-ok" id="f-image-ok-' + this._id + '">OK</button></div>'), a += "</div>", a += '<p class="f-progress" id="f-progress-' + this._id + '"><span></span></p>', a += "</div>"
    }, $.Editable.prototype.iFrameLoad = function () {
        var a = this.$image_wrapper.find("iframe#frame-" + this._id);
        if (!a.data("loaded")) return a.data("loaded", !0), !1;
        try {
            {
                var b = this.$image_wrapper.find("#f-upload-form-" + this._id);
                this.$image_wrapper.find("#f-file-upload-" + this._id)
            }
            if (this.options.imageUploadToS3) {
                var c = b.attr("action"),
                    d = b.find('input[name="key"]').val(),
                    e = c + d;
                this.writeImage(e), this.options.imageUploadToS3.callback && this.options.imageUploadToS3.callback.call(this, e, d)
            } else {
                var f = a.contents().text();
                this.parseImageResponse(f)
            }
        } catch (g) {
            this.throwImageError(7)
        }
    }, $.Editable.prototype.buildInsertImage = function () {
        this.$image_wrapper = $(this.insertImageHTML()), this.$popup_editor.append(this.$image_wrapper);
        var a = this;
        if (this.addListener("hidePopups", $.proxy(function () {
            this.hideImageWrapper(!0)
        }), this), this.$progress_bar = this.$image_wrapper.find("p#f-progress-" + this._id), this.options.imageUpload) {
            if (this.browser.msie && $.Editable.getIEversion() <= 9) {
                var b = this.$image_wrapper.find("iframe").get(0);
                b.attachEvent ? b.attachEvent("onload", function () {
                    a.iFrameLoad()
                }) : b.onload = function () {
                    a.iFrameLoad()
                }
            }
            this.$image_wrapper.on("change", 'input[type="file"]', function () {
                if (void 0 !== this.files) a.uploadFile(this.files);
                else {
                    var b = $(this).parents("form");
                    b.find('input[type="hidden"]').remove();
                    var c;
                    for (c in a.options.imageUploadParams) b.prepend('<input type="hidden" name="' + c + '" value="' + a.options.imageUploadParams[c] + '" />');
                    if (void 0 !== a.options.imageUploadToS3) {
                        for (c in a.options.imageUploadToS3.params) b.prepend('<input type="hidden" name="' + c + '" value="' + a.options.imageUploadToS3.params[c] + '" />');
                        b.prepend('<input type="hidden" name="success_action_status" value="201" />'), b.prepend('<input type="hidden" name="X-Requested-With" value="xhr" />'), b.prepend('<input type="hidden" name="Content-Type" value="" />'), b.prepend('<input type="hidden" name="key" value="' + a.options.imageUploadToS3.keyStart + (new Date).getTime() + "-" + $(this).val().match(/[^\/\\]+$/) + '" />')
                    } else b.prepend('<input type="hidden" name="XHR_CORS_TRARGETORIGIN" value="' + window.location.href + '" />');
                    a.$image_wrapper.find("#f-image-list-" + a._id).hide(), a.$progress_bar.show(), a.$progress_bar.find("span").css("width", "100%").text("Please wait!"), a.showInsertImage(), b.submit()
                }
            }), this.buildDragUpload()
        }
        this.$image_wrapper.on("mouseup keydown", "#f-image-url-" + this._id, $.proxy(function (a) {
            a.stopPropagation()
        }, this)), this.$image_wrapper.on("click", "#f-image-ok-" + this._id, $.proxy(function () {
            this.writeImage(this.$image_wrapper.find("#f-image-url-" + this._id).val(), !0)
        }, this)), this.$image_wrapper.on("click", "#f-image-close-" + this._id, $.proxy(function () {
            this.$bttn_wrapper.show(), this.hideImageWrapper(!0), this.options.inlineMode && 0 == this.options.buttons.length && (this.imageMode ? this.showImageEditor() : this.hide()), this.imageMode || this.restoreSelection(), this.options.inlineMode || this.imageMode ? this.imageMode && this.showImageEditor() : this.hide()
        }, this)), this.$image_wrapper.on("click", function (a) {
            a.stopPropagation()
        }), this.$image_wrapper.on("click", "*", function (a) {
            a.stopPropagation()
        })
    }, $.Editable.prototype.deleteImage = function (a) {
        if (this.options.imageDeleteURL) {
            var b = this.options.imageDeleteParams;
            b.info = a.data("info"), $.post(this.options.imageDeleteURL, b, $.proxy(function (b) {
                a.parent().parent().hasClass("f-image-list") ? a.parent().remove() : a.parent().removeClass("f-img-deleting"), this.callback("imageDeleteSuccess", [b], !1)
            }, this)).fail($.proxy(function () {
                a.parent().removeClass("f-img-deleting"), this.callback("imageDeleteError", ["Error during image delete."], !1)
            }, this))
        } else a.parent().removeClass("f-img-deleting"), this.callback("imageDeleteError", ["Missing imageDeleteURL option."], !1)
    }, $.Editable.prototype.imageHandle = function () {
        var a = this,
            b = $("<span>").addClass("f-img-handle").on({
                movestart: function (b) {
                    a.hide(), a.$element.addClass("f-non-selectable").attr("contenteditable", !1), a.$element.attr("data-resize", !0), $(this).attr("data-start-x", b.startX), $(this).attr("data-start-y", b.startY)
                },
                move: function (b) {
                    var c = $(this),
                        d = b.pageX - parseInt(c.attr("data-start-x"), 10);
                    c.attr("data-start-x", b.pageX), c.attr("data-start-y", b.pageY);
                    var e = c.prevAll("img"),
                        f = e.width();
                    c.hasClass("f-h-ne") || c.hasClass("f-h-se") ? e.attr("width", f + d) : e.attr("width", f - d), a.callback("imageResize", [], !1)
                },
                moveend: function () {
                    $(this).removeAttr("data-start-x"), $(this).removeAttr("data-start-y"), a.$element.removeClass("f-non-selectable"), a.isImage || a.$element.attr("contenteditable", !0), a.callback("imageResizeEnd"), $(this).trigger("mouseup")
                }
            });
        return b
    }, $.Editable.prototype.disableImageResize = function () {
        if (this.browser.mozilla) try {
            document.execCommand("enableObjectResizing", !1, !1), document.execCommand("enableInlineTableEditing", !1, !1)
        } catch (a) {}
    }, $.Editable.prototype.isResizing = function () {
        return this.$element.attr("data-resize")
    }, $.Editable.prototype.initImageResizer = function () {
        this.disableImageResize();
        var a = this;
        document.addEventListener && document.addEventListener("drop", $.proxy(function () {
            setTimeout($.proxy(function () {
                a.closeImageMode(), a.hide(), this.sync(), this.clearSelection()
            }, this), 10)
        }, this)), this.$element.on("mousedown", "img", function () {
            a.isResizing() || (a.imageHTML = a.getHTML(), (!a.options.imageMove || a.browser.msie) && a.$element.attr("contenteditable", !1))
        }), this.$element.on("mouseup", "img", function () {
            a.isResizing() || a.options.imageMove || a.isImage || a.isHTML || a.$element.attr("contenteditable", !0)
        }), this.$element.on("click touchend", "img", function (b) {
            if (!a.isResizing()) {
                b.preventDefault(), b.stopPropagation(), a.$element.blur(), a.$image_editor.find("button").removeClass("active");
                var c = $(this).css("float");
                a.$image_editor.find('button[data-cmd="floatImage' + c.charAt(0).toUpperCase() + c.slice(1) + '"]').addClass("active"), a.$image_editor.find('.f-image-alt input[type="text"]').val($(this).attr("alt") || $(this).attr("title")), a.showImageEditor(), $(this).parent().hasClass("f-img-editor") && "SPAN" == $(this).parent().get(0).tagName || ($(this).wrap('<span class="f-img-editor" style="float: ' + $(this).css("float") + "; margin-left:" + $(this).css("margin-left") + " ; margin-right:" + $(this).css("margin-right") + "; margin-bottom: " + $(this).css("margin-bottom") + "; margin-top: " + $(this).css("margin-bottom") + ';"></span>'), $(this).css("margin-left", "auto"), $(this).css("margin-right", "auto"), $(this).css("margin-bottom", "auto"), $(this).css("margin-top", "auto"), 0 !== $(this).parents(".f-img-wrap").length || a.isImage || $(this).parent().wrap('<span class="f-img-wrap"></span>'));
                var d = a.imageHandle();
                $(this).parent().find(".f-img-handle").remove(), a.options.imageResize && ($(this).parent().append(d.clone(!0).addClass("f-h-ne")), $(this).parent().append(d.clone(!0).addClass("f-h-se")), $(this).parent().append(d.clone(!0).addClass("f-h-sw")), $(this).parent().append(d.clone(!0).addClass("f-h-nw"))), a.clearSelection(), a.showByCoordinates($(this).offset().left + $(this).width() / 2, $(this).offset().top + $(this).height()), a.imageMode = !0, a.$bttn_wrapper.find(".fr-bttn").removeClass("active")
            }
        })
    }, $.Editable.prototype.initImagePopup = function () {
        this.$image_editor = $('<div class="froala-popup froala-image-editor-popup">');
        for (var a = $('<div class="f-popup-line">').appendTo(this.$image_editor), b = 0; b < this.options.imageButtons.length; b++) {
            var c = this.options.imageButtons[b];
            if (void 0 !== $.Editable.image_commands[c]) {
                var d = $.Editable.image_commands[c],
                    e = '<button class="fr-bttn" data-cmd="' + c + '" title="' + d.title + '">';
                e += void 0 !== this.options.icons[c] ? this.prepareIcon(this.options.icons[c], d.title) : this.prepareIcon(d.icon, d.title), e += "</button>", a.append(e)
            }
        }
        this.addListener("hidePopups", this.hideImageEditorPopup);
        var f = ($('<div class="f-popup-line f-image-alt">').append('<label><span data-text="true">Title</span>: </label>').append($('<input type="text">').on("mouseup keydown", function (a) {
            a.stopPropagation()
        })).append('<button class="f-ok" data-text="true" data-cmd="setImageAlt" title="OK">OK</button>').appendTo(this.$image_editor), this);
        this.$image_editor.find("button").click(function (a) {
            a.stopPropagation(), f[$(this).attr("data-cmd")](f.$element.find("span.f-img-editor"))
        }), this.$popup_editor.append(this.$image_editor)
    }, $.Editable.prototype.floatImageLeft = function (a) {
        this.options.inlineMode ? a.css("margin-left", "3px") : a.css("margin-left", "auto"), a.css("margin-right", this.options.imageMargin), a.css("margin-bottom", this.options.imageMargin), a.css("margin-top", this.options.imageMargin), a.css("float", "left"), a.find("img").css("float", "left"), this.isImage && this.$element.css("float", "left"), this.saveUndoStep(), this.callback("floatImageLeft"), a.find("img").click()
    }, $.Editable.prototype.floatImageNone = function (a) {
        a.css("margin-left", "auto"), a.css("margin-right", "auto"), a.css("margin-bottom", this.options.imageMargin), a.css("margin-top", this.options.imageMargin), a.css("float", "none"), a.find("img").css("float", "none"), this.isImage || (a.parent().get(0) == this.$element.get(0) ? a.wrap('<div style="text-align: center;"></div>') : a.parents(".f-img-wrap:first").css("text-align", "center")), this.isImage && this.$element.css("float", "none"), this.saveUndoStep(), this.callback("floatImageNone"), a.find("img").click()
    }, $.Editable.prototype.floatImageRight = function (a) {
        this.options.inlineMode ? a.css("margin-right", "3px") : a.css("margin-right", "auto"), a.css("margin-left", this.options.imageMargin), a.css("margin-bottom", this.options.imageMargin), a.css("margin-top", this.options.imageMargin), a.css("float", "right"), a.find("img").css("float", "right"), this.isImage && this.$element.css("float", "right"), this.saveUndoStep(), this.callback("floatImageRight"), a.find("img").click()
    }, $.Editable.prototype.linkImage = function (a) {
        this.showInsertLink(), this.imageMode = !0, "A" == a.parent().get(0).tagName ? (this.$link_wrapper.find('input[type="text"]').val(a.parent().attr("href")), this.$link_wrapper.find(".f-external-link").attr("href", a.parent().attr("href")), "_blank" == a.parent().attr("target") ? this.$link_wrapper.find('input[type="checkbox"]').prop("checked", !0) : this.$link_wrapper.find('input[type="checkbox"]').prop("checked", !1)) : (this.$link_wrapper.find('input[type="text"]').val("http://"), this.$link_wrapper.find(".f-external-link").attr("href", "#"), this.$link_wrapper.find('input[type="checkbox"]').prop("checked", this.options.alwaysBlank))
    }, $.Editable.prototype.replaceImage = function (a) {
        this.showInsertImage(), this.imageMode = !0, this.$image_wrapper.find('input[type="text"]').val(a.find("img").attr("src")), this.showByCoordinates(this.$popup_editor.offset().left + 20, this.$popup_editor.offset().top - 15)
    }, $.Editable.prototype.removeImage = function (a) {
        var b = a.find("img").get(0),
            c = "Are you sure? Image will be deleted.";
        if ($.Editable.LANGS[this.options.language] && (c = $.Editable.LANGS[this.options.language].translation[c]), confirm(c)) {
            if (this.callback("beforeRemoveImage", [$(b)], !1) === !0) {
                {
                    $(b).attr("src")
                }
                a.parents(".f-img-wrap").length ? a.parents(".f-img-wrap").remove() : a.remove(), this.refreshImageList(!0), this.hide(), this.saveUndoStep(), this.callback("afterRemoveImage", [$(b)]), this.focus()
            }
        } else a.find("img").click()
    }, $.Editable.prototype.setImageAlt = function (a) {
        a.find("img").attr("alt", this.$image_editor.find('.f-image-alt input[type="text"]').val()), a.find("img").attr("title", this.$image_editor.find('.f-image-alt input[type="text"]').val()), this.saveUndoStep(), this.hide(), this.closeImageMode(), this.callback("setImageAlt")
    }, $.Editable.prototype.addImageWrapper = function () {
        this.isImage || this.$element.find("img").each(function (a, b) {
            var c = $(b);
            0 === c.parents(".f-img-wrap").length && (c.parents("a").length > 0 ? $(c.parents("a")[0]).wrap('<span class="f-img-wrap"></span>') : c.wrap('<span class="f-img-wrap"></span>'))
        })
    }, $.Editable.prototype.buildDragUpload = function () {
        var a = this;
        a.$image_wrapper.on("dragover", "#f-upload-div-" + this._id, function () {
            return $(this).addClass("f-hover"), !1
        }), a.$image_wrapper.on("dragend", "#f-upload-div-" + this._id, function () {
            return $(this).removeClass("f-hover"), !1
        }), a.$image_wrapper.on("drop", "#f-upload-div-" + this._id, function (b) {
            $(this).removeClass("f-hover"), b.preventDefault(), b.stopPropagation(), a.uploadFile(b.originalEvent.dataTransfer.files)
        })
    }, $.Editable.prototype.hideImageLoader = function () {
        this.$progress_bar.hide(), this.$progress_bar.find("span").css("width", "0%").text(""), this.$image_wrapper.find("#f-image-list-" + this._id).show()
    }, $.Editable.prototype.writeImage = function (a, b) {
        b && (a = this.sanitizeURL(a));
        var c = new Image;
        return c.onerror = $.proxy(function () {
            this.hideImageLoader(), this.throwImageError(1)
        }, this), this.imageMode ? (c.onload = $.proxy(function () {
            this.$element.find(".f-img-editor > img").attr("src", a), this.hide(), this.hideImageLoader(), this.$image_editor.show(), this.saveUndoStep(), this.callback("replaceImage", [a])
        }, this), c.src = a, !1) : (c.onload = $.proxy(function () {
            this.$element.focus(), this.restoreSelection(), this.callback("imageLoaded", [a], !1);
            var b = '<img alt="Image title" src="' + a + '" width="' + this.options.defaultImageWidth + '" style="min-width: 16px; min-height: 16px; margin-bottom: ' + this.options.imageMargin + "px; margin-left: auto; margin-right: auto; margin-top: " + this.options.imageMargin + 'px">',
                c = this.getSelectionElements()[0],
                d = this.getRange(),
                e = !this.browser.msie && $.Editable.getIEversion() > 8 ? $(d.startContainer) : null;
            e && e.hasClass("f-img-wrap") ? (1 == d.startOffset ? (e.after('<span class="f-marker" data-type="true" data-id="0"></span><br/><span class="f-marker" data-type="false" data-id="0"></span>'), this.restoreSelectionByMarkers(), this.getSelection().collapseToStart()) : 0 == d.startOffset && (e.before('<span class="f-marker" data-type="true" data-id="0"></span><br/><span class="f-marker" data-type="false" data-id="0"></span>'), this.restoreSelectionByMarkers(), this.getSelection().collapseToStart()), this.insertHTML(b)) : this.getSelectionTextInfo(c).atStart && c != this.$element.get(0) && "TD" != c.tagName && "TH" != c.tagName && "LI" != c.tagName ? $(c).before("<p>" + b + "</p>") : this.insertHTML(b), this.$element.find("img").each(function (a, b) {
                b.oncontrolselect = function () {
                    return !1
                }
            }), this.hide(), this.hideImageLoader(), this.saveUndoStep(), this.callback("insertImage", [a])
        }, this), void(c.src = a))
    }, $.Editable.prototype.throwImageErrorWithMessage = function (a) {
        this.options.imageErrorCallback && $.isFunction(this.options.imageErrorCallback) && this.options.imageErrorCallback({
            message: a,
            code: 0
        }), this.hideImageLoader()
    }, $.Editable.prototype.throwImageError = function (a) {
        var b = "Unknown image upload error.";
        1 == a ? b = "Bad link." : 2 == a ? b = "No link in upload response." : 3 == a ? b = "Error during file upload." : 4 == a ? b = "Parsing response failed." : 5 == a ? b = "Image too large." : 6 == a ? b = "Invalid image type." : 7 == a && (b = "Image can be uploaded only to same domain in IE 8 and IE 9."), this.options.imageErrorCallback && $.isFunction(this.options.imageErrorCallback) && this.options.imageErrorCallback({
            code: a,
            message: b
        }), this.hideImageLoader()
    }, $.Editable.prototype.uploadFile = function (a) {
        if (this.callback("beforeFileUpload", [a], !1) !== !0) return !1;
        if (void 0 !== a && a.length > 0) {
            var b;
            if (this.drag_support.formdata && (b = this.drag_support.formdata ? new FormData : null), b) {
                var c;
                for (c in this.options.imageUploadParams) b.append(c, this.options.imageUploadParams[c]);
                if (void 0 !== this.options.imageUploadToS3) {
                    for (c in this.options.imageUploadToS3.params) b.append(c, this.options.imageUploadToS3.params[c]);
                    b.append("success_action_status", "201"), b.append("X-Requested-With", "xhr"), b.append("Content-Type", a[0].type), b.append("key", this.options.imageUploadToS3.keyStart + (new Date).getTime() + "-" + a[0].name)
                }
                if (b.append(this.options.imageUploadParam, a[0]), a[0].size > this.options.maxImageSize) return this.throwImageError(5), !1;
                if (this.options.allowedImageTypes.indexOf(a[0].type.replace(/image\//g, "")) < 0) return this.throwImageError(6), !1
            }
            if (b) {
                var d;
                this.options.crossDomain ? d = this.createCORSRequest("POST", this.options.imageUploadURL) : (d = new XMLHttpRequest, d.open("POST", this.options.imageUploadURL)), d.onload = $.proxy(function () {
                    this.$progress_bar.find("span").css("width", "100%").text("Please wait!");
                    try {
                        200 == d.status ? this.parseImageResponse(d.responseText) : 201 == d.status ? this.parseImageResponseXML(d.responseXML) : this.throwImageError(3)
                    } catch (a) {
                        this.throwImageError(4)
                    }
                }, this), d.onerror = $.proxy(function () {
                    this.throwImageError(3)
                }, this), d.upload.onprogress = $.proxy(function (a) {
                    if (a.lengthComputable) {
                        var b = a.loaded / a.total * 100 | 0;
                        this.$progress_bar.find("span").css("width", b + "%")
                    }
                }, this), d.send(b), this.$image_wrapper.find("#f-image-list-" + this._id).hide(), this.$progress_bar.show(), this.showInsertImage()
            }
        }
    }, $.Editable.prototype.parseImageResponse = function (a) {
        try {
            var b = $.parseJSON(a);
            b.link ? this.writeImage(b.link) : b.error ? this.throwImageErrorWithMessage(b.error) : this.throwImageError(2)
        } catch (c) {
            this.throwImageError(4)
        }
    }, $.Editable.prototype.parseImageResponseXML = function (a) {
        try {
            var b = $(a).find("Location").text(),
                c = $(a).find("Key").text();
            this.options.imageUploadToS3.callback.call(this, b, c), b ? this.writeImage(b) : this.throwImageError(2)
        } catch (d) {
            this.throwImageError(4)
        }
    }, $.Editable.prototype.setImageUploadURL = function (a) {
        a && (this.options.imageUploadURL = a), this.options.imageUploadToS3 && (this.options.imageUploadURL = "https://" + this.options.imageUploadToS3.bucket + "." + this.options.imageUploadToS3.region + ".amazonaws.com/")
    }, $.Editable.prototype.closeImageMode = function () {
        this.$element.find("span.f-img-editor > img").each(function (a, b) {
            $(b).css("margin-left", $(b).parent().css("margin-left")), $(b).css("margin-right", $(b).parent().css("margin-right")), $(b).css("margin-bottom", $(b).parent().css("margin-bottom")), $(b).css("margin-top", $(b).parent().css("margin-top")), $(b).siblings("span.f-img-handle").remove().end().unwrap()
        }), this.$element.find("span.f-img-editor").length && (this.$element.find("span.f-img-editor").remove(), this.$element.parents("span.f-img-editor").remove()), this.$element.removeClass("f-non-selectable"), this.editableDisabled || this.isHTML || this.$element.attr("contenteditable", !0), this.$image_editor && this.$image_editor.hide()
    }, $.Editable.prototype.refreshImageList = function (a) {
        if (!this.isLink && !this.options.editInPopup) {
            this.addImageWrapper();
            var b = [],
                c = this;
            if (this.$element.find("img").each(function (a, d) {
                var e = $(d);
                if (b.push(e.attr("src")), "right" == e.css("float")) {
                    var f = e.parent();
                    f.hasClass("f-img-editor") ? (f.css("margin-left", c.options.imageMargin).css("margin-bottom", c.options.imageMargin).css("margin-top", c.options.imageMargin).css("margin-right", "3px"), e.css("margin", "auto")) : e.css("margin-left", c.options.imageMargin).css("margin-bottom", c.options.imageMargin).css("margin-top", c.options.imageMargin).css("margin-right", "3px")
                } else if ("left" == e.css("float")) {
                    var f = e.parent();
                    f.hasClass("f-img-editor") ? (f.css("margin-right", c.options.imageMargin).css("margin-bottom", c.options.imageMargin).css("margin-top", c.options.imageMargin).css("margin-left", "3px"), e.css("margin", "auto")) : e.css("margin-right", c.options.imageMargin).css("margin-bottom", c.options.imageMargin).css("margin-top", c.options.imageMargin).css("margin-left", "3px")
                }
            }), void 0 === a)
                for (var d = 0; d < this.imageList.length; d++) b.indexOf(this.imageList[d]) < 0 && this.callback("afterRemoveImage", [this.imageList[d]], !1);
            this.imageList = b
        }
    }, $.Editable.prototype.showLinkWrapper = function () {
        this.$link_wrapper && (this.$link_wrapper.show(), this.$link_wrapper.trigger("hideLinkList"), setTimeout($.proxy(function () {
            this.$link_wrapper.find('input[type="text"]').focus().select()
        }, this), 0), this.link = !0)
    }, $.Editable.prototype.hideLinkWrapper = function () {
        this.$link_wrapper && this.$link_wrapper.hide()
    }, $.Editable.prototype.showInsertLink = function () {
        this.hidePopups(), this.showLinkWrapper()
    }, $.Editable.prototype.initLink = function () {
        var a = this,
            b = function (a) {
                a.stopPropagation(), a.preventDefault()
            },
            c = function (b) {
                b.stopPropagation(), b.preventDefault(), a.link = !0, a.clearSelection(), a.removeMarkers(), a.selectionDisabled || ($(this).before('<span class="f-marker" data-type="true" data-id="0"></span>'), $(this).after('<span class="f-marker" data-type="false" data-id="0"></span>')), a.restoreSelectionByMarkers(), a.exec("createLink");
                var c = $(this).attr("href") || "";
                a.$link_wrapper.find("input.f-lt").val($(this).text()), a.isLink ? ("#" == c && (c = ""), a.$link_wrapper.find("input.f-lu").val(c.replace(/\&amp;/g, "&")), a.$link_wrapper.find(".f-external-link").attr("href", c || "#")) : (a.$link_wrapper.find("input.f-lu").val(c.replace(/\&amp;/g, "&")), a.$link_wrapper.find(".f-external-link").attr("href", c)), a.$link_wrapper.find('input[type="checkbox"]').prop("checked", "_blank" == $(this).attr("target")), a.showByCoordinates($(this).offset().left + $(this).width() / 2, $(this).offset().top + $(this).height()), a.$link_wrapper.find("input.f-lu").focus(), a.closeImageMode(), a.showInsertLink()
            };
        this.isLink ? this.iOS() ? (this.$element.on("click", b), this.$element.on("touchend", c)) : this.$element.on("click", c) : this.iOS() ? (this.$element.on("click", "a", b), this.$element.on("touchend", "a", c)) : this.$element.on("click", "a", c)
    }, $.Editable.prototype.writeLink = function (a, b, c, d) {
        this.options.noFollow && (d = !0), this.options.alwaysBlank && (c = !0);
        var e = "",
            f = "";
        if (d === !0 && (e = 'rel="nofollow"'), c === !0 && (f = 'target="_blank"'), a = this.sanitizeURL(a), this.imageMode) "" !== a ? ("A" != this.$element.find(".f-img-editor").parent().get(0).tagName ? this.$element.find(".f-img-editor").wrap('<a class="f-link" href="' + a + '" ' + f + " " + e + "></a>") : (c === !0 ? this.$element.find(".f-img-editor").parent().attr("target", "_blank") : this.$element.find(".f-img-editor").parent().removeAttr("target"), d === !0 ? this.$element.find(".f-img-editor").parent().attr("rel", "nofollow") : this.$element.find(".f-img-editor").parent().removeAttr("rel"), this.$element.find(".f-img-editor").parent().attr("href", a)), this.callback("insertImageLink", [a])) : ("A" == this.$element.find(".f-img-editor").parent().get(0).tagName && $(this.$element.find(".f-img-editor").get(0)).unwrap(), this.callback("removeImageLink")), this.saveUndoStep(), this.showImageEditor(), this.$element.find(".f-img-editor").find("img").click(), this.link = !1;
        else {
            if (this.isLink ? "" == b && (b = this.$element.text()) : (this.restoreSelection(), document.execCommand("unlink", !1, a), this.saveSelectionByMarkers(), this.$element.find("span.f-link").each(function (a, b) {
                $(b).replaceWith($(b).html())
            }), this.restoreSelectionByMarkers()), "" !== a) {
                var g;
                this.isLink ? (this.$element.text(b), g = [this.$element.attr("href", a).get(0)]) : (document.execCommand("createLink", !1, a), g = this.getSelectionLinks());
                for (var h = 0; h < g.length; h++) c === !0 ? $(g[h]).attr("target", "_blank") : $(g[h]).removeAttr("target"), d === !0 ? $(g[h]).attr("rel", "nofollow") : $(g[h]).removeAttr("rel"), $(g[h]).addClass("f-link");
                this.$element.find("a:empty").remove(), this.callback("insertLink", [a])
            } else this.$element.find("a:empty").remove(), this.callback("removeLink");
            this.saveUndoStep(), this.hideLinkWrapper(), this.$bttn_wrapper.show(), (!this.options.inlineMode || this.isLink) && this.hide(), this.link = !1
        }
    }, $.Editable.prototype.createLinkHTML = function () {
        var a = '<div class="froala-popup froala-link-popup">';
        a += '<h4><span data-text="true">Insert link</span><a target="_blank" title="Open Link" class="f-external-link" href="#"><i class="fa fa-external-link"></i></a><i title="Cancel" class="fa fa-times" id="f-link-close-' + this._id + '"></i></h4>', this.isLink && this.options.linkText && (a += '<div class="f-popup-line"><input type="text" placeholder="Text" class="f-lt" id="f-lt-' + this._id + '"></div>');
        var b = "";
        if (this.options.linkList.length && (b = "f-bi"), a += '<div class="f-popup-line"><input type="text" placeholder="http://www.example.com" class="f-lu ' + b + '" id="f-lu-' + this._id + '">', this.options.linkList.length) {
            a += '<button class="f-browse-links" id="f-browse-links-' + this._id + '"><i class="fa fa-chevron-down"></i></button>', a += '<ul id="f-link-list-' + this._id + '">';
            for (var c = 0; c < this.options.linkList.length; c++) {
                var d = this.options.linkList[c];
                a += '<li class="f-choose-link" data-nofollow="' + d.nofollow + '" data-blank="' + d.blank + '" data-body="' + d.body + '" data-title="' + d.title + '" data-href="' + d.href + '">' + d.body + "</li>"
            }
            a += "</ul>"
        }
        return a += "</div>", a += '<div class="f-popup-line"><input type="checkbox" id="f-checkbox-' + this._id + '"> <label data-text="true" for="f-checkbox-' + this._id + '">Open in new tab</label><button data-text="true" type="button" class="f-ok" id="f-ok-' + this._id + '">OK</button>', this.options.unlinkButton && (a += '<button type="button" data-text="true" class="f-ok f-unlink" id="f-unlink-' + this._id + '">UNLINK</button>'), a += "</div></div>"
    }, $.Editable.prototype.buildCreateLink = function () {
        this.$link_wrapper = $(this.createLinkHTML()), this.$popup_editor.append(this.$link_wrapper);
        var a = this;
        this.addListener("hidePopups", this.hideLinkWrapper), this.isLink && this.options.linkText && this.$link_wrapper.on("mouseup keydown", "input#f-lt-" + this._id, $.proxy(function (a) {
            a.stopPropagation(), this.$link_wrapper.trigger("hideLinkList")
        }, this)), this.$link_wrapper.on("mouseup keydown", "input#f-lu-" + this._id, $.proxy(function (a) {
            a.stopPropagation(), this.$link_wrapper.trigger("hideLinkList")
        }, this)), this.$link_wrapper.on("click", "input#f-checkbox-" + this._id, function (a) {
            a.stopPropagation()
        }), this.$link_wrapper.on("touchend", "button#f-ok-" + this._id, function (a) {
            a.stopPropagation()
        }).on("click", "button#f-ok-" + this._id, $.proxy(function () {
            var a, b = this.$link_wrapper.find("input#f-lt-" + this._id),
                c = this.$link_wrapper.find("input#f-lu-" + this._id),
                d = this.$link_wrapper.find("input#f-checkbox-" + this._id);
            a = b ? b.val() : "";
            var e = c.val();
            this.isLink && "" == e && (e = "#"), this.writeLink(e, a, d.prop("checked"))
        }, this)), this.$link_wrapper.on("click touch", "button#f-unlink-" + this._id, $.proxy(function () {
            this.link = !0;
            var a = this.$link_wrapper.find("input#f-checkbox-" + this._id);
            this.writeLink("", "", a.prop("checked"))
        }, this)), this.options.linkList.length && (this.$link_wrapper.on("click touch", "li.f-choose-link", function () {
            var b = (a.$link_wrapper.find("ul#f-link-list-" + a._id), a.$link_wrapper.find("button#f-browse-links-" + a._id)),
                c = a.$link_wrapper.find("input#f-lt-" + a._id),
                d = a.$link_wrapper.find("input#f-lu-" + a._id),
                e = a.$link_wrapper.find("input#f-checkbox-" + a._id);
            c && c.val($(this).data("body")), d.val($(this).data("href")), e.prop("checked", $(this).data("blank")), b.click()
        }).on("mouseup", "li.f-choose-link", function (a) {
            a.stopPropagation()
        }), this.$link_wrapper.on("click", "button#f-browse-links-" + this._id, function (b) {
            b.stopPropagation();
            var c = a.$link_wrapper.find("ul#f-link-list-" + a._id);
            $(this).find("i").toggleClass("fa-chevron-down"), $(this).find("i").toggleClass("fa-chevron-up"), c.toggle()
        }).on("mouseup", "button#f-browse-links-" + this._id, function (a) {
            a.stopPropagation()
        }), this.$link_wrapper.bind("hideLinkList", function () {
            var b = a.$link_wrapper.find("ul#f-link-list-" + a._id),
                c = a.$link_wrapper.find("button#f-browse-links-" + a._id);
            b && b.is(":visible") && c.click()
        })), this.$link_wrapper.on("click", "i#f-link-close-" + this._id, $.proxy(function () {
            this.$bttn_wrapper.show(), this.hideLinkWrapper(), this.options.inlineMode && !this.imageMode && 0 == this.options.buttons.length && this.hide(), this.imageMode || this.restoreSelection(), !this.options.inlineMode && !this.imageMode || this.isLink ? this.hide() : this.imageMode && this.showImageEditor()
        }, this))
    },
    function (a) {
        "function" == typeof define && define.amd ? define(["jquery"], a) : a(jQuery)
    }(function (a, b) {
        function c(a) {
            function b() {
                d ? (c(), M(b), e = !0, d = !1) : e = !1
            }
            var c = a,
                d = !1,
                e = !1;
            this.kick = function () {
                d = !0, e || b()
            }, this.end = function (a) {
                var b = c;
                a && (e ? (c = d ? function () {
                    b(), a()
                } : a, d = !0) : a())
            }
        }

        function d() {
            return !0
        }

        function e() {
            return !1
        }

        function f(a) {
            a.preventDefault()
        }

        function g(a) {
            N[a.target.tagName.toLowerCase()] || a.preventDefault()
        }

        function h(a) {
            return 1 === a.which && !a.ctrlKey && !a.altKey
        }

        function i(a, b) {
            var c, d;
            if (a.identifiedTouch) return a.identifiedTouch(b);
            for (c = -1, d = a.length; ++c < d;)
                if (a[c].identifier === b) return a[c]
        }

        function j(a, b) {
            var c = i(a.changedTouches, b.identifier);
            if (c && (c.pageX !== b.pageX || c.pageY !== b.pageY)) return c
        }

        function k(a) {
            var b;
            h(a) && (b = {
                target: a.target,
                startX: a.pageX,
                startY: a.pageY,
                timeStamp: a.timeStamp
            }, J(document, O.move, l, b), J(document, O.cancel, m, b))
        }

        function l(a) {
            var b = a.data;
            s(a, b, a, n)
        }

        function m() {
            n()
        }

        function n() {
            K(document, O.move, l), K(document, O.cancel, m)
        }

        function o(a) {
            var b, c;
            N[a.target.tagName.toLowerCase()] || (b = a.changedTouches[0], c = {
                target: b.target,
                startX: b.pageX,
                startY: b.pageY,
                timeStamp: a.timeStamp,
                identifier: b.identifier
            }, J(document, P.move + "." + b.identifier, p, c), J(document, P.cancel + "." + b.identifier, q, c))
        }

        function p(a) {
            var b = a.data,
                c = j(a, b);
            c && s(a, b, c, r)
        }

        function q(a) {
            var b = a.data,
                c = i(a.changedTouches, b.identifier);
            c && r(b.identifier)
        }

        function r(a) {
            K(document, "." + a, p), K(document, "." + a, q)
        }

        function s(a, b, c, d) {
            var e = c.pageX - b.startX,
                f = c.pageY - b.startY;
            I * I > e * e + f * f || v(a, b, c, e, f, d)
        }

        function t() {
            return this._handled = d, !1
        }

        function u(a) {
            try {
                a._handled()
            } catch (b) {
                return !1
            }
        }

        function v(a, b, c, d, e, f) {
            {
                var g, h;
                b.target
            }
            g = a.targetTouches, h = a.timeStamp - b.timeStamp, b.type = "movestart", b.distX = d, b.distY = e, b.deltaX = d, b.deltaY = e, b.pageX = c.pageX, b.pageY = c.pageY, b.velocityX = d / h, b.velocityY = e / h, b.targetTouches = g, b.finger = g ? g.length : 1, b._handled = t, b._preventTouchmoveDefault = function () {
                a.preventDefault()
            }, L(b.target, b), f(b.identifier)
        }

        function w(a) {
            var b = a.data.timer;
            a.data.touch = a, a.data.timeStamp = a.timeStamp, b.kick()
        }

        function x(a) {
            var b = a.data.event,
                c = a.data.timer;
            y(), D(b, c, function () {
                setTimeout(function () {
                    K(b.target, "click", e)
                }, 0)
            })
        }

        function y() {
            K(document, O.move, w), K(document, O.end, x)
        }

        function z(a) {
            var b = a.data.event,
                c = a.data.timer,
                d = j(a, b);
            d && (a.preventDefault(), b.targetTouches = a.targetTouches, a.data.touch = d, a.data.timeStamp = a.timeStamp, c.kick())
        }

        function A(a) {
            var b = a.data.event,
                c = a.data.timer,
                d = i(a.changedTouches, b.identifier);
            d && (B(b), D(b, c))
        }

        function B(a) {
            K(document, "." + a.identifier, z), K(document, "." + a.identifier, A)
        }

        function C(a, b, c) {
            var d = c - a.timeStamp;
            a.type = "move", a.distX = b.pageX - a.startX, a.distY = b.pageY - a.startY, a.deltaX = b.pageX - a.pageX, a.deltaY = b.pageY - a.pageY, a.velocityX = .3 * a.velocityX + .7 * a.deltaX / d, a.velocityY = .3 * a.velocityY + .7 * a.deltaY / d, a.pageX = b.pageX, a.pageY = b.pageY
        }

        function D(a, b, c) {
            b.end(function () {
                return a.type = "moveend", L(a.target, a), c && c()
            })
        }

        function E() {
            return J(this, "movestart.move", u), !0
        }

        function F() {
            return K(this, "dragstart drag", f), K(this, "mousedown touchstart", g), K(this, "movestart", u), !0
        }

        function G(a) {
            "move" !== a.namespace && "moveend" !== a.namespace && (J(this, "dragstart." + a.guid + " drag." + a.guid, f, b, a.selector), J(this, "mousedown." + a.guid, g, b, a.selector))
        }

        function H(a) {
            "move" !== a.namespace && "moveend" !== a.namespace && (K(this, "dragstart." + a.guid + " drag." + a.guid), K(this, "mousedown." + a.guid))
        }
        var I = 6,
            J = a.event.add,
            K = a.event.remove,
            L = function (b, c, d) {
                a.event.trigger(c, d, b)
            },
            M = function () {
                return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (a) {
                    return window.setTimeout(function () {
                        a()
                    }, 25)
                }
            }(),
            N = {
                textarea: !0,
                input: !0,
                select: !0,
                button: !0
            },
            O = {
                move: "mousemove",
                cancel: "mouseup dragstart",
                end: "mouseup"
            },
            P = {
                move: "touchmove",
                cancel: "touchend",
                end: "touchend"
            };
        a.event.special.movestart = {
            setup: E,
            teardown: F,
            add: G,
            remove: H,
            _default: function (a) {
                function d() {
                    C(f, g.touch, g.timeStamp), L(a.target, f)
                }
                var f, g;
                a._handled() && (f = {
                    target: a.target,
                    startX: a.startX,
                    startY: a.startY,
                    pageX: a.pageX,
                    pageY: a.pageY,
                    distX: a.distX,
                    distY: a.distY,
                    deltaX: a.deltaX,
                    deltaY: a.deltaY,
                    velocityX: a.velocityX,
                    velocityY: a.velocityY,
                    timeStamp: a.timeStamp,
                    identifier: a.identifier,
                    targetTouches: a.targetTouches,
                    finger: a.finger
                }, g = {
                    event: f,
                    timer: new c(d),
                    touch: b,
                    timeStamp: b
                }, a.identifier === b ? (J(a.target, "click", e), J(document, O.move, w, g), J(document, O.end, x, g)) : (a._preventTouchmoveDefault(), J(document, P.move + "." + a.identifier, z, g), J(document, P.end + "." + a.identifier, A, g)))
            }
        }, a.event.special.move = {
            setup: function () {
                J(this, "movestart.move", a.noop)
            },
            teardown: function () {
                K(this, "movestart.move", a.noop)
            }
        }, a.event.special.moveend = {
            setup: function () {
                J(this, "movestart.moveend", a.noop)
            },
            teardown: function () {
                K(this, "movestart.moveend", a.noop)
            }
        }, J(document, "mousedown.move", k), J(document, "touchstart.move", o), "function" == typeof Array.prototype.indexOf && ! function (a) {
            for (var b = ["changedTouches", "targetTouches"], c = b.length; c--;) - 1 === a.event.props.indexOf(b[c]) && a.event.props.push(b[c])
        }(a)
    }), window.WYSIWYGModernizr = function (a, b, c) {
        function d(a) {
            n.cssText = a
        }

        function e(a, b) {
            return typeof a === b
        }
        var f, g, h, i = "2.7.1",
            j = {},
            k = b.documentElement,
            l = "modernizr",
            m = b.createElement(l),
            n = m.style,
            o = ({}.toString, " -webkit- -moz- -o- -ms- ".split(" ")),
            p = {},
            q = [],
            r = q.slice,
            s = function (a, c, d, e) {
                var f, g, h, i, j = b.createElement("div"),
                    m = b.body,
                    n = m || b.createElement("body");
                if (parseInt(d, 10))
                    for (; d--;) h = b.createElement("div"), h.id = e ? e[d] : l + (d + 1), j.appendChild(h);
                return f = ["&#173;", '<style id="s', l, '">', a, "</style>"].join(""), j.id = l, (m ? j : n).innerHTML += f, n.appendChild(j), m || (n.style.background = "", n.style.overflow = "hidden", i = k.style.overflow, k.style.overflow = "hidden", k.appendChild(n)), g = c(j, a), m ? j.parentNode.removeChild(j) : (n.parentNode.removeChild(n), k.style.overflow = i), !!g
            },
            t = function (b) {
                var c = a.matchMedia || a.msMatchMedia;
                if (c) return c(b).matches;
                var d;
                return s("@media " + b + " { #" + l + " { position: absolute; } }", function (b) {
                    d = "absolute" == (a.getComputedStyle ? getComputedStyle(b, null) : b.currentStyle).position
                }), d
            },
            u = {}.hasOwnProperty;
        h = e(u, "undefined") || e(u.call, "undefined") ? function (a, b) {
            return b in a && e(a.constructor.prototype[b], "undefined")
        } : function (a, b) {
            return u.call(a, b)
        }, Function.prototype.bind || (Function.prototype.bind = function (a) {
            var b = this;
            if ("function" != typeof b) throw new TypeError;
            var c = r.call(arguments, 1),
                d = function () {
                    if (this instanceof d) {
                        var e = function () {};
                        e.prototype = b.prototype;
                        var f = new e,
                            g = b.apply(f, c.concat(r.call(arguments)));
                        return Object(g) === g ? g : f
                    }
                    return b.apply(a, c.concat(r.call(arguments)))
                };
            return d
        }), p.touch = function () {
            var c;
            return "ontouchstart" in a || a.DocumentTouch && b instanceof DocumentTouch ? c = !0 : s(["@media (", o.join("touch-enabled),("), l, ")", "{#modernizr{top:9px;position:absolute}}"].join(""), function (a) {
                c = 9 === a.offsetTop
            }), c
        };
        for (var v in p) h(p, v) && (g = v.toLowerCase(), j[g] = p[v](), q.push((j[g] ? "" : "no-") + g));
        return j.addTest = function (a, b) {
            if ("object" == typeof a)
                for (var d in a) h(a, d) && j.addTest(d, a[d]);
            else {
                if (a = a.toLowerCase(), j[a] !== c) return j;
                b = "function" == typeof b ? b() : b, "undefined" != typeof enableClasses && enableClasses && (k.className += " " + (b ? "" : "no-") + a), j[a] = b
            }
            return j
        }, d(""), m = f = null, j._version = i, j._prefixes = o, j.mq = t, j.testStyles = s, j
    }(this, this.document),
    function (a) {
        (jQuery.browser = jQuery.browser || {}).mobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|pad|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))
    }(navigator.userAgent || navigator.vendor || window.opera);