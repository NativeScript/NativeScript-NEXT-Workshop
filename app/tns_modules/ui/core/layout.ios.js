var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var geometry = require("utils/geometry");
var common = require("ui/core/layout-common");
var trace = require("trace");
var enums = require("ui/enums");
require("utils/module-merge").merge(common, exports);
var LayoutInfo = (function (_super) {
    __extends(LayoutInfo, _super);
    function LayoutInfo(view) {
        _super.call(this, view);
        this.desiredSize = geometry.Size.zero;
        this.renderSize = geometry.Size.zero;
        this.needsClipBounds = false;
        this.visualOffset = geometry.Point.zero;
        this.isLayoutSuspended = true;
        this.neverMeasured = true;
        this.measureDirty = true;
        this.neverArranged = true;
        this.arrangeDirty = true;
        this.measureInProgress = false;
        this.arrangeInProgress = false;
        this.previousAvailableSize = geometry.Size.empty;
        this.treeLevel = 0;
    }
    Object.defineProperty(LayoutInfo.prototype, "isMeasureValid", {
        get: function () {
            return !this.measureDirty;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayoutInfo.prototype, "isArrangeValid", {
        get: function () {
            return !this.arrangeDirty;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayoutInfo.prototype, "nativeView", {
        get: function () {
            return this.view._nativeView;
        },
        enumerable: true,
        configurable: true
    });
    LayoutInfo.prototype.suspendLayoutDispatching = function () {
        LayoutManager.current.suspendLayoutDispatching();
    };
    LayoutInfo.prototype.resumeLayoutDispatching = function () {
        LayoutManager.current.resumeLayoutDispatching();
    };
    LayoutInfo.prototype.invalidateMeasure = function () {
        if (!this.measureDirty && !this.measureInProgress) {
            if (!this.neverMeasured) {
                var manager = LayoutManager.current;
                manager.measureQueue.add(this);
            }
            this.invalidateMeasureInternal();
        }
    };
    LayoutInfo.prototype.invalidateMeasureInternal = function () {
        this.measureDirty = true;
    };
    LayoutInfo.prototype.invalidateArrange = function () {
        if (!this.arrangeDirty && !this.arrangeInProgress) {
            if (!this.neverArranged) {
                var manager = LayoutManager.current;
                manager.arrangeQueue.add(this);
            }
            this.invalidateArrangeInternal();
        }
    };
    LayoutInfo.prototype.invalidateArrangeInternal = function () {
        this.arrangeDirty = true;
    };
    LayoutInfo.prototype.measure = function (availableSize) {
        trace.write("Measure: " + this.view + " with: " + availableSize, trace.categories.Layout);
        var width = availableSize.width;
        var height = availableSize.height;
        if (isNaN(width) || isNaN(height)) {
            throw new Error("Layout NaN measure.");
        }
        var manager = LayoutManager.current;
        var measureWithSameSize = geometry.Size.equals(availableSize, this.previousAvailableSize);
        if (!this.isVisible || this.isLayoutSuspended) {
            if (this.measureRequest) {
                manager.measureQueue.remove(this);
            }
            if (!measureWithSameSize) {
                this.invalidateMeasureInternal();
                this.previousAvailableSize = new geometry.Size(availableSize.width, availableSize.height);
            }
            return;
        }
        var previousDesiredSize = this.desiredSize;
        var size = geometry.Size.zero;
        if (!this.isMeasureValid || this.neverMeasured || !measureWithSameSize) {
            this.neverMeasured = false;
            this.invalidateArrange();
            this.measureInProgress = true;
            var gotException = true;
            try {
                manager.enterMeasure();
                size = this.measureCore(availableSize);
                gotException = false;
            }
            finally {
                this.measureInProgress = false;
                this.previousAvailableSize = new geometry.Size(availableSize.width, availableSize.height);
                manager.exitMeasure();
                if (gotException && !manager.lastExceptionElement) {
                    manager.lastExceptionElement = this;
                }
            }
            width = size.width;
            height = size.height;
            if (!isFinite(width) || !isFinite(height) || isNaN(width) || isNaN(height)) {
                throw new Error("Layout Infinity/NaN returned.");
            }
            this.measureDirty = false;
            if (this.measureRequest) {
                manager.measureQueue.remove(this);
            }
            trace.write(this.view + " - DesiredSize = " + size, trace.categories.Layout);
            this.desiredSize = size;
            if (!geometry.Size.equals(previousDesiredSize, size)) {
                this.notifyDesiredSizeChanged();
            }
        }
    };
    LayoutInfo.prototype.measureCore = function (availableSize) {
        var margin = this.margin;
        var horizontalMargin = (margin) ? margin.left + margin.right : 0.0;
        var verticalMargin = (margin) ? margin.top + margin.bottom : 0.0;
        var mm = new common.MinMax(this);
        var frameworkAvailableSize = new geometry.Size(Math.max(availableSize.width - horizontalMargin, 0), Math.max(availableSize.height - verticalMargin, 0));
        frameworkAvailableSize.width = Math.max(mm.minWidth, Math.min(frameworkAvailableSize.width, mm.maxWidth));
        frameworkAvailableSize.height = Math.max(mm.minHeight, Math.min(frameworkAvailableSize.height, mm.maxHeight));
        var desiredSize = this.view._measureOverride(frameworkAvailableSize);
        desiredSize.width = Math.max(desiredSize.width, mm.minWidth);
        desiredSize.height = Math.max(desiredSize.height, mm.minHeight);
        var clipped = false;
        if (desiredSize.width > mm.maxWidth) {
            desiredSize.width = mm.maxWidth;
            clipped = true;
        }
        if (desiredSize.height > mm.maxHeight) {
            desiredSize.height = mm.maxHeight;
            clipped = true;
        }
        var desiredWidth = desiredSize.width + horizontalMargin;
        var desiredHeight = desiredSize.height + verticalMargin;
        if (desiredWidth > availableSize.width) {
            desiredWidth = availableSize.width;
            clipped = true;
        }
        if (desiredHeight > availableSize.height) {
            desiredHeight = availableSize.height;
            clipped = true;
        }
        if (clipped || desiredWidth < 0 || desiredHeight < 0) {
            this.unclippedDesiredSize = new geometry.Size(desiredSize.width, desiredSize.height);
        }
        else {
            this.unclippedDesiredSize = undefined;
        }
        desiredSize.width = Math.max(0.0, desiredWidth);
        desiredSize.height = Math.max(0.0, desiredHeight);
        return desiredSize;
    };
    LayoutInfo.prototype.notifyDesiredSizeChanged = function () {
        var parent = this.parent;
        if (parent && !(parent._layoutInfo).measureInProgress) {
            parent._onSubviewDesiredSizeChanged();
        }
    };
    LayoutInfo.prototype.isRenderable = function () {
        if (this.neverMeasured || this.neverArranged || !this.isVisible) {
            return false;
        }
        return this.isMeasureValid && this.isArrangeValid;
    };
    LayoutInfo.prototype.arrange = function (finalRect) {
        trace.write("Arrange: " + this.view + " with: " + finalRect, trace.categories.Layout);
        var finalSize = finalRect.size;
        if (!isFinite(finalSize.width) || !isFinite(finalSize.height) || isNaN(finalSize.width) || isNaN(finalSize.height)) {
            throw new Error("Layout Infinity/NaN in Arrange is not allowed.");
        }
        var manager = LayoutManager.current;
        if (!this.isVisible || this.isLayoutSuspended) {
            if (this.arrangeRequest) {
                manager.arrangeQueue.remove(this);
            }
            this.finalRect = new geometry.Rect(finalRect.x, finalRect.y, finalRect.width, finalRect.height);
            return;
        }
        if (this.measureDirty) {
            this.measure(this.previousAvailableSize);
        }
        else if (this.neverMeasured) {
            this.measure(finalSize);
        }
        if (this.arrangeDirty || this.neverArranged || !geometry.Rect.equals(this.finalRect, finalRect)) {
            this.neverArranged = false;
            this.arrangeInProgress = true;
            var gotException = true;
            try {
                manager.enterArrange();
                this.arrangeCore(finalRect);
                gotException = false;
            }
            finally {
                this.arrangeInProgress = false;
                manager.exitArrange();
                if (gotException && !manager.lastExceptionElement) {
                    manager.lastExceptionElement = this;
                }
            }
            this.finalRect = new geometry.Rect(finalRect.x, finalRect.y, finalRect.width, finalRect.height);
            this.arrangeDirty = false;
            if (this.arrangeRequest) {
                manager.arrangeQueue.remove(this);
            }
            if (this.isRenderable()) {
                this.view._setBounds(new geometry.Rect(this.visualOffset.x, this.visualOffset.y, this.renderSize.width, this.renderSize.height));
            }
        }
    };
    LayoutInfo.prototype.arrangeCore = function (finalRect) {
        var needsClipBounds = false;
        var arrangeSize = finalRect.size;
        var margin = this.margin;
        var marginWidth = (margin) ? margin.left + margin.right : 0;
        var marginHeight = (margin) ? margin.top + margin.bottom : 0;
        arrangeSize.width = Math.max(0.0, arrangeSize.width - marginWidth);
        arrangeSize.height = Math.max(0.0, arrangeSize.height - marginHeight);
        var unclippedDS = (this.unclippedDesiredSize) ? this.unclippedDesiredSize : new geometry.Size(Math.max(0.0, this.desiredSize.width - marginWidth), Math.max(0.0, this.desiredSize.height - marginHeight));
        if (arrangeSize.width < unclippedDS.width) {
            needsClipBounds = true;
            arrangeSize.width = unclippedDS.width;
        }
        if (arrangeSize.height < unclippedDS.height) {
            needsClipBounds = true;
            arrangeSize.height = unclippedDS.height;
        }
        if (this.horizontalAlignment !== enums.HorizontalAlignment.stretch) {
            arrangeSize.width = unclippedDS.width;
        }
        if (this.verticalAlignment !== enums.VerticalAlignment.stretch) {
            arrangeSize.height = unclippedDS.height;
        }
        var max = new common.MinMax(this);
        var effectiveMaxWidth = Math.max(unclippedDS.width, max.maxWidth);
        if (effectiveMaxWidth < arrangeSize.width) {
            needsClipBounds = true;
            arrangeSize.width = effectiveMaxWidth;
        }
        var effectiveMaxHeight = Math.max(unclippedDS.height, max.maxHeight);
        if (effectiveMaxHeight < arrangeSize.height) {
            needsClipBounds = true;
            arrangeSize.height = effectiveMaxHeight;
        }
        this.view._arrangeOverride(new geometry.Size(arrangeSize.width, arrangeSize.height));
        this.renderSize = arrangeSize;
        var width = Math.min(arrangeSize.width, max.maxWidth);
        var height = Math.min(arrangeSize.height, max.maxHeight);
        needsClipBounds = needsClipBounds || width < arrangeSize.width || height < arrangeSize.height;
        var finalSize = finalRect.size;
        var constrained = new geometry.Size(Math.max(0.0, finalSize.width - marginWidth), Math.max(0.0, finalSize.height - marginHeight));
        needsClipBounds = needsClipBounds || constrained.width < width || constrained.height < height;
        this.needsClipBounds = needsClipBounds;
        var offset = this.computeAlignmentOffset(constrained, new geometry.Size(width, height));
        offset.x += finalRect.x + margin.left;
        offset.y += finalRect.y + margin.top;
        this.visualOffset = offset;
    };
    LayoutInfo.prototype.computeAlignmentOffset = function (clientSize, renderSize) {
        var point = geometry.Point.zero;
        var horizontalAlignment = this.horizontalAlignment;
        if (horizontalAlignment === enums.HorizontalAlignment.stretch && renderSize.width > clientSize.width) {
            horizontalAlignment = enums.HorizontalAlignment.left;
        }
        var verticalAlignment = this.verticalAlignment;
        if (verticalAlignment === enums.VerticalAlignment.stretch && renderSize.height > clientSize.height) {
            verticalAlignment = enums.VerticalAlignment.top;
        }
        switch (horizontalAlignment) {
            case enums.HorizontalAlignment.center:
            case enums.HorizontalAlignment.stretch:
                point.x = (clientSize.width - renderSize.width) / 2;
                break;
            case enums.HorizontalAlignment.right:
                point.x = clientSize.width - renderSize.width;
                break;
            default:
                break;
        }
        switch (verticalAlignment) {
            case enums.VerticalAlignment.center:
            case enums.VerticalAlignment.stretch:
                point.y = (clientSize.height - renderSize.height) / 2;
                break;
            case enums.VerticalAlignment.bottom:
                point.y = clientSize.height - renderSize.height;
                break;
            default:
                break;
        }
        return point;
    };
    LayoutInfo.prototype.updateLayout = function () {
        var frame = this.view._getBounds();
        if (frame) {
            this.view._setBounds(frame);
        }
        LayoutManager.current.updateLayout();
    };
    LayoutInfo.propagateResumeLayout = function (parent, layout) {
        var parentIsSuspended = parent ? parent.isLayoutSuspended : false;
        if (parentIsSuspended) {
            return;
        }
        var parentTreeLevel = parent ? parent.treeLevel : 0;
        layout.treeLevel = parentTreeLevel + 1;
        layout.isLayoutSuspended = false;
        var requireMeasureUpdate = layout.measureDirty && !layout.neverMeasured && !layout.measureRequest;
        var requireArrangeUpdate = layout.arrangeDirty && !layout.neverArranged && !layout.arrangeRequest;
        var manager = LayoutManager.current;
        if (requireMeasureUpdate) {
            manager.measureQueue.add(layout);
        }
        if (requireArrangeUpdate) {
            manager.arrangeQueue.add(layout);
        }
        var parentLayout = layout;
        var forEachChild = function (subView) {
            var childLayout = subView._layoutInfo;
            LayoutInfo.propagateResumeLayout(parentLayout, childLayout);
            return true;
        };
        layout.view._eachChildView(forEachChild);
    };
    LayoutInfo.propagateSuspendLayout = function (layout) {
        if (layout.isLayoutSuspended) {
            return;
        }
        layout.isLayoutSuspended = true;
        layout.treeLevel = 0;
        var forEachChild = function (subView) {
            var childLayout = subView._layoutInfo;
            LayoutInfo.propagateSuspendLayout(childLayout);
            return true;
        };
        layout.view._eachChildView(forEachChild);
    };
    return LayoutInfo;
})(common.LayoutInfoBase);
exports.LayoutInfo = LayoutInfo;
var Request = (function () {
    function Request() {
    }
    return Request;
})();
exports.Request = Request;
var LayoutQueue = (function () {
    function LayoutQueue() {
        this.head = undefined;
        this.pocket = undefined;
        for (var i = 0; i < LayoutQueue.PocketCapacity; i++) {
            var request = new Request();
            request.next = this.pocket;
            this.pocket = request;
        }
        this.pocketSize = LayoutQueue.PocketCapacity;
    }
    LayoutQueue.prototype.addRequest = function (element) {
        var r = this.getNewRequest(element);
        if (r) {
            r.next = this.head;
            if (this.head) {
                this.head.prev = r;
            }
            this.head = r;
            this.setRequest(element, r);
        }
    };
    LayoutQueue.prototype.getNewRequest = function (element) {
        var request;
        if (this.pocket) {
            request = this.pocket;
            this.pocket = request.next;
            this.pocketSize--;
            request.prev = null;
            request.next = null;
        }
        else {
            var manager = LayoutManager.current;
            try {
                request = new Request();
            }
            catch (e) {
                if (!request && manager) {
                    manager.setForceLayout(element);
                }
                throw new Error("out of memory");
            }
        }
        request.target = element;
        return request;
    };
    LayoutQueue.prototype.removeRequest = function (entry) {
        if (!entry.prev) {
            this.head = entry.next;
        }
        else {
            entry.prev.next = entry.next;
        }
        if (entry.next) {
            entry.next.prev = entry.prev;
        }
        this.reuseRequest(entry);
    };
    LayoutQueue.prototype.add = function (element) {
        if (this.getRequest(element)) {
            return;
        }
        if (element.isLayoutSuspended) {
            return;
        }
        this.removeOrphans(element);
        var parent = LayoutQueue.getParentLayoutInfo(element);
        if (parent && this.canRelyOnParentRecalc(parent)) {
            return;
        }
        var manager = LayoutManager.current;
        if (this.pocketSize > LayoutQueue.PocketReserve) {
            this.addRequest(element);
        }
        else {
            while (element) {
                var p = LayoutQueue.getParentLayoutInfo(element);
                this.invalidate(element);
                if (p && p.isVisible) {
                    this.remove(element);
                }
                else if (!this.getRequest(element)) {
                    this.removeOrphans(element);
                    this.addRequest(element);
                }
                element = p;
            }
        }
        manager.needsRecalc();
    };
    LayoutQueue.prototype.canRelyOnParentRecalc = function (parent) {
        throw new Error("Must be overriden!");
        return false;
    };
    LayoutQueue.prototype.getRequest = function (element) {
        throw new Error("Must be overriden!");
        return null;
    };
    LayoutQueue.prototype.setRequest = function (element, request) {
        throw new Error("Must be overriden!");
    };
    LayoutQueue.prototype.invalidate = function (element) {
        throw new Error("Must be overriden!");
    };
    LayoutQueue.prototype.getTopMost = function () {
        var target = null;
        var maxValue = Number.MAX_VALUE;
        for (var request = this.head; request; request = request.next) {
            var treeLevel = request.target.treeLevel;
            if (treeLevel < maxValue) {
                maxValue = treeLevel;
                target = request.target;
            }
        }
        return target;
    };
    LayoutQueue.getParentLayoutInfo = function (element) {
        var parent = element.parent;
        if (parent) {
            return parent._layoutInfo;
        }
        return null;
    };
    LayoutQueue.prototype.remove = function (element) {
        var request = this.getRequest(element);
        if (request) {
            this.removeRequest(request);
            this.setRequest(element, null);
        }
    };
    LayoutQueue.prototype.removeOrphans = function (parent) {
        var request = this.head;
        var next;
        while (request) {
            var child = request.target;
            next = request.next;
            var parentTreeLevel = parent.treeLevel;
            if (child.treeLevel === (parentTreeLevel + 1) && LayoutQueue.getParentLayoutInfo(child) === parent) {
                this.remove(child);
            }
            request = next;
        }
    };
    LayoutQueue.prototype.reuseRequest = function (request) {
        request.target = null;
        if (this.pocketSize < LayoutQueue.PocketCapacity) {
            request.next = this.pocket;
            this.pocket = request;
            this.pocketSize++;
        }
    };
    LayoutQueue.prototype.isEmpty = function () {
        return !this.head;
    };
    LayoutQueue.PocketCapacity = 99;
    LayoutQueue.PocketReserve = 8;
    return LayoutQueue;
})();
var MeasureQueue = (function (_super) {
    __extends(MeasureQueue, _super);
    function MeasureQueue() {
        _super.apply(this, arguments);
    }
    MeasureQueue.prototype.canRelyOnParentRecalc = function (parent) {
        return parent.measureDirty && !parent.measureInProgress;
    };
    MeasureQueue.prototype.getRequest = function (layout) {
        return layout.measureRequest;
    };
    MeasureQueue.prototype.invalidate = function (layout) {
        layout.invalidateMeasureInternal();
    };
    MeasureQueue.prototype.setRequest = function (layout, request) {
        layout.measureRequest = request;
    };
    return MeasureQueue;
})(LayoutQueue);
var ArrangeQueue = (function (_super) {
    __extends(ArrangeQueue, _super);
    function ArrangeQueue() {
        _super.apply(this, arguments);
    }
    ArrangeQueue.prototype.canRelyOnParentRecalc = function (parent) {
        return parent.arrangeDirty && !parent.arrangeInProgress;
    };
    ArrangeQueue.prototype.getRequest = function (layout) {
        return layout.arrangeRequest;
    };
    ArrangeQueue.prototype.invalidate = function (layout) {
        layout.invalidateArrangeInternal();
    };
    ArrangeQueue.prototype.setRequest = function (layout, request) {
        layout.arrangeRequest = request;
    };
    return ArrangeQueue;
})(LayoutQueue);
var LayoutManager = (function () {
    function LayoutManager() {
        this.arrangeOnStack = 0;
        this.measureOnStack = 0;
        this.layoutRequestPosted = false;
        this.isUpdating = false;
        this.isInUpdateLayout = false;
        this.firePostLayoutEvents = false;
        this.gotException = false;
        this.measureQueue = new MeasureQueue();
        this.arrangeQueue = new ArrangeQueue();
    }
    LayoutManager.prototype.enterArrange = function () {
        this.lastExceptionElement = null;
        this.arrangeOnStack++;
        if (this.arrangeOnStack > LayoutManager.LayoutRecursionLimit) {
            throw new Error("LayoutManager_DeepRecursion");
        }
        this.firePostLayoutEvents = true;
    };
    LayoutManager.prototype.enterMeasure = function () {
        this.lastExceptionElement = null;
        this.measureOnStack++;
        if (this.measureOnStack > LayoutManager.LayoutRecursionLimit) {
            throw new Error("LayoutManager_DeepRecursion");
        }
        this.firePostLayoutEvents = true;
    };
    LayoutManager.prototype.exitArrange = function () {
        this.arrangeOnStack--;
    };
    LayoutManager.prototype.exitMeasure = function () {
        this.measureOnStack--;
    };
    LayoutManager.prototype.getArrangeRect = function (element) {
        var arrangeRect = element.finalRect;
        if (!element.parent) {
            if (element.previousAvailableSize.width === Number.POSITIVE_INFINITY) {
                arrangeRect.width = element.desiredSize.width;
            }
            if (element.previousAvailableSize.height === Number.POSITIVE_INFINITY) {
                arrangeRect.height = element.desiredSize.height;
            }
        }
        return arrangeRect;
    };
    LayoutManager.prototype.invalidateTreeIfRecovering = function () {
        if (this.forceLayoutElement || this.gotException) {
            if (this.forceLayoutElement) {
                this.markTreeDirty(this.forceLayoutElement);
            }
            this.forceLayoutElement = null;
            this.gotException = false;
        }
    };
    LayoutManager.prototype.markTreeDirty = function (element) {
        while (true) {
            var parentLayoutInfo = LayoutQueue.getParentLayoutInfo(element);
            if (!parentLayoutInfo) {
                break;
            }
            element = parentLayoutInfo;
        }
        LayoutManager.markTreeDirtyHelper(element);
        this.measureQueue.add(element);
        this.arrangeQueue.add(element);
    };
    LayoutManager.markTreeDirtyHelper = function (element) {
        if (element) {
            element.invalidateMeasureInternal();
            element.invalidateArrangeInternal();
        }
        var forEachChild = function (subView) {
            var childLayout = subView._layoutInfo;
            LayoutManager.markTreeDirtyHelper(childLayout);
            return true;
        };
        element.view._eachChildView(forEachChild);
    };
    LayoutManager.prototype.needsRecalc = function () {
        if (!this.layoutRequestPosted && !this.isUpdating) {
            UIApplication.sharedApplication().keyWindow.setNeedsLayout();
            trace.write("Layout dispatched", trace.categories.Layout);
            this.layoutRequestPosted = true;
        }
    };
    LayoutManager.prototype.setForceLayout = function (element) {
        this.forceLayoutElement = element;
    };
    LayoutManager.prototype.updateLayout = function () {
        if (this.isInUpdateLayout || this.measureOnStack > 0 || this.arrangeOnStack > 0) {
            return;
        }
        var gotException = true;
        var currentElement = null;
        try {
            this.invalidateTreeIfRecovering();
            while (this.hasDirtyness() || this.firePostLayoutEvents) {
                this.isUpdating = true;
                this.isInUpdateLayout = true;
                while (true) {
                    currentElement = this.measureQueue.getTopMost();
                    if (!currentElement) {
                        break;
                    }
                    currentElement.measure(currentElement.previousAvailableSize);
                }
                while (this.measureQueue.isEmpty()) {
                    currentElement = this.arrangeQueue.getTopMost();
                    if (!currentElement) {
                        break;
                    }
                    var finalRect = this.getArrangeRect(currentElement);
                    currentElement.arrange(finalRect);
                }
                if (!this.measureQueue.isEmpty()) {
                    continue;
                }
                this.isInUpdateLayout = false;
                if (!this.hasDirtyness()) {
                    this.firePostLayoutEvents = false;
                }
            }
            currentElement = null;
            gotException = false;
        }
        finally {
            this.isUpdating = false;
            this.isInUpdateLayout = false;
            this.layoutRequestPosted = false;
            if (gotException) {
                this.gotException = true;
                this.forceLayoutElement = currentElement;
            }
        }
    };
    LayoutManager.prototype.hasDirtyness = function () {
        if (this.measureQueue.isEmpty()) {
            return !this.arrangeQueue.isEmpty();
        }
        return true;
    };
    LayoutManager.prototype.suspendLayoutDispatching = function () {
        this.isUpdating = true;
    };
    LayoutManager.prototype.resumeLayoutDispatching = function () {
        this.isUpdating = false;
    };
    LayoutManager.LayoutRecursionLimit = 0x100;
    LayoutManager.current = new LayoutManager();
    return LayoutManager;
})();
