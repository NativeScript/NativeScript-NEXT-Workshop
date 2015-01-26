var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var geometry = require("utils/geometry");
var containers = require("utils/containers");
var view = require("ui/core/view");
var panel = require("ui/panels/panel");
var definition = require("ui/panels/grid-panel");
var bm = require("ui/core/bindable");
var observable = require("ui/core/dependency-observable");
var utils = require("utils/utils");
var types = require("utils/types");
var numberUtils = require("utils/number-utils");
var ComparerHelper = (function () {
    function ComparerHelper(x, y) {
        this.x = x;
        this.y = y;
    }
    return ComparerHelper;
})();
function CompareNullRefs(helper) {
    var x = helper.x;
    var y = helper.y;
    helper.result = 2;
    if (!x) {
        if (!y) {
            helper.result = 0;
        }
        else {
            helper.result = -1;
        }
    }
    else if (!y) {
        helper.result = 1;
    }
    return (helper.result !== 2);
}
function compareNumbers(x, y) {
    return x - y;
}
function compareSpanPreferredDistributionOrder(x, y) {
    var helper = new ComparerHelper(x, y);
    if (CompareNullRefs(helper)) {
        return helper.result;
    }
    if (x.userSize.isAuto) {
        if (y.userSize.isAuto) {
            return compareNumbers(x.minSize, y.minSize);
        }
        return -1;
    }
    if (y.userSize.isAuto) {
        return 1;
    }
    return compareNumbers(x.preferredSize, y.preferredSize);
}
function compareSpanMaxDistributionOrder(x, y) {
    var helper = new ComparerHelper(x, y);
    if (CompareNullRefs(helper)) {
        return helper.result;
    }
    if (x.userSize.isAuto) {
        if (y.userSize.isAuto) {
            return compareNumbers(x.sizeCache, y.sizeCache);
        }
        return 1;
    }
    if (y.userSize.isAuto) {
        return -1;
    }
    return compareNumbers(x.sizeCache, y.sizeCache);
}
function compareStarDistributionOrder(x, y) {
    var helper = new ComparerHelper(x, y);
    if (!CompareNullRefs(helper)) {
        helper.result = compareNumbers(x.sizeCache, y.sizeCache);
    }
    return helper.result;
}
function getDistributionOrderIndexCompareFn(definitions) {
    var compareFn = function (x, y) {
        var definitionX = definitions[x];
        var definitionY = definitions[y];
        var helper = new ComparerHelper(definitionX, definitionY);
        if (!CompareNullRefs(helper)) {
            var xprime = definitionX.sizeCache - definitionX.minSize;
            var yprime = definitionY.sizeCache - definitionY.minSize;
            helper.result = compareNumbers(xprime, yprime);
        }
        return helper.result;
    };
    return compareFn;
}
function getStarDistributionOrderIndexCompareFn(definitions) {
    var comareFn = function (x, y) {
        var definitionX = definitions[x];
        var definitionY = definitions[y];
        var helper = new ComparerHelper(definitionX, definitionY);
        if (!CompareNullRefs(helper)) {
            helper.result = compareNumbers(definitionX.sizeCache, definitionY.sizeCache);
        }
        return helper.result;
    };
    return comareFn;
}
var DefinitionBase = (function (_super) {
    __extends(DefinitionBase, _super);
    function DefinitionBase(isColumnDefinition) {
        _super.call(this);
        this._isColumnDefinition = isColumnDefinition;
        this.finalOffset = 0;
        this.measureSize = 0;
        this.minSize = 0;
        this.index = -1;
        this.sizeCache = 0;
        this.sizeType = LayoutTimeSizeType.None;
    }
    DefinitionBase.IsUserMaxSizePropertyValueValid = function (value) {
        return !isNaN(value) && (value >= 0.0);
    };
    DefinitionBase.IsUserMinSizePropertyValueValid = function (value) {
        return !isNaN(value) && (value >= 0.0) && (value !== Number.POSITIVE_INFINITY);
    };
    DefinitionBase.IsUserSizePropertyValueValid = function (value) {
        return value.value >= 0.0;
    };
    DefinitionBase.OnUserMaxSizePropertyChanged = function (data) {
        var definitionBase = data.object;
        if (definitionBase.inParentLogicalTree) {
            definitionBase.parent._invalidateMeasure();
        }
    };
    DefinitionBase.OnUserMinSizePropertyChanged = function (data) {
        var definitionBase = data.object;
        if (definitionBase.inParentLogicalTree) {
            definitionBase.parent._invalidateMeasure();
        }
    };
    DefinitionBase.OnUserSizePropertyChanged = function (data) {
        var definitionBase = data.object;
        if (definitionBase.inParentLogicalTree) {
            var parent = definitionBase.parent;
            var oldValue = data.oldValue;
            var newValue = data.newValue;
            if (oldValue.gridUnitType !== newValue.gridUnitType) {
                parent.invalidate();
            }
            else {
                parent._invalidateMeasure();
            }
        }
    };
    DefinitionBase.prototype.onBeforeLayout = function (grid) {
        this.minSize = 0.0;
    };
    DefinitionBase.prototype.onEnterParentTree = function () {
    };
    DefinitionBase.prototype.onExitParentTree = function () {
        this.finalOffset = 0.0;
    };
    DefinitionBase.prototype.updateMinSize = function (minSize) {
        this.minSize = Math.max(this.minSize, minSize);
    };
    Object.defineProperty(DefinitionBase.prototype, "inParentLogicalTree", {
        get: function () {
            return (this.index !== -1);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefinitionBase.prototype, "preferredSize", {
        get: function () {
            var preferredSize = this.minSize;
            if (this.sizeType !== LayoutTimeSizeType.Auto && preferredSize < this.measureSize) {
                preferredSize = this.measureSize;
            }
            return preferredSize;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefinitionBase.prototype, "userMaxSize", {
        get: function () {
            return this.userMaxSizeValueCache;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefinitionBase.prototype, "userMaxSizeValueCache", {
        get: function () {
            return this._getValue(this._isColumnDefinition ? ColumnDefinition.MaxWidthProperty : RowDefinition.MaxHeightProperty);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefinitionBase.prototype, "userMinSize", {
        get: function () {
            return this.userMinSizeValueCache;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefinitionBase.prototype, "userMinSizeValueCache", {
        get: function () {
            return this._getValue(this._isColumnDefinition ? ColumnDefinition.MinWidthProperty : RowDefinition.MinHeightProperty);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefinitionBase.prototype, "userSize", {
        get: function () {
            return this.userSizeValueCache;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefinitionBase.prototype, "userSizeValueCache", {
        get: function () {
            return this._getValue(this._isColumnDefinition ? ColumnDefinition.WidthProperty : RowDefinition.HeightProperty);
        },
        enumerable: true,
        configurable: true
    });
    return DefinitionBase;
})(bm.Bindable);
exports.DefinitionBase = DefinitionBase;
var GridUnitType = (function () {
    function GridUnitType() {
    }
    GridUnitType.auto = 0;
    GridUnitType.pixel = 1;
    GridUnitType.star = 2;
    return GridUnitType;
})();
exports.GridUnitType = GridUnitType;
var GridLength = (function () {
    function GridLength(value, type) {
        this._value = value;
        this._unitType = type;
    }
    GridLength.equals = function (value1, value2) {
        return (value1.gridUnitType === value2.gridUnitType) && (value1.value === value2.value);
    };
    Object.defineProperty(GridLength.prototype, "gridUnitType", {
        get: function () {
            return this._unitType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridLength.prototype, "isAbsolute", {
        get: function () {
            return this._unitType === GridUnitType.pixel;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridLength.prototype, "isAuto", {
        get: function () {
            return this._unitType === GridUnitType.auto;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridLength.prototype, "isStar", {
        get: function () {
            return this._unitType === GridUnitType.star;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridLength.prototype, "value", {
        get: function () {
            return this._value;
        },
        enumerable: true,
        configurable: true
    });
    GridLength.auto = new GridLength(1, definition.GridUnitType.auto);
    return GridLength;
})();
exports.GridLength = GridLength;
var ColumnDefinition = (function (_super) {
    __extends(ColumnDefinition, _super);
    function ColumnDefinition() {
        _super.call(this, true);
    }
    Object.defineProperty(ColumnDefinition.prototype, "actualWidth", {
        get: function () {
            var finalColumnDefinitionWidth = 0;
            if (this.inParentLogicalTree) {
                finalColumnDefinitionWidth = this.parent.getFinalColumnDefinitionWidth(this.index);
            }
            return finalColumnDefinitionWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColumnDefinition.prototype, "maxWidth", {
        get: function () {
            return this.userMaxSizeValueCache;
        },
        set: function (value) {
            this._setValue(ColumnDefinition.MaxWidthProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColumnDefinition.prototype, "minWidth", {
        get: function () {
            return this.userMinSizeValueCache;
        },
        set: function (value) {
            this._setValue(ColumnDefinition.MinWidthProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColumnDefinition.prototype, "width", {
        get: function () {
            return this.userSizeValueCache;
        },
        set: function (value) {
            this._setValue(ColumnDefinition.WidthProperty, convertGridLength(value));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ColumnDefinition.prototype, "offset", {
        get: function () {
            var finalOffset = 0.0;
            if (this.index !== 0) {
                finalOffset = this.finalOffset;
            }
            return finalOffset;
        },
        enumerable: true,
        configurable: true
    });
    ColumnDefinition.MaxWidthProperty = new observable.Property("MaxWidth", "ColumnDefinition", new observable.PropertyMetadata(1 / 0, observable.PropertyMetadataOptions.None, DefinitionBase.OnUserMaxSizePropertyChanged, DefinitionBase.IsUserMaxSizePropertyValueValid));
    ColumnDefinition.MinWidthProperty = new observable.Property("MinWidth", "ColumnDefinition", new observable.PropertyMetadata(0, observable.PropertyMetadataOptions.None, DefinitionBase.OnUserMinSizePropertyChanged, DefinitionBase.IsUserMinSizePropertyValueValid));
    ColumnDefinition.WidthProperty = new observable.Property("Width", "ColumnDefinition", new observable.PropertyMetadata(new GridLength(1, GridUnitType.star), observable.PropertyMetadataOptions.None, DefinitionBase.OnUserSizePropertyChanged, DefinitionBase.IsUserSizePropertyValueValid));
    return ColumnDefinition;
})(DefinitionBase);
exports.ColumnDefinition = ColumnDefinition;
var RowDefinition = (function (_super) {
    __extends(RowDefinition, _super);
    function RowDefinition() {
        _super.call(this, false);
    }
    Object.defineProperty(RowDefinition.prototype, "actualHeight", {
        get: function () {
            var finalRowDefinitionHeight = 0;
            if (this.inParentLogicalTree) {
                finalRowDefinitionHeight = this.parent.getFinalRowDefinitionHeight(this.index);
            }
            return finalRowDefinitionHeight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RowDefinition.prototype, "maxHeight", {
        get: function () {
            return this.userMaxSizeValueCache;
        },
        set: function (value) {
            this._setValue(RowDefinition.MaxHeightProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RowDefinition.prototype, "minHeight", {
        get: function () {
            return this.userMinSizeValueCache;
        },
        set: function (value) {
            this._setValue(RowDefinition.MinHeightProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RowDefinition.prototype, "height", {
        get: function () {
            return this.userSizeValueCache;
        },
        set: function (value) {
            this._setValue(RowDefinition.HeightProperty, convertGridLength(value));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RowDefinition.prototype, "offset", {
        get: function () {
            var finalOffset = 0.0;
            if (this.index !== 0) {
                finalOffset = this.finalOffset;
            }
            return finalOffset;
        },
        enumerable: true,
        configurable: true
    });
    RowDefinition.MaxHeightProperty = new observable.Property("MaxHeight", "RowDefinition", new observable.PropertyMetadata(1.0 / 0.0, observable.PropertyMetadataOptions.None, DefinitionBase.OnUserMaxSizePropertyChanged, DefinitionBase.IsUserMaxSizePropertyValueValid));
    RowDefinition.MinHeightProperty = new observable.Property("MinHeight", "RowDefinition", new observable.PropertyMetadata(0, observable.PropertyMetadataOptions.None, DefinitionBase.OnUserMinSizePropertyChanged, DefinitionBase.IsUserMinSizePropertyValueValid));
    RowDefinition.HeightProperty = new observable.Property("Height", "RowDefinition", new observable.PropertyMetadata(new GridLength(1, GridUnitType.star), observable.PropertyMetadataOptions.None, DefinitionBase.OnUserSizePropertyChanged, DefinitionBase.IsUserSizePropertyValueValid));
    return RowDefinition;
})(DefinitionBase);
exports.RowDefinition = RowDefinition;
var CellCache = (function () {
    function CellCache() {
    }
    Object.defineProperty(CellCache.prototype, "isStarU", {
        get: function () {
            return ((this.sizeTypeU & LayoutTimeSizeType.Star) !== 0);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CellCache.prototype, "IsAutoU", {
        get: function () {
            return ((this.sizeTypeU & LayoutTimeSizeType.Auto) !== 0);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CellCache.prototype, "isStarV", {
        get: function () {
            return ((this.sizeTypeV & LayoutTimeSizeType.Star) !== 0);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CellCache.prototype, "isAutoV", {
        get: function () {
            return ((this.sizeTypeV & LayoutTimeSizeType.Auto) !== 0);
        },
        enumerable: true,
        configurable: true
    });
    return CellCache;
})();
var ExtendedData = (function () {
    function ExtendedData() {
    }
    return ExtendedData;
})();
var Flags = (function () {
    function Flags() {
    }
    Flags.ArrangeOverrideInProgress = 0x80000;
    Flags.HasGroup3CellsInAutoRows = 0x20000;
    Flags.HasStarCellsU = 0x8000;
    Flags.HasStarCellsV = 0x10000;
    Flags.ListenToNotifications = 0x1000;
    Flags.MeasureOverrideInProgress = 0x40000;
    Flags.SizeToContentU = 0x2000;
    Flags.SizeToContentV = 0x4000;
    Flags.ValidCellsStructure = 4;
    Flags.ValidDefinitionsUStructure = 1;
    Flags.ValidDefinitionsVStructure = 2;
    return Flags;
})();
var LayoutTimeSizeType = (function () {
    function LayoutTimeSizeType() {
    }
    LayoutTimeSizeType.None = 0;
    LayoutTimeSizeType.Pixel = 1;
    LayoutTimeSizeType.Auto = 2;
    LayoutTimeSizeType.Star = 4;
    return LayoutTimeSizeType;
})();
var SpanKey = (function () {
    function SpanKey(start, count, u) {
        this._start = start;
        this._count = count;
        this._u = u;
    }
    SpanKey.prototype.equals = function (key) {
        return key._start === this._start && key._count === this._count && key._u === this._u;
    };
    Object.defineProperty(SpanKey.prototype, "hashCode", {
        get: function () {
            var num = this._start ^ (this._count << 2);
            if (this._u) {
                return (num & 0x7ffffff);
            }
            return (num | 0x8000000);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpanKey.prototype, "count", {
        get: function () {
            return this._count;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpanKey.prototype, "start", {
        get: function () {
            return this._start;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpanKey.prototype, "u", {
        get: function () {
            return this._u;
        },
        enumerable: true,
        configurable: true
    });
    return SpanKey;
})();
var SpanKeyEqualityComparer = (function () {
    function SpanKeyEqualityComparer() {
    }
    SpanKeyEqualityComparer.prototype.equals = function (x, y) {
        return x.equals(y);
    };
    SpanKeyEqualityComparer.prototype.getHashCode = function (obj) {
        return obj.hashCode;
    };
    return SpanKeyEqualityComparer;
})();
var knownCollections;
(function (knownCollections) {
    knownCollections.columnDefinitions = "columnDefinitions";
    knownCollections.rowDefinitions = "rowDefinitions";
})(knownCollections = exports.knownCollections || (exports.knownCollections = {}));
var GridPanel = (function (_super) {
    __extends(GridPanel, _super);
    function GridPanel(options) {
        _super.call(this);
        var i;
        if (options) {
            if (options.rows) {
                for (i = 0; i < options.rows.length; i++) {
                    var sourceRowDefinition = options.rows[i];
                    var rowDefinition = new RowDefinition();
                    utils.copyFrom(sourceRowDefinition, rowDefinition);
                    this.addRowDefinition(rowDefinition);
                }
            }
            if (options.columns) {
                for (i = 0; i < options.columns.length; i++) {
                    var sourceColumnDefinition = options.columns[i];
                    var columnDefinition = new ColumnDefinition();
                    utils.copyFrom(sourceColumnDefinition, columnDefinition);
                    this.addColumnDefinition(columnDefinition);
                }
            }
        }
    }
    GridPanel.prototype._addArrayFromBuilder = function (name, value) {
        var i;
        var colDefinition;
        var rowDefinition;
        if (name === knownCollections.columnDefinitions) {
            for (i = 0; i < value.length; i++) {
                colDefinition = value[i];
                this.addColumnDefinition(colDefinition);
            }
        }
        else if (name === knownCollections.rowDefinitions) {
            for (i = 0; i < value.length; i++) {
                rowDefinition = value[i];
                this.addRowDefinition(rowDefinition);
            }
        }
    };
    GridPanel.getColumn = function (element) {
        if (!element) {
            throw new Error("element cannot be null or undefinied.");
        }
        return element._getValue(GridPanel.ColumnProperty);
    };
    GridPanel.setColumn = function (element, value) {
        if (!element) {
            throw new Error("element cannot be null or undefinied.");
        }
        element._setValue(GridPanel.ColumnProperty, value);
    };
    GridPanel.getColumnSpan = function (element) {
        if (!element) {
            throw new Error("element cannot be null or undefinied.");
        }
        return element._getValue(GridPanel.ColumnSpanProperty);
    };
    GridPanel.setColumnSpan = function (element, value) {
        if (!element) {
            throw new Error("element cannot be null or undefinied.");
        }
        element._setValue(GridPanel.ColumnSpanProperty, value);
    };
    GridPanel.getRow = function (element) {
        if (!element) {
            throw new Error("element cannot be null or undefinied.");
        }
        return element._getValue(GridPanel.RowProperty);
    };
    GridPanel.setRow = function (element, value) {
        if (!element) {
            throw new Error("element cannot be null or undefinied.");
        }
        element._setValue(GridPanel.RowProperty, value);
    };
    GridPanel.getRowSpan = function (element) {
        if (!element) {
            throw new Error("element cannot be null or undefinied.");
        }
        return element._getValue(GridPanel.RowSpanProperty);
    };
    GridPanel.setRowSpan = function (element, value) {
        if (!element) {
            throw new Error("element cannot be null or undefinied.");
        }
        element._setValue(GridPanel.RowSpanProperty, value);
    };
    GridPanel.onCellAttachedPropertyChanged = function (data) {
        if (data.object instanceof view.View) {
            var element = data.object;
            if (element.parent instanceof GridPanel) {
                var parent = element.parent;
                if (parent.extData && parent.listenToNotifications) {
                    parent.cellsStructureDirty = true;
                    parent._invalidateMeasure();
                }
            }
        }
    };
    GridPanel.registerSpan = function (store, start, count, u, value) {
        var key = new SpanKey(start, count, u);
        var currentValue = store.get(key);
        if (!currentValue || value > currentValue) {
            store.set(key, value);
        }
    };
    GridPanel.prototype.getFinalColumnDefinitionWidth = function (columnIndex) {
        var finalOffset = 0.0;
        if (!this._data) {
            throw new Error();
        }
        if (!this.columnDefinitionCollectionDirty) {
            var definitionsU = this.definitionsU;
            finalOffset = definitionsU[(columnIndex + 1) % definitionsU.length].finalOffset;
            if (columnIndex !== 0) {
                finalOffset -= definitionsU[columnIndex].finalOffset;
            }
        }
        return finalOffset;
    };
    GridPanel.prototype.getFinalRowDefinitionHeight = function (rowIndex) {
        var finalOffset = 0.0;
        if (!this._data) {
            throw new Error();
        }
        if (!this.rowDefinitionCollectionDirty) {
            var definitionsV = this.definitionsV;
            finalOffset = definitionsV[(rowIndex + 1) % definitionsV.length].finalOffset;
            if (rowIndex !== 0) {
                finalOffset -= definitionsV[rowIndex].finalOffset;
            }
        }
        return finalOffset;
    };
    GridPanel.prototype.invalidate = function () {
        this.cellsStructureDirty = true;
        this._invalidateMeasure();
    };
    Object.defineProperty(GridPanel.prototype, "arrangeOverrideInProgress", {
        get: function () {
            return this.checkFlagsAnd(Flags.ArrangeOverrideInProgress);
        },
        set: function (value) {
            this.setFlags(value, Flags.ArrangeOverrideInProgress);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridPanel.prototype, "columnDefinitionCollectionDirty", {
        get: function () {
            return !this.checkFlagsAnd(Flags.ValidDefinitionsUStructure);
        },
        set: function (value) {
            this.setFlags(!value, Flags.ValidDefinitionsUStructure);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridPanel.prototype, "measureOverrideInProgress", {
        get: function () {
            return this.checkFlagsAnd(Flags.MeasureOverrideInProgress);
        },
        set: function (value) {
            this.setFlags(value, Flags.MeasureOverrideInProgress);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridPanel.prototype, "rowDefinitionCollectionDirty", {
        get: function () {
            return !this.checkFlagsAnd(Flags.ValidDefinitionsVStructure);
        },
        set: function (value) {
            this.setFlags(!value, Flags.ValidDefinitionsVStructure);
        },
        enumerable: true,
        configurable: true
    });
    GridPanel.prototype._measureOverride = function (constraint) {
        var size;
        var extData = this.extData;
        try {
            this.listenToNotifications = true;
            this.measureOverrideInProgress = true;
            if (!extData) {
                size = geometry.Size.zero;
                var children = this._children;
                var i;
                var count = children.length;
                for (i = 0; i < count; ++i) {
                    var child = children[i];
                    if (child) {
                        var desiredSize = child.measure(constraint);
                        size.width = Math.max(size.width, desiredSize.width);
                        size.height = Math.max(size.height, desiredSize.height);
                    }
                }
                return size;
            }
            var sizeToContentU = constraint.width === Number.POSITIVE_INFINITY;
            var sizeToContentV = constraint.height === Number.POSITIVE_INFINITY;
            if (this.rowDefinitionCollectionDirty || this.columnDefinitionCollectionDirty) {
                if (this._definitionIndices) {
                    this._definitionIndices.length = 0;
                }
            }
            this.validateDefinitionsUStructure();
            this.validateDefinitionsLayout(this.definitionsU, sizeToContentU);
            this.validateDefinitionsVStructure();
            this.validateDefinitionsLayout(this.definitionsV, sizeToContentV);
            this.cellsStructureDirty = this.cellsStructureDirty || (this.sizeToContentU !== sizeToContentU) || (this.sizeToContentV !== sizeToContentV);
            this.sizeToContentU = sizeToContentU;
            this.sizeToContentV = sizeToContentV;
            this.validateCells();
            this.measureCellsGroup(extData.cellGroup1, constraint, false, false);
            var canResolveStarsV = !this.hasGroup3CellsInAutoRows;
            if (canResolveStarsV) {
                if (this.hasStarCellsV) {
                    this.resolveStar(this.definitionsV, constraint.height);
                }
                this.measureCellsGroup(extData.cellGroup2, constraint, false, false);
                if (this.hasStarCellsU) {
                    this.resolveStar(this.definitionsU, constraint.width);
                }
                this.measureCellsGroup(extData.cellGroup3, constraint, false, false);
            }
            else {
                var canResolveStarsU = extData.cellGroup2 > this.privateCells.length;
                if (canResolveStarsU) {
                    if (this.hasStarCellsU) {
                        this.resolveStar(this.definitionsU, constraint.width);
                    }
                    this.measureCellsGroup(extData.cellGroup3, constraint, false, false);
                    if (this.hasStarCellsV) {
                        this.resolveStar(this.definitionsV, constraint.height);
                    }
                }
                else {
                    var hasDesiredSizeUChanged = false;
                    var cnt = 0;
                    var group2MinSizes = this.cacheMinSizes(extData.cellGroup2, false);
                    var group3MinSizes = this.cacheMinSizes(extData.cellGroup3, true);
                    this.measureCellsGroup(extData.cellGroup2, constraint, false, true);
                    do {
                        if (hasDesiredSizeUChanged) {
                            this.applyCachedMinSizes(group3MinSizes, true);
                        }
                        if (this.hasStarCellsU) {
                            this.resolveStar(this.definitionsU, constraint.width);
                        }
                        this.measureCellsGroup(extData.cellGroup3, constraint, false, false);
                        this.applyCachedMinSizes(group2MinSizes, false);
                        if (this.hasStarCellsV) {
                            this.resolveStar(this.definitionsV, constraint.height);
                        }
                        hasDesiredSizeUChanged = this.measureCellsGroup(extData.cellGroup2, constraint, cnt === GridPanel.c_layoutLoopMaxCount, false);
                    } while (hasDesiredSizeUChanged && (++cnt <= GridPanel.c_layoutLoopMaxCount));
                }
            }
            this.measureCellsGroup(extData.cellGroup4, constraint, false, false);
            size = new geometry.Size(this.calculateDesiredSize(this.definitionsU), this.calculateDesiredSize(this.definitionsV));
        }
        finally {
            this.measureOverrideInProgress = false;
            console.timeEnd("GridPanel: measure = ");
        }
        return size;
    };
    GridPanel.prototype._arrangeOverride = function (arrangeSize) {
        try {
            this.arrangeOverrideInProgress = true;
            var children = this._children;
            var i;
            if (!this._data) {
                var count = children.length;
                for (i = 0; i < count; ++i) {
                    var element = children[i];
                    if (element) {
                        element.arrange(new geometry.Rect(0, 0, arrangeSize.width, arrangeSize.height));
                    }
                }
            }
            else {
                this.setFinalSize(this.definitionsU, arrangeSize.width);
                this.setFinalSize(this.definitionsV, arrangeSize.height);
                for (i = 0; i < this.privateCells.length; i++) {
                    var view = children[i];
                    if (view) {
                        var columnIndex = this.privateCells[i].columnIndex;
                        var rowIndex = this.privateCells[i].rowIndex;
                        var columnSpan = this.privateCells[i].columnSpan;
                        var rowSpan = this.privateCells[i].rowSpan;
                        var finalRect = new geometry.Rect((columnIndex === 0) ? 0.0 : this.definitionsU[columnIndex].finalOffset, (rowIndex === 0) ? 0.0 : this.definitionsV[rowIndex].finalOffset, this.getFinalSizeForRange(this.definitionsU, columnIndex, columnSpan), this.getFinalSizeForRange(this.definitionsV, rowIndex, rowSpan));
                        view.arrange(finalRect);
                    }
                }
            }
        }
        finally {
            this.setValid();
            this.arrangeOverrideInProgress = false;
            console.timeEnd("GridPanel: arrange = ");
        }
    };
    GridPanel.prototype.cacheMinSizes = function (cellsHead, isRows) {
        var length = isRows ? this.definitionsV.length : this.definitionsU.length;
        var minSizes = new Array(length);
        for (var j = 0; j < minSizes.length; j++) {
            minSizes[j] = -1;
        }
        var i = cellsHead;
        do {
            if (isRows) {
                minSizes[this.privateCells[i].rowIndex] = this.definitionsV[this.privateCells[i].rowIndex].minSize;
            }
            else {
                minSizes[this.privateCells[i].columnIndex] = this.definitionsU[this.privateCells[i].columnIndex].minSize;
            }
            i = this.privateCells[i].next;
        } while (i < this.privateCells.length);
        return minSizes;
    };
    GridPanel.prototype.applyCachedMinSizes = function (minSizes, isRows) {
        for (var i = 0; i < minSizes.length; i++) {
            if (numberUtils.greaterThanOrClose(minSizes[i], 0)) {
                if (isRows) {
                    this.definitionsV[i].minSize = minSizes[i];
                }
                else {
                    this.definitionsU[i].minSize = minSizes[i];
                }
            }
        }
    };
    GridPanel.prototype.calculateDesiredSize = function (definitions) {
        var desiredSize = 0.0;
        for (var i = 0; i < definitions.length; i++) {
            desiredSize += definitions[i].minSize;
        }
        return desiredSize;
    };
    GridPanel.prototype.checkFlagsAnd = function (flags) {
        return ((this._flags & flags) === flags);
    };
    GridPanel.prototype.ensureMinSizeInDefinitionRange = function (definitions, start, count, requestedSize, percentReferenceSize) {
        if (!numberUtils.isZero(requestedSize)) {
            var tempDefinitions = this.tempDefinitions;
            var end = start + count;
            var autoDefinitionsCount = 0;
            var rangeMinSize = 0.0;
            var rangePreferredSize = 0.0;
            var rangeMaxSize = 0.0;
            var maxMaxSize = 0.0;
            var i = 0;
            var sizeToDistribute = 0;
            var preferredSize;
            var newMinSize;
            var maxSize;
            var minSize;
            for (i = start; i < end; i++) {
                minSize = definitions[i].minSize;
                preferredSize = definitions[i].preferredSize;
                maxSize = Math.max(definitions[i].userMaxSize, minSize);
                rangeMinSize += minSize;
                rangePreferredSize += preferredSize;
                rangeMaxSize += maxSize;
                definitions[i].sizeCache = maxSize;
                if (maxMaxSize < maxSize) {
                    maxMaxSize = maxSize;
                }
                if (definitions[i].userSize.isAuto) {
                    autoDefinitionsCount++;
                }
                tempDefinitions[i - start] = definitions[i];
            }
            if (requestedSize > rangeMinSize) {
                if (requestedSize <= rangePreferredSize) {
                    containers.ArraySortHelper.sort(tempDefinitions, 0, count, compareSpanPreferredDistributionOrder);
                    for (i = 0, sizeToDistribute = requestedSize; i < autoDefinitionsCount; ++i) {
                        sizeToDistribute -= tempDefinitions[i].minSize;
                    }
                    for (; i < count; ++i) {
                        newMinSize = Math.min(sizeToDistribute / (count - i), tempDefinitions[i].preferredSize);
                        if (newMinSize > tempDefinitions[i].minSize) {
                            tempDefinitions[i].updateMinSize(newMinSize);
                        }
                        sizeToDistribute -= newMinSize;
                    }
                }
                else if (requestedSize <= rangeMaxSize) {
                    containers.ArraySortHelper.sort(tempDefinitions, 0, count, compareSpanMaxDistributionOrder);
                    i = 0;
                    sizeToDistribute = requestedSize - rangePreferredSize;
                    for (i = 0, sizeToDistribute = requestedSize - rangePreferredSize; i < (count - autoDefinitionsCount); ++i) {
                        preferredSize = tempDefinitions[i].preferredSize;
                        newMinSize = preferredSize + (sizeToDistribute / (count - autoDefinitionsCount - i));
                        tempDefinitions[i].updateMinSize(Math.min(newMinSize, tempDefinitions[i].sizeCache));
                        sizeToDistribute -= tempDefinitions[i].minSize - preferredSize;
                    }
                    for (; i < count; ++i) {
                        preferredSize = tempDefinitions[i].minSize;
                        newMinSize = preferredSize + (sizeToDistribute / (count - i));
                        tempDefinitions[i].updateMinSize(Math.min(newMinSize, tempDefinitions[i].sizeCache));
                        sizeToDistribute -= (tempDefinitions[i].minSize - preferredSize);
                    }
                }
                else {
                    var equalSize = requestedSize / count;
                    if (equalSize < maxMaxSize && !numberUtils.areClose(equalSize, maxMaxSize)) {
                        var totalRemainingSize = (maxMaxSize * count) - rangeMaxSize;
                        sizeToDistribute = requestedSize - rangeMaxSize;
                        for (i = 0; i < count; ++i) {
                            var deltaSize = ((maxMaxSize - tempDefinitions[i].sizeCache) * sizeToDistribute) / totalRemainingSize;
                            tempDefinitions[i].updateMinSize(tempDefinitions[i].sizeCache + deltaSize);
                        }
                    }
                    else {
                        for (i = 0; i < count; i++) {
                            tempDefinitions[i].updateMinSize(equalSize);
                        }
                    }
                }
            }
        }
    };
    GridPanel.prototype.getFinalSizeForRange = function (definitions, start, count) {
        var size = 0.0;
        var i = (start + count) - 1;
        do {
            size += definitions[i].sizeCache;
        } while (--i >= start);
        return size;
    };
    GridPanel.prototype.getLengthTypeForRange = function (definitions, start, count) {
        var lengthType = LayoutTimeSizeType.None;
        var i = (start + count) - 1;
        do {
            lengthType = lengthType | definitions[i].sizeType;
        } while (--i >= start);
        return lengthType;
    };
    GridPanel.prototype.getMeasureSizeForRange = function (definitions, start, count) {
        var measureSize = 0.0;
        var i = (start + count) - 1;
        do {
            measureSize += (definitions[i].sizeType === LayoutTimeSizeType.Auto) ? definitions[i].minSize : definitions[i].measureSize;
        } while (--i >= start);
        return measureSize;
    };
    GridPanel.prototype.measureCell = function (cell, forceInfinityV) {
        var measureWidth;
        var measureHeight;
        if (this.privateCells[cell].IsAutoU && !this.privateCells[cell].isStarU) {
            measureWidth = Number.POSITIVE_INFINITY;
        }
        else {
            measureWidth = this.getMeasureSizeForRange(this.definitionsU, this.privateCells[cell].columnIndex, this.privateCells[cell].columnSpan);
        }
        if (forceInfinityV) {
            measureHeight = Number.POSITIVE_INFINITY;
        }
        else if (this.privateCells[cell].isAutoV && !this.privateCells[cell].isStarV) {
            measureHeight = Number.POSITIVE_INFINITY;
        }
        else {
            measureHeight = this.getMeasureSizeForRange(this.definitionsV, this.privateCells[cell].rowIndex, this.privateCells[cell].rowSpan);
        }
        var child = this._children[cell];
        if (child) {
            var childConstraint = new geometry.Size(measureWidth, measureHeight);
            return child.measure(childConstraint);
        }
        return geometry.Size.empty;
    };
    GridPanel.prototype.measureCellsGroup = function (cellsHead, referenceSize, ignoreDesiredSizeU, forceInfinityV) {
        var _this = this;
        var hasDesiredSizeUChanged = false;
        if (cellsHead >= this.privateCells.length) {
            return hasDesiredSizeUChanged;
        }
        var children = this._children;
        var spanStore = null;
        var ignoreDesiredSizeV = forceInfinityV;
        var i = cellsHead;
        do {
            var oldWidth = children[i]._layoutInfo.desiredSize.width;
            var desiredSize = this.measureCell(i, forceInfinityV);
            hasDesiredSizeUChanged = hasDesiredSizeUChanged || !numberUtils.areClose(oldWidth, desiredSize.width);
            if (!ignoreDesiredSizeU) {
                if (this.privateCells[i].columnSpan === 1) {
                    this.definitionsU[this.privateCells[i].columnIndex].updateMinSize(Math.min(desiredSize.width, this.definitionsU[this.privateCells[i].columnIndex].userMaxSize));
                }
                else {
                    if (!spanStore) {
                        spanStore = new containers.Dictionary(new SpanKeyEqualityComparer());
                    }
                    GridPanel.registerSpan(spanStore, this.privateCells[i].columnIndex, this.privateCells[i].columnSpan, true, desiredSize.width);
                }
            }
            if (!ignoreDesiredSizeV) {
                if (this.privateCells[i].rowSpan === 1) {
                    this.definitionsV[this.privateCells[i].rowIndex].updateMinSize(Math.min(desiredSize.height, this.definitionsV[this.privateCells[i].rowIndex].userMaxSize));
                }
                else {
                    if (!spanStore) {
                        spanStore = new containers.Dictionary(new SpanKeyEqualityComparer());
                    }
                    GridPanel.registerSpan(spanStore, this.privateCells[i].rowIndex, this.privateCells[i].rowSpan, false, desiredSize.height);
                }
            }
            i = this.privateCells[i].next;
        } while (i < this.privateCells.length);
        if (spanStore) {
            spanStore.forEach(function (key, value) {
                _this.ensureMinSizeInDefinitionRange(key.u ? _this.definitionsU : _this.definitionsV, key.start, key.count, value, key.u ? referenceSize.width : referenceSize.height);
            });
        }
        return hasDesiredSizeUChanged;
    };
    GridPanel.prototype.resolveStar = function (definitions, availableSize) {
        var tempDefinitions = this.tempDefinitions;
        var starDefinitionsCount = 0;
        var takenSize = 0.0;
        var starValue;
        for (var i = 0; i < definitions.length; i++) {
            switch (definitions[i].sizeType) {
                case LayoutTimeSizeType.Auto:
                    takenSize += definitions[i].minSize;
                    break;
                case LayoutTimeSizeType.Pixel:
                    takenSize += definitions[i].measureSize;
                    break;
                case LayoutTimeSizeType.Star:
                    {
                        tempDefinitions[starDefinitionsCount++] = definitions[i];
                        starValue = definitions[i].userSize.value;
                        if (numberUtils.isZero(starValue)) {
                            definitions[i].measureSize = 0;
                            definitions[i].sizeCache = 0;
                        }
                        else {
                            starValue = Math.min(starValue, GridPanel.c_starClip);
                            definitions[i].measureSize = starValue;
                            var maxSize = Math.max(definitions[i].minSize, definitions[i].userMaxSize);
                            maxSize = Math.min(maxSize, GridPanel.c_starClip);
                            definitions[i].sizeCache = maxSize / starValue;
                        }
                    }
                    break;
            }
        }
        if (starDefinitionsCount > 0) {
            containers.ArraySortHelper.sort(tempDefinitions, 0, starDefinitionsCount, compareStarDistributionOrder);
            var allStarWeights = 0.0;
            var index = starDefinitionsCount - 1;
            do {
                allStarWeights += tempDefinitions[index].measureSize;
                tempDefinitions[index].sizeCache = allStarWeights;
            } while (--index >= 0);
            index = 0;
            do {
                var resolvedSize;
                starValue = tempDefinitions[index].measureSize;
                if (numberUtils.isZero(starValue)) {
                    resolvedSize = tempDefinitions[index].minSize;
                }
                else {
                    var userSize = Math.max(availableSize - takenSize, 0.0) * (starValue / tempDefinitions[index].sizeCache);
                    resolvedSize = Math.min(userSize, tempDefinitions[index].userMaxSize);
                    resolvedSize = Math.max(tempDefinitions[index].minSize, resolvedSize);
                }
                tempDefinitions[index].measureSize = resolvedSize;
                takenSize += resolvedSize;
            } while (++index < starDefinitionsCount);
        }
    };
    GridPanel.prototype.setFinalSize = function (definitions, finalSize) {
        var starDefinitionsCount = 0;
        var nonStarIndex = definitions.length;
        var allPreferredArrangeSize = 0.0;
        var definitionIndices = this.definitionIndices;
        var starValue;
        var userSize;
        for (var i = 0; i < definitions.length; i++) {
            if (definitions[i].userSize.isStar) {
                starValue = definitions[i].userSize.value;
                if (numberUtils.isZero(starValue)) {
                    definitions[i].measureSize = 0.0;
                    definitions[i].sizeCache = 0.0;
                }
                else {
                    starValue = Math.min(starValue, GridPanel.c_starClip);
                    definitions[i].measureSize = starValue;
                    var maxSize = Math.min(Math.max(definitions[i].minSize, definitions[i].userMaxSize), GridPanel.c_starClip);
                    definitions[i].sizeCache = maxSize / starValue;
                }
                definitionIndices[starDefinitionsCount++] = i;
            }
            else {
                userSize = 0.0;
                switch (definitions[i].userSize.gridUnitType) {
                    case GridUnitType.pixel:
                        userSize = definitions[i].userSize.value;
                        break;
                    case GridUnitType.auto:
                        userSize = definitions[i].minSize;
                        break;
                }
                definitions[i].sizeCache = Math.max(definitions[i].minSize, Math.min(userSize, definitions[i].userMaxSize));
                allPreferredArrangeSize += definitions[i].sizeCache;
                definitionIndices[--nonStarIndex] = i;
            }
        }
        if (starDefinitionsCount > 0) {
            containers.ArraySortHelper.sort(definitionIndices, 0, starDefinitionsCount, getStarDistributionOrderIndexCompareFn(definitions));
            var allStarWeights = 0.0;
            var index = starDefinitionsCount - 1;
            do {
                allStarWeights += definitions[definitionIndices[index]].measureSize;
                definitions[definitionIndices[index]].sizeCache = allStarWeights;
            } while (--index >= 0);
            index = 0;
            do {
                var resolvedSize;
                starValue = definitions[definitionIndices[index]].measureSize;
                if (numberUtils.isZero(starValue)) {
                    resolvedSize = definitions[definitionIndices[index]].minSize;
                }
                else {
                    userSize = Math.max(finalSize - allPreferredArrangeSize, 0.0) * (starValue / definitions[definitionIndices[index]].sizeCache);
                    resolvedSize = Math.min(userSize, definitions[definitionIndices[index]].userMaxSize);
                    resolvedSize = Math.max(definitions[definitionIndices[index]].minSize, resolvedSize);
                }
                definitions[definitionIndices[index]].sizeCache = resolvedSize;
                allPreferredArrangeSize += definitions[definitionIndices[index]].sizeCache;
            } while (++index < starDefinitionsCount);
        }
        if (allPreferredArrangeSize > finalSize && !numberUtils.areClose(allPreferredArrangeSize, finalSize)) {
            containers.ArraySortHelper.sort(definitionIndices, 0, definitions.length, getDistributionOrderIndexCompareFn(definitions));
            var sizeToDistribute = finalSize - allPreferredArrangeSize;
            for (var k = 0; k < definitions.length; k++) {
                var definitionIndex = definitionIndices[k];
                var final = definitions[definitionIndex].sizeCache + (sizeToDistribute / (definitions.length - k));
                final = Math.max(final, definitions[definitionIndex].minSize);
                final = Math.min(final, definitions[definitionIndex].sizeCache);
                sizeToDistribute -= (final - definitions[definitionIndex].sizeCache);
                definitions[definitionIndex].sizeCache = final;
            }
            allPreferredArrangeSize = finalSize - sizeToDistribute;
        }
        definitions[0].finalOffset = 0.0;
        for (var j = 0; j < definitions.length; j++) {
            definitions[(j + 1) % definitions.length].finalOffset = definitions[j].finalOffset + definitions[j].sizeCache;
        }
    };
    GridPanel.prototype.setFlags = function (value, flags) {
        this._flags = value ? (this._flags | flags) : (this._flags & ~flags);
    };
    GridPanel.prototype.setValid = function () {
        var extData = this.extData;
        if (extData && extData.tempDefinitions) {
            extData.tempDefinitions = null;
        }
    };
    GridPanel.prototype.validateCells = function () {
        if (this.cellsStructureDirty) {
            this.validateCellsCore();
            this.cellsStructureDirty = false;
        }
    };
    GridPanel.prototype.validateCellsCore = function () {
        var internalChildren = this._children;
        var extData = this.extData;
        extData.cellCachesCollection = new Array(internalChildren.length);
        extData.cellGroup1 = Number.MAX_VALUE;
        extData.cellGroup2 = Number.MAX_VALUE;
        extData.cellGroup3 = Number.MAX_VALUE;
        extData.cellGroup4 = Number.MAX_VALUE;
        var hasStarCellsU = false;
        var hasStarCellsV = false;
        var hasGroup3CellsInAutoRows = false;
        for (var i = this.privateCells.length - 1; i >= 0; i--) {
            var element = internalChildren[i];
            if (element) {
                var cache = new CellCache();
                cache.columnIndex = Math.min(GridPanel.getColumn(element), this.definitionsU.length - 1);
                cache.rowIndex = Math.min(GridPanel.getRow(element), this.definitionsV.length - 1);
                cache.columnSpan = Math.min(GridPanel.getColumnSpan(element), this.definitionsU.length - cache.columnIndex);
                cache.rowSpan = Math.min(GridPanel.getRowSpan(element), this.definitionsV.length - cache.rowIndex);
                cache.sizeTypeU = this.getLengthTypeForRange(this.definitionsU, cache.columnIndex, cache.columnSpan);
                cache.sizeTypeV = this.getLengthTypeForRange(this.definitionsV, cache.rowIndex, cache.rowSpan);
                hasStarCellsU = hasStarCellsU || cache.isStarU;
                hasStarCellsV = hasStarCellsV || cache.isStarV;
                if (!cache.isStarV) {
                    if (!cache.isStarU) {
                        cache.next = extData.cellGroup1;
                        extData.cellGroup1 = i;
                    }
                    else {
                        cache.next = extData.cellGroup3;
                        extData.cellGroup3 = i;
                        hasGroup3CellsInAutoRows = hasGroup3CellsInAutoRows || cache.isAutoV;
                    }
                }
                else {
                    if (cache.IsAutoU && !cache.isStarU) {
                        cache.next = extData.cellGroup2;
                        extData.cellGroup2 = i;
                    }
                    else {
                        cache.next = extData.cellGroup4;
                        extData.cellGroup4 = i;
                    }
                }
                this.privateCells[i] = cache;
            }
        }
        this.hasStarCellsU = hasStarCellsU;
        this.hasStarCellsV = hasStarCellsV;
        this.hasGroup3CellsInAutoRows = hasGroup3CellsInAutoRows;
    };
    GridPanel.prototype.validateDefinitionsLayout = function (definitions, treatStarAsAuto) {
        for (var i = 0; i < definitions.length; i++) {
            definitions[i].onBeforeLayout(this);
            var userMinSize = definitions[i].userMinSize;
            var userMaxSize = definitions[i].userMaxSize;
            var userSize = 0.0;
            switch (definitions[i].userSize.gridUnitType) {
                case GridUnitType.pixel:
                    definitions[i].sizeType = LayoutTimeSizeType.Pixel;
                    userSize = definitions[i].userSize.value;
                    userMinSize = Math.max(userMinSize, Math.min(userSize, userMaxSize));
                    break;
                case GridUnitType.auto:
                    definitions[i].sizeType = LayoutTimeSizeType.Auto;
                    userSize = Number.POSITIVE_INFINITY;
                    break;
                case GridUnitType.star:
                    definitions[i].sizeType = treatStarAsAuto ? LayoutTimeSizeType.Auto : LayoutTimeSizeType.Star;
                    userSize = Number.POSITIVE_INFINITY;
                    break;
                default:
                    break;
            }
            definitions[i].updateMinSize(userMinSize);
            definitions[i].measureSize = Math.max(userMinSize, Math.min(userSize, userMaxSize));
        }
    };
    GridPanel.prototype.validateDefinitionsUStructure = function () {
        if (this.columnDefinitionCollectionDirty) {
            var extData = this.extData;
            if (!extData.columnDefinitions) {
                if (!extData.definitionsU) {
                    extData.definitionsU = new Array(new ColumnDefinition());
                }
            }
            else {
                if (extData.columnDefinitions.length === 0) {
                    extData.definitionsU = new Array(new ColumnDefinition());
                }
                else {
                    extData.definitionsU = extData.columnDefinitions;
                }
            }
            this.columnDefinitionCollectionDirty = false;
        }
    };
    GridPanel.prototype.validateDefinitionsVStructure = function () {
        if (this.rowDefinitionCollectionDirty) {
            var extData = this.extData;
            if (!extData.rowDefinitions) {
                if (!extData.definitionsV) {
                    extData.definitionsV = new Array(new RowDefinition());
                }
            }
            else {
                if (extData.rowDefinitions.length === 0) {
                    extData.definitionsV = new Array(new RowDefinition());
                }
                else {
                    extData.definitionsV = extData.rowDefinitions;
                }
            }
            this.rowDefinitionCollectionDirty = false;
        }
    };
    Object.defineProperty(GridPanel.prototype, "cellsStructureDirty", {
        get: function () {
            return !this.checkFlagsAnd(Flags.ValidCellsStructure);
        },
        set: function (value) {
            this.setFlags(!value, Flags.ValidCellsStructure);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridPanel.prototype, "listenToNotifications", {
        get: function () {
            return this.checkFlagsAnd(Flags.ListenToNotifications);
        },
        set: function (value) {
            this.setFlags(value, Flags.ListenToNotifications);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridPanel.prototype, "definitionIndices", {
        get: function () {
            var num = Math.max(this.definitionsU.length, this.definitionsV.length);
            if (!this._definitionIndices && num === 0) {
                this._definitionIndices = new Array();
            }
            else if (!this._definitionIndices || this._definitionIndices.length < num) {
                this._definitionIndices = new Array();
            }
            return this._definitionIndices;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridPanel.prototype, "definitionsU", {
        get: function () {
            return this.extData.definitionsU;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridPanel.prototype, "definitionsV", {
        get: function () {
            return this.extData.definitionsV;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridPanel.prototype, "extData", {
        get: function () {
            return this._data;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridPanel.prototype, "hasGroup3CellsInAutoRows", {
        get: function () {
            return this.checkFlagsAnd(Flags.HasGroup3CellsInAutoRows);
        },
        set: function (value) {
            this.setFlags(value, Flags.HasGroup3CellsInAutoRows);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridPanel.prototype, "hasStarCellsU", {
        get: function () {
            return this.checkFlagsAnd(Flags.HasStarCellsU);
        },
        set: function (value) {
            this.setFlags(value, Flags.HasStarCellsU);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridPanel.prototype, "hasStarCellsV", {
        get: function () {
            return this.checkFlagsAnd(Flags.HasStarCellsV);
        },
        set: function (value) {
            this.setFlags(value, Flags.HasStarCellsV);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridPanel.prototype, "privateCells", {
        get: function () {
            return this.extData.cellCachesCollection;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridPanel.prototype, "sizeToContentU", {
        get: function () {
            return this.checkFlagsAnd(Flags.SizeToContentU);
        },
        set: function (value) {
            this.setFlags(value, Flags.SizeToContentU);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridPanel.prototype, "sizeToContentV", {
        get: function () {
            return this.checkFlagsAnd(Flags.SizeToContentV);
        },
        set: function (value) {
            this.setFlags(value, Flags.SizeToContentV);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GridPanel.prototype, "tempDefinitions", {
        get: function () {
            var extData = this.extData;
            if (!extData.tempDefinitions) {
                var num = Math.max(this.definitionsU.length, this.definitionsV.length);
                extData.tempDefinitions = new Array(num * 2);
            }
            return extData.tempDefinitions;
        },
        enumerable: true,
        configurable: true
    });
    GridPanel.prototype.addColumnDefinition = function (value) {
        this.privateVerifyWriteAccess();
        this.privateValidateValueForAddition(value);
        this.privateOnModified(true);
        if (!this._data) {
            this._data = new ExtendedData();
        }
        var columnDefinitions = this._data.columnDefinitions;
        if (!columnDefinitions) {
            this._data.columnDefinitions = columnDefinitions = new Array();
        }
        var length = columnDefinitions.length;
        columnDefinitions.push(value);
        this.privateConnectChild(length, value);
    };
    GridPanel.prototype.addRowDefinition = function (value) {
        this.privateVerifyWriteAccess();
        this.privateValidateValueForAddition(value);
        this.privateOnModified(false);
        if (!this._data) {
            this._data = new ExtendedData();
        }
        var rowDefinitions = this._data.rowDefinitions;
        if (!rowDefinitions) {
            this._data.rowDefinitions = rowDefinitions = new Array();
        }
        var length = rowDefinitions.length;
        rowDefinitions.push(value);
        this.privateConnectChild(length, value);
    };
    GridPanel.prototype.removeColumnDefinition = function (value) {
        var result = this.privateValidateValueForRemoval(value);
        if (result) {
            this.privateRemove(value, true);
        }
        return result;
    };
    GridPanel.prototype.removeRowDefinition = function (value) {
        var result = this.privateValidateValueForRemoval(value);
        if (result) {
            this.privateRemove(value, false);
        }
        return result;
    };
    GridPanel.prototype.getColumnDefinitions = function () {
        if (this._data && this._data.columnDefinitions) {
            return this._data.columnDefinitions.slice();
        }
        return new Array();
    };
    GridPanel.prototype.getRowDefinitions = function () {
        if (this._data && this._data.rowDefinitions) {
            return this._data.rowDefinitions.slice();
        }
        return new Array();
    };
    GridPanel.prototype.privateValidateValueForAddition = function (value) {
        if (!value) {
            throw new Error("value cannot be null or undefinied.");
        }
        if (value.parent) {
            throw new Error("Value is used in another GridPanel.");
        }
    };
    GridPanel.prototype.privateValidateValueForRemoval = function (value) {
        if (!value) {
            throw new Error("value cannot be null or undefinied.");
        }
        return (value.parent === this);
    };
    GridPanel.prototype.privateConnectChild = function (index, value) {
        value.index = index;
        value.parent = this;
        value.onEnterParentTree();
    };
    GridPanel.prototype.privateDisconnectChild = function (value) {
        value.onExitParentTree();
        value.index = -1;
        value.parent = null;
    };
    GridPanel.prototype.privateRemove = function (value, isColumn) {
        this.privateOnModified(isColumn);
        this.privateDisconnectChild(value);
        var index = value.index;
        if (isColumn) {
            this._data.columnDefinitions.splice(index, 1);
        }
        else {
            this._data.rowDefinitions.splice(index, 1);
        }
    };
    GridPanel.prototype.privateOnModified = function (isColumn) {
        if (isColumn) {
            this.columnDefinitionCollectionDirty = true;
        }
        else {
            this.rowDefinitionCollectionDirty = true;
        }
        this.invalidate();
    };
    GridPanel.prototype.privateVerifyWriteAccess = function () {
        if (this.isReadOnly) {
            throw new Error("Cannot modify RowDefinitions/ColumnDefinitions while in layout.");
        }
    };
    Object.defineProperty(GridPanel.prototype, "isReadOnly", {
        get: function () {
            if (!this.measureOverrideInProgress) {
                return this.arrangeOverrideInProgress;
            }
            return true;
        },
        enumerable: true,
        configurable: true
    });
    GridPanel.c_starClip = 1E+298;
    GridPanel.c_layoutLoopMaxCount = 5;
    GridPanel.ColumnProperty = new observable.Property("Column", "GridPanel", new observable.PropertyMetadata(0, observable.PropertyMetadataOptions.None, GridPanel.onCellAttachedPropertyChanged, numberUtils.notNegative));
    GridPanel.ColumnSpanProperty = new observable.Property("ColumnSpan", "GridPanel", new observable.PropertyMetadata(1, observable.PropertyMetadataOptions.None, GridPanel.onCellAttachedPropertyChanged, numberUtils.greaterThanZero));
    GridPanel.RowProperty = new observable.Property("Row", "GridPanel", new observable.PropertyMetadata(0, observable.PropertyMetadataOptions.None, GridPanel.onCellAttachedPropertyChanged, numberUtils.notNegative));
    GridPanel.RowSpanProperty = new observable.Property("RowSpan", "GridPanel", new observable.PropertyMetadata(1, observable.PropertyMetadataOptions.None, GridPanel.onCellAttachedPropertyChanged, numberUtils.greaterThanZero));
    return GridPanel;
})(panel.Panel);
exports.GridPanel = GridPanel;
function convertGridLength(value) {
    if (types.isString(value)) {
        if (value === "auto") {
            return definition.GridLength.auto;
        }
        else if (value.indexOf("*") !== -1) {
            return new definition.GridLength(parseInt(value.replace("*", "") || 1), definition.GridUnitType.star);
        }
        else if (!isNaN(parseInt(value))) {
            return new definition.GridLength(parseInt(value), definition.GridUnitType.pixel);
        }
    }
    else if (value instanceof definition.GridLength) {
        return value;
    }
    else {
        return new definition.GridLength(1, definition.GridUnitType.star);
    }
}
