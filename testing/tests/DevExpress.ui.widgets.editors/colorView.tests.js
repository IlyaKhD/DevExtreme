"use strict";

var $ = require("jquery"),
    Color = require("color"),
    Browser = require("core/utils/browser"),
    pointerMock = require("../../helpers/pointerMock.js"),
    keyboardMock = require("../../helpers/keyboardMock.js"),
    fx = require("animation/fx");

var TEXTEDITOR_INPUT_SELECTOR = ".dx-texteditor-input";

require("common.css!");
require("ui/color_box/color_view");

QUnit.testStart(function() {
    var markup =
        '<div class="dx-viewport"></div>\
            <div id="color-view"></div>';

    $("#qunit-fixture").html(markup);
});

var move = function($element, position) {
    var parentOffset = $element.parent().offset();
    pointerMock($element)
        .start()
        .down(parentOffset.left, parentOffset.top)
        .move(position.left, position.top)
        .up();
};

var click = function($element, position) {
    pointerMock($element)
        .start()
        .down($element.offset().left + position.left, $element.offset().top + position.top);
};

var showColorView = function(options) {
    return this.element.dxColorView(options);
};

QUnit.module("ColorView", {
    beforeEach: function() {
        fx.off = true;
        this.element = $("#color-view");

        this.checkInput = function($input, expected, assert) {
            var inputInstance = $input[expected.inputType || "dxNumberBox"]("instance");

            assert.equal($input.length, 1, "Editor is rendered");
            assert.ok(inputInstance, "Editor is instance of dxNumberBox");
            assert.equal($input.parent().text(), expected.labelText, "Label is correct");
            assert.ok($input.parent().hasClass(expected.labelClass), "Editor parent has a right class");
            assert.equal(inputInstance.option("value"), expected.value, "Editor value is correct");
        };

        this.updateColorInput = function(inputAlias, value) {
            var aliases = [
                    "red",
                    "green",
                    "blue",
                    "hex",
                    "alpha"
                ],
                inputIndex = $.inArray(inputAlias, aliases),

                $input = this.element.find("label " + TEXTEDITOR_INPUT_SELECTOR).eq(inputIndex);

            $input.val(value);
            $input.trigger("change");
        };

        this.checkColor = function(expectedColor, assert) {
            var colorPicker = this.element.dxColorView("instance"),
                currentColor = colorPicker._currentColor;

            assert.equal(currentColor.r, expectedColor.r, "Red color is OK");
            assert.equal(colorPicker._rgbInputs[0]._input().val(), expectedColor.r, "Red input is OK");

            assert.equal(currentColor.g, expectedColor.g, "Green color is OK");
            assert.equal(colorPicker._rgbInputs[1]._input().val(), expectedColor.g, "Green input is OK");

            assert.equal(currentColor.b, expectedColor.b, "Blue color is OK");
            assert.equal(colorPicker._rgbInputs[2]._input().val(), expectedColor.b, "Blue input is OK");

            assert.equal(currentColor.toHex(), expectedColor.hex, "HEX is OK");

            if(expectedColor.alpha) {
                assert.equal(currentColor.a, expectedColor.alpha, "Alpha is OK");
            }
        };
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test("Apply css class", function(assert) {
    var $colorPicker = showColorView.call(this);
    assert.ok($colorPicker.hasClass("dx-colorview"));
});

QUnit.test("Default value should be 'null'", function(assert) {
    var colorView = showColorView.call(this).dxColorView("instance");
    assert.strictEqual(colorView.option("value"), null);
});

QUnit.test("Render color picker container", function(assert) {
    showColorView.call(this);

    var $colorPickerContainer = this.element.find(".dx-colorview-container"),
        $alphaChannelScale = this.element.find(".dx-colorview-alpha-channel-scale"),
        $alphaChannelInput = this.element.find(".dx-colorview-alpha-channel-input"),
        $alphaChannelLabel = this.element.find(".dx-colorview-alpha-label");

    assert.equal($colorPickerContainer.length, 1);
    assert.equal($alphaChannelScale.length, 0);
    assert.equal($alphaChannelInput.length, 0);
    assert.equal($alphaChannelLabel.length, 0);
});

QUnit.test("Render html rows", function(assert) {
    showColorView.call(this);
    var $colorPickerContainer = this.element.find(".dx-colorview-container"),
        $rows = $colorPickerContainer.find(".dx-colorview-container-row");

    assert.equal($rows.length, 1);
});

QUnit.test("Render html rows with alpha channel", function(assert) {
    showColorView.call(this, { editAlphaChannel: true });

    var $colorPickerContainer = this.element.find(".dx-colorview-container"),
        $rows = $colorPickerContainer.find(".dx-colorview-container-row");

    assert.equal($rows.length, 2);
    assert.ok($rows.eq(1).hasClass("dx-colorview-alpha-channel-row"));
});

QUnit.test("Render palette", function(assert) {
    showColorView.call(this, { value: "#9c2a2a" });

    var $palette = this.element.find(".dx-colorview-palette"),
        $gradientWhite = $palette.find(".dx-colorview-palette-gradient-white"),
        $gradientBlack = $palette.find(".dx-colorview-palette-gradient-black"),
        $colorChooser = $palette.find(".dx-colorview-palette-handle"),
        paletteBackground = $palette.css("background-color");

    assert.equal($palette.length, 1);
    assert.equal(new Color(paletteBackground).toHex(), "#ff0000");
    assert.equal($gradientWhite.length, 1);
    assert.equal($gradientBlack.length, 1);
    assert.equal($colorChooser.length, 1);
    assert.ok($palette.parent().hasClass("dx-colorview-container-cell"));
    assert.ok($palette.parent().hasClass("dx-colorview-palette-cell"));
});

QUnit.test("Color chooser position", function(assert) {
    showColorView.call(this, { value: "#2C77B8" });
    var $colorChooserMarker = $(".dx-colorview-palette-handle"),
        markerPosition = $colorChooserMarker.position();

    assert.equal(markerPosition.left, 205);
    assert.equal(markerPosition.top, 70);
});

QUnit.test("Color chooser position can be negative", function(assert) {
    showColorView.call(this);

    var $colorChooserMarker = $(".dx-colorview-palette-handle");

    move($colorChooserMarker, {
        left: 220,
        top: -16
    });
    assert.equal(parseInt($colorChooserMarker.position().top, 10), -14);
});

QUnit.test("Render hue scale and hue scale handle", function(assert) {
    showColorView.call(this);

    var $hueScale = this.element.find(".dx-colorview-hue-scale"),
        $hueScaleWrapper = $hueScale.closest(".dx-colorview-hue-scale-wrapper"),
        $hueScaleHandle = $hueScaleWrapper.find(".dx-colorview-hue-scale-handle");

    assert.equal($hueScale.length, 1);
    assert.equal($hueScaleHandle.length, 1);
    assert.ok($hueScaleWrapper.parent().hasClass("dx-colorview-container-cell"));
    assert.ok($hueScaleWrapper.parent().hasClass("dx-colorview-hue-scale-cell"));
});

QUnit.test("Hue marker position", function(assert) {
    showColorView.call(this, { value: "#2C77B8" });
    assert.equal($(".dx-colorview-hue-scale-handle").position().top, 120);
});

QUnit.test("Hue marker position with #ff0000", function(assert) {
    showColorView.call(this, { value: "#ff0000" });
    assert.equal($(".dx-colorview-hue-scale-handle").position().top, 284);
});

QUnit.test("Hue marker position with rgb(255, 0, 1)", function(assert) {
    showColorView.call(this, { value: "rgb(255, 0, 1)" });
    assert.equal($(".dx-colorview-hue-scale-handle").position().top, 0);
});

QUnit.test("Render controls container", function(assert) {
    showColorView.call(this);
    var $controlsContainer = this.element.find(".dx-colorview-controls-container");

    assert.equal($controlsContainer.length, 1);
    assert.equal($controlsContainer.parent().attr("class"), "dx-colorview-container-cell");
});

QUnit.test("Render RGB inputs", function(assert) {
    showColorView.call(this, { value: "#00FFA9" });
    var $red = this.element.find(".dx-colorview-controls-container label.dx-colorview-label-red .dx-texteditor"),
        $green = this.element.find(".dx-colorview-controls-container label.dx-colorview-label-green .dx-texteditor"),
        $blue = this.element.find(".dx-colorview-controls-container label.dx-colorview-label-blue .dx-texteditor");

    this.checkInput($red, {
        value: 0,
        labelText: "R:",
        labelClass: "dx-colorview-label-red"
    }, assert);

    this.checkInput($green, {
        value: 255,
        labelText: "G:",
        labelClass: "dx-colorview-label-green"
    }, assert);

    this.checkInput($blue, {
        value: 169,
        labelText: "B:",
        labelClass: "dx-colorview-label-blue"
    }, assert);
});

QUnit.test("Render hex input", function(assert) {
    showColorView.call(this, { value: "#ff0000" });
    var $hex = this.element.find(".dx-colorview-controls-container label.dx-colorview-label-hex .dx-texteditor");

    this.checkInput($hex, {
        value: "ff0000",
        inputType: "dxTextBox",
        labelText: "#:",
        labelClass: "dx-colorview-label-hex"
    }, assert);
});

QUnit.test("Render alpha channel scale and input", function(assert) {
    showColorView.call(this, { editAlphaChannel: true, value: "rgba(255, 0, 0, 0.5)" });

    var $alphaChannelScaleWrapper = this.element.find(".dx-colorview-alpha-channel-wrapper"),
        $alphaChannelScale = $alphaChannelScaleWrapper.find(".dx-colorview-alpha-channel-scale"),
        $alphaChannelLabel = this.element.find(".dx-colorview-alpha-channel-label"),
        $alphaChannelHandle = this.element.find(".dx-colorview-alpha-channel-cell").find(".dx-colorview-alpha-channel-handle"),
        $alphaChannelScaleBorder = this.element.find(".dx-colorview-alpha-channel-border");

    assert.equal($alphaChannelScaleWrapper.length, 1);
    assert.equal($alphaChannelScale.length, 1);
    assert.equal($alphaChannelHandle.length, 1);
    assert.ok($alphaChannelScaleBorder.parent().hasClass("dx-colorview-container-cell"));
    assert.ok($alphaChannelScaleBorder.parent().hasClass("dx-colorview-alpha-channel-cell"));
    assert.equal($alphaChannelLabel.length, 1);
    assert.equal($alphaChannelLabel.parent().attr("class"), "dx-colorview-container-cell");

    this.checkColor({
        r: 255,
        g: 0,
        b: 0,
        hex: "#ff0000",
        alpha: 0.5
    }, assert);
});

QUnit.test("Position of alpha channel handle with rgba(255, 0, 0, 1)", function(assert) {
    showColorView.call(this, { editAlphaChannel: true, value: "rgba(255, 0, 0, 1)" });
    assert.equal($(".dx-colorview-alpha-channel-handle").position().left, 0);
});

QUnit.test("Position of alpha channel handle with rgba(255, 0, 0, 0)", function(assert) {
    showColorView.call(this, { editAlphaChannel: true, value: "rgba(255, 0, 0, 0)" });
    assert.equal(Math.round($(".dx-colorview-alpha-channel-handle").position().left), 275);
});

QUnit.test("Render colors preview", function(assert) {
    showColorView.call(this);
    var $colorPreviewContainer = this.element.find(".dx-colorview-color-preview-container"),
        $colorPreviewContainerInner = this.element.find(".dx-colorview-color-preview-container-inner");

    assert.equal($colorPreviewContainer.length, 1);
    assert.equal($colorPreviewContainerInner.length, 1);
    assert.equal($colorPreviewContainerInner.find(".dx-colorview-color-preview-color-current").length, 1);
    assert.equal($colorPreviewContainerInner.find(".dx-colorview-color-preview-color-new").length, 1);
});

QUnit.test("Update color values", function(assert) {
    showColorView.call(this, { value: "#2C77B8" });
    var $colorChooserMarker = this.element.find(".dx-colorview-palette-handle");

    move($colorChooserMarker, {
        left: 220,
        top: 80
    });

    this.checkColor({
        r: 45,
        g: 120,
        b: 186,
        hex: "#2d78ba"
    }, assert);

});

QUnit.test("Update alpha", function(assert) {
    showColorView.call(this, {
        editAlphaChannel: true
    });

    var $alphaHandle = this.element.find(".dx-colorview-alpha-channel-handle");

    move($alphaHandle, {
        left: 143,
        top: 0
    });

    this.checkColor({
        r: 0,
        g: 0,
        b: 0,
        hex: "#000000",
        alpha: 0.51
    }, assert);
});

QUnit.test("Change Saturation and Value by click", function(assert) {
    showColorView.call(this, {
        value: "green"
    });

    var $palette = this.element.find(".dx-colorview-palette");

    click($palette, {
        left: 170,
        top: 170
    });

    this.checkColor({
        r: 45,
        g: 110,
        b: 45,
        hex: "#2d6e2d"
    }, assert);
});

QUnit.test("Change Hue by click", function(assert) {
    if(Browser.msie && Browser.version < 9) {
        assert.ok(true);
        return;
    }

    showColorView.call(this, {
        value: "green"
    });

    var $hueScale = this.element.find(".dx-colorview-hue-scale");

    click($hueScale, {
        left: 0,
        top: 90
    });

    this.checkColor({
        r: 36,
        g: 0,
        b: 127,
        hex: "#24007f"
    }, assert);
});

QUnit.test("Change Alpha by click", function(assert) {
    if(Browser.msie && Browser.version < 9) {
        assert.ok(true);
        return;
    }

    showColorView.call(this, {
        editAlphaChannel: true
    });

    var $alphaScale = this.element.find(".dx-colorview-alpha-channel-scale");

    click($alphaScale, {
        left: 90,
        top: 0
    });

    this.checkColor({
        r: 0,
        g: 0,
        b: 0,
        hex: "#000000",
        alpha: 0.7
    }, assert);

});

QUnit.test("RGB, Hex, Alpha updating", function(assert) {
    showColorView.call(this, {
        value: "#ff0000",
        editAlphaChannel: true
    });

    this.updateColorInput("red", 100);
    this.checkColor({ r: 100, g: 0, b: 0, hex: "#640000", alpha: 1 }, assert);

    this.updateColorInput("green", 100);
    this.checkColor({ r: 100, g: 100, b: 0, hex: "#646400", alpha: 1 }, assert);

    this.updateColorInput("blue", 100);
    this.checkColor({ r: 100, g: 100, b: 100, hex: "#646464", alpha: 1 }, assert);

    this.updateColorInput("hex", "551414");
    this.checkColor({ r: 85, g: 20, b: 20, hex: "#551414", alpha: 1 }, assert);

    this.updateColorInput("alpha", 0.5);
    this.checkColor({ r: 85, g: 20, b: 20, hex: "#551414", alpha: 0.5 }, assert);
});

QUnit.test("Markers position after color updating", function(assert) {
    showColorView.call(this, {
        value: "#646432",
        editAlphaChannel: true
    });

    this.updateColorInput("red", 200);
    this.updateColorInput("alpha", 0.5);

    assert.equal($(".dx-colorview-palette-handle").position().top, 52);
    assert.equal($(".dx-colorview-palette-handle").position().left, 202);
    assert.equal($(".dx-colorview-hue-scale-handle").position().top, 268);
    assert.ok(Math.abs($(".dx-colorview-alpha-channel-handle").position().left - 138) <= 1);

});

QUnit.test("Validate a wrong value of alpha channel", function(assert) {
    showColorView.call(this, {
        value: "#646432",
        editAlphaChannel: true
    });

    this.updateColorInput("alpha", 1.5);
    this.checkColor({ r: 100, g: 100, b: 50, hex: "#646432", alpha: 1 }, assert);
});

QUnit.test("Validate a negative value", function(assert) {
    showColorView.call(this, {
        value: "#646432",
        editAlphaChannel: true
    });

    this.updateColorInput("red", -100);
    this.checkColor({ r: 0, g: 100, b: 50, hex: "#006432", alpha: 1 }, assert);
});

QUnit.test("Validate a too large value", function(assert) {
    showColorView.call(this, {
        value: "#646432",
        editAlphaChannel: true
    });

    this.updateColorInput("green", 300);
    this.checkColor({ r: 100, g: 255, b: 50, hex: "#64ff32", alpha: 1 }, assert);
});

QUnit.test("Validate a float value", function(assert) {
    showColorView.call(this, {
        value: "#646432",
        editAlphaChannel: true
    });

    this.updateColorInput("blue", 1.2);
    this.checkColor({ r: 100, g: 100, b: 50, hex: "#646432", alpha: 1 }, assert);
});

QUnit.test("Validate a wrong hex value", function(assert) {
    showColorView.call(this, {
        value: "#646432",
        editAlphaChannel: true
    });

    this.updateColorInput("hex", "551Z14");
    this.checkColor({ r: 100, g: 100, b: 50, hex: "#646432", alpha: 1 }, assert);
});

QUnit.test("When some color param was changed (invalid) alpha channel is OK", function(assert) {
    showColorView.call(this, {
        value: "rgba(255, 0, 0, 0.3)",
        editAlphaChannel: true
    });

    this.updateColorInput("blue", 500);
    this.updateColorInput("alpha", 1.5);

    this.checkColor({
        r: 255,
        g: 0,
        b: 255,
        hex: "#ff00ff",
        alpha: 1
    }, assert);
});

QUnit.test("Update hue with gray color", function(assert) {
    if(Browser.msie && Browser.version < 9) {
        assert.ok(true);
        return;
    }

    showColorView.call(this, {
        value: "#666666"
    });

    var $hueScale = this.element.find(".dx-colorview-hue-scale"),
        $palette = this.element.find(".dx-colorview-palette");

    click($hueScale, {
        left: 0,
        top: 90
    });

    var $paletteBackColor = new Color($palette.css("backgroundColor")).toHex();
    assert.equal($paletteBackColor, "#4800ff");
});

QUnit.test("Changing the 'value' option must invoke the 'onValueChanged' action", function(assert) {
    showColorView.call(this, { onValueChanged: function() { assert.ok(true); } }).dxColorView("instance").option("value", true);
});

QUnit.test("ColorPicker should can update value instantly", function(assert) {
    var newColor = new Color("#ba2d2d"),
        spy = sinon.spy($.noop),

        colorPicker = showColorView.call(this, {
            onValueChanged: spy,
            applyValueMode: "instantly"
        }).dxColorView("instance"),

        $colorChooserMarker = $(".dx-colorview-palette-handle");

    move($colorChooserMarker, {
        left: 220,
        top: 80
    });

    assert.equal(colorPicker.option("value"), newColor.toHex());
    assert.ok(spy.called);

    this.checkColor({
        r: newColor.r,
        g: newColor.g,
        b: newColor.b,
        hex: newColor.toHex()
    }, assert);
});

QUnit.test("'instantly' mode should work for alpha channel", function(assert) {
    var colorPicker = showColorView.call(this, {
        value: "rgba(100, 100, 100, .2)",
        editAlphaChannel: true,
        applyValueMode: "instantly"
    }).dxColorView("instance");

    this.updateColorInput("alpha", 0.75);

    assert.equal(colorPicker.option("value"), "rgba(100, 100, 100, 0.75)");
});

QUnit.test("In 'instantly' mode value should be updated if some input was updated", function(assert) {
    var colorPicker = showColorView.call(this, {
        value: "#ff0000",
        applyValueMode: "instantly"
    }).dxColorView("instance");

    this.updateColorInput("red", 100);
    assert.equal(colorPicker.option("value"), "#640000");

    this.updateColorInput("green", 100);
    assert.equal(colorPicker.option("value"), "#646400");

    this.updateColorInput("blue", 100);
    assert.equal(colorPicker.option("value"), "#646464");

    this.updateColorInput("hex", "0000ff");
    assert.equal(colorPicker.option("value"), "#0000ff");
});

QUnit.test("In 'instantly' mode 'OK' and 'Cancel' buttons should not be rendered", function(assert) {
    showColorView.call(this, {
        applyValueMode: "instantly"
    });

    var $applyButton = this.element.find(".dx-colorview-buttons-container .dx-colorview-apply-button"),
        $cancelButton = this.element.find(".dx-colorview-buttons-container .dx-colorview-cancel-button"),
        $htmlRows = this.element.find(".dx-colorview-container-row");

    assert.equal($applyButton.length, 0);
    assert.equal($cancelButton.length, 0);
    assert.equal($htmlRows.length, 1);
});

QUnit.test("Update 'applyValueMode' option if editAlphaChannel is true", function(assert) {
    var instance = showColorView.call(this, { editAlphaChannel: true }).dxColorView("instance");

    instance.option("applyValueMode", "instantly");
    instance.option("applyValueMode", "useButtons");

    var $alphaChannelRow = this.element.find(".dx-colorview-container-row").eq(1);

    assert.ok($alphaChannelRow.hasClass("dx-colorview-alpha-channel-row"));
    assert.equal($alphaChannelRow.find(".dx-colorview-alpha-channel-cell").length, 1);
});

QUnit.test("T102286: opacity = 1", function(assert) {
    showColorView.call(this, {
        value: "rgba(255, 0, 0, .5)",
        editAlphaChannel: true
    });

    var $alphaHandle = this.element.find(".dx-colorview-alpha-channel-handle");

    move($alphaHandle, {
        left: 0,
        top: 0
    });

    this.checkColor({
        r: 255,
        g: 0,
        b: 0,
        hex: "#ff0000",
        alpha: 1
    }, assert);
});

QUnit.test("T102286: opacity = 0", function(assert) {
    showColorView.call(this, {
        value: "rgba(255, 0, 0, .5)",
        editAlphaChannel: true
    });

    var $alphaHandle = this.element.find(".dx-colorview-alpha-channel-handle");

    move($alphaHandle, {
        left: 500,
        top: 0
    });

    assert.equal($(".dx-colorview-alpha-channel-label input").val(), 0);
});

QUnit.test("T104929", function(assert) {
    var instance = showColorView.call(this, { editAlphaChannel: false }).dxColorView("instance");

    instance.option("editAlphaChannel", true);

    var $htmlRows = this.element.find(".dx-colorview-container-row");

    assert.equal($htmlRows.eq(1).find(".dx-colorview-alpha-channel-scale").length, 1);
    assert.equal($htmlRows.eq(1).find(".dx-colorview-alpha-channel-label .dx-texteditor").length, 1);
    assert.equal($htmlRows.length, 2);

    instance.option("editAlphaChannel", false);

    assert.equal(this.element.find(".dx-colorview-alpha-channel-scale").length, 0);
    assert.equal(this.element.find(".dx-colorview-alpha-channel-label .dx-texteditor").length, 0);
    assert.equal(this.element.find(".dx-colorview-container-row").length, 1);
});

QUnit.test("T110896", function(assert) {
    showColorView.call(this, { editAlphaChannel: true, rtlEnabled: true, value: "rgba(255, 0, 0, 1)" });
    assert.equal(Math.round(this.element.find(".dx-colorview-alpha-channel-handle").position().left), 275);
});

QUnit.test("T110896: move handle", function(assert) {
    showColorView.call(this, {
        editAlphaChannel: true,
        rtlEnabled: true,
        value: "rgba(255, 0, 0, 1)"
    });

    var $alphaHandle = this.element.find(".dx-colorview-alpha-channel-handle");

    move($alphaHandle, {
        left: 70,
        top: 0
    });

    this.checkColor({
        r: 255,
        g: 0,
        b: 0,
        hex: "#ff0000",
        alpha: 0.25
    }, assert);
});

QUnit.test("T112555", function(assert) {
    showColorView.call(this, {
        value: "#001AFF"
    });

    var $hueMarker = this.element.find(".dx-colorview-hue-scale-handle");


    move($hueMarker, {
        left: 0,
        top: 0
    });

    this.checkColor({
        r: 255,
        g: 0,
        b: 0,
        hex: "#ff0000"
    }, assert);
});

QUnit.test("Markup should be updated when value was changed", function(assert) {
    if(Browser.msie && Browser.version <= 9) {
        assert.ok(true);
        return;
    }

    var colorView = showColorView.call(this, {
        value: "rgba(94, 169, 219, 0.62)",
        editAlphaChannel: true
    }).dxColorView("instance");

    colorView.option("value", "rgba(48, 84, 46, 0.19)");

    var paletteHandlePosition = colorView._$paletteHandle.position(),
        alphaChannelHandlePosition = colorView._$alphaChannelHandle.position(),
        hueScaleHandlePosition = colorView._$hueScaleHandle.position();

    assert.equal(Math.floor(paletteHandlePosition.left), 116);
    assert.equal(Math.floor(paletteHandlePosition.top), 186);

    assert.equal(Math.floor(alphaChannelHandlePosition.left), 222);
    assert.equal(Math.floor(alphaChannelHandlePosition.top), -6);

    assert.equal(Math.floor(hueScaleHandlePosition.left), -7);
    assert.equal(Math.floor(hueScaleHandlePosition.top), 192);
});

QUnit.test("Preview for current color should be updated when value was changed", function(assert) {
    var colorView = showColorView.call(this, {
        value: "red"
    }).dxColorView("instance");

    colorView.option("value", "green");
    assert.equal(new Color(colorView._$currentColor.css("background-color")).toHex(), "#008000");
});

QUnit.test("Click on label should not focus the input (T179488)", function(assert) {
    var isDefaultPrevented;
    this.$element = $("#color-view").dxColorView({ focusStateEnabled: true });
    var $label = this.$element.find(".dx-colorview-label-red");

    $label.on("dxclick", function(e) {
        isDefaultPrevented = e.isDefaultPrevented();
    });

    $label.trigger("dxclick");

    assert.ok(isDefaultPrevented, "PreventDefault on label click is enabled");
});

QUnit.module("keyboard navigation", {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();

        this.$element = $("#color-view").dxColorView({
            value: "rgba(50, 100, 100, 0.37)",
            editAlphaChannel: true,
            applyValueMode: "instantly",
            focusStateEnabled: true,
            keyStep: 10
        });
        this.instance = this.$element.data("dxColorView");
        this.$element.trigger("focus");
        this.keyboard = keyboardMock(this.$element);
        this.$hueMarker = this.$element.find(".dx-colorview-hue-scale-handle");
        this.$alphaMarker = this.$element.find(".dx-colorview-alpha-channel-handle");
        this.$paletteMarker = this.$element.find(".dx-colorview-palette-handle");

        this.ctrlLeft = $.Event("keydown", { which: 37, ctrlKey: true });
        this.ctrlUp = $.Event("keydown", { which: 38, ctrlKey: true });
        this.ctrlRight = $.Event("keydown", { which: 39, ctrlKey: true });
        this.ctrlDown = $.Event("keydown", { which: 40, ctrlKey: true });

        this.shiftLeft = $.Event("keydown", { which: 37, shiftKey: true });
        this.shiftUp = $.Event("keydown", { which: 38, shiftKey: true });
        this.shiftRight = $.Event("keydown", { which: 39, shiftKey: true });
        this.shiftDown = $.Event("keydown", { which: 40, shiftKey: true });

        this.ctrlShiftLeft = $.Event("keydown", { which: 37, ctrlKey: true, shiftKey: true });
        this.ctrlShiftUp = $.Event("keydown", { which: 38, ctrlKey: true, shiftKey: true });
        this.ctrlShiftRight = $.Event("keydown", { which: 39, ctrlKey: true, shiftKey: true });
        this.ctrlShiftDown = $.Event("keydown", { which: 40, ctrlKey: true, shiftKey: true });
    },
    afterEach: function() {
        this.clock.restore();
    }
});

QUnit.test("'up' key test", function(assert) {
    this.keyboard.keyDown("up");

    assert.equal(this.instance.option("value"), "rgba(51, 102, 102, 0.37)", "value was changed correctly when 'up' was pressed");
});

QUnit.test("'shiftUp' key test", function(assert) {
    this.$element.trigger(this.shiftUp);

    assert.equal(this.instance.option("value"), "rgba(54, 107, 107, 0.37)", "value was changed correctly when 'shift+up' was pressed");
});

QUnit.test("'down' key test", function(assert) {
    this.keyboard.keyDown("down");

    assert.equal(this.instance.option("value"), "rgba(48, 97, 97, 0.37)", "value was changed correctly when 'down' was pressed");
}),

QUnit.test("'shiftDown' key test", function(assert) {
    this.$element.trigger(this.shiftDown);

    assert.equal(this.instance.option("value"), "rgba(46, 92, 92, 0.37)", "value was changed correctly when 'shift+down' was pressed");
});

QUnit.test("'right' key test", function(assert) {
    this.keyboard.keyDown("right");

    assert.equal(this.instance.option("value"), "rgba(49, 99, 99, 0.37)", "value was changed correctly when 'right' was pressed");
}),

QUnit.test("'shiftRight' key test", function(assert) {
    this.$element.trigger(this.shiftRight);

    assert.equal(this.instance.option("value"), "rgba(47, 99, 99, 0.37)", "value was changed correctly when 'shift+right' was pressed");
});

QUnit.test("'left' key test", function(assert) {
    this.keyboard.keyDown("left");

    assert.equal(this.instance.option("value"), "rgba(51, 99, 99, 0.37)", "value was changed correctly when 'left' was pressed");
}),

QUnit.test("'shiftLeft' key test", function(assert) {
    this.$element.trigger(this.shiftLeft);

    assert.equal(this.instance.option("value"), "rgba(53, 99, 99, 0.37)", "value was changed correctly when 'shift+left' was pressed");
});

QUnit.test("'ctrlUp' key test", function(assert) {
    this.$element.trigger(this.ctrlUp);

    assert.equal(this.instance.option("value"), "rgba(50, 99, 99, 0.37)", "value was changed correctly when 'ctrl+up' was pressed");
});

QUnit.test("'ctrlShiftUp' key test", function(assert) {
    this.$element.trigger(this.ctrlShiftUp);

    assert.equal(this.instance.option("value"), "rgba(50, 89, 99, 0.37)", "value was changed correctly when 'ctrl+shift+up' was pressed");
});

QUnit.test("'ctrlDown' key test", function(assert) {
    this.$element.trigger(this.ctrlDown);

    assert.equal(this.instance.option("value"), "rgba(50, 99, 99, 0.37)", "value was changed correctly when 'ctrl+down' was pressed");
});

QUnit.test("'ctrlShiftDown' key test", function(assert) {
    this.$element.trigger(this.ctrlShiftDown);

    assert.equal(this.instance.option("value"), "rgba(50, 99, 89, 0.37)", "value was changed correctly when 'ctrl+shift+down' was pressed");
});

QUnit.test("'ctrlRight' key test", function(assert) {
    this.$element.trigger(this.ctrlRight);

    assert.equal(this.instance.option("value"), "rgba(50, 100, 100, 0.36)", "value was changed correctly when 'ctrl+right' was pressed");
});

QUnit.test("'ctrlShiftRight' key test", function(assert) {
    this.instance.option("value", "rgba(50, 100, 100, 0.4)");
    this.$element.trigger(this.ctrlShiftRight);

    assert.equal(this.instance.option("value"), "rgba(50, 100, 100, 0.36)", "value was changed correctly when 'ctrl+shift+right' was pressed");
});

QUnit.test("'ctrlLeft' key test", function(assert) {
    this.$element.trigger(this.ctrlLeft);

    assert.equal(this.instance.option("value"), "rgba(50, 100, 100, 0.38)", "value was changed correctly when 'ctrl+left' was pressed");
});

QUnit.test("'ctrlShiftLeft' key test", function(assert) {
    this.$element.trigger(this.ctrlShiftLeft);

    assert.equal(this.instance.option("value"), "rgba(50, 100, 100, 0.41)", "value was changed correctly when 'ctrl+shift+left' was pressed");
});

QUnit.test("'ctrlRight' key test, rtl mode", function(assert) {
    this.$element.dxColorView("instance").option("rtlEnabled", true);
    this.$element.trigger(this.ctrlRight);

    assert.equal(this.instance.option("value"), "rgba(50, 100, 100, 0.38)", "value was changed correctly when 'ctrl+right' was pressed");
});

QUnit.test("'ctrlLeft' key test, rtl mode", function(assert) {
    this.$element.dxColorView("instance").option("rtlEnabled", true);
    this.$element.trigger(this.ctrlLeft);

    assert.equal(this.instance.option("value"), "rgba(50, 100, 100, 0.36)", "value was changed correctly when 'ctrl+left' was pressed");
});

QUnit.test("setting hueHandler to top position by keybord navigation change color to rgb(255,0,0)", function(assert) {
    this.instance.option("value", "rgba(255,0,4,1)");

    this.$element.trigger(this.ctrlUp);

    assert.equal(this.instance.option("value"), "rgba(255, 0, 0, 1)", "value was changed correctly when handler was placed to the top position");
});

QUnit.test("setting hueHandler to top position by keybord navigation change color correctly", function(assert) {
    this.instance.option("value", "rgba(255 , 0, 4, 1)");
    this.$element.trigger(this.ctrlUp);
    var topOffset = this.$hueMarker.offset().top;
    this.$element.trigger(this.ctrlUp);

    assert.equal(topOffset, this.$hueMarker.offset().top, "pressing on the 'ctrl+up' in top position does not move handler");

    this.$element.trigger(this.ctrlDown);

    assert.equal(this.instance.option("value"), "rgba(255, 0, 4, 1)", "value was changed correctly when 'ctrl+down' was pressed");
});

QUnit.test("setting hueHandler to bottom position by keybord navigation change color correctly", function(assert) {
    this.instance.option("value", "rgba(255, 4, 0, 1)");
    this.$element.trigger(this.ctrlDown);
    var topOffset = this.$hueMarker.offset().top;
    this.$element.trigger(this.ctrlDown);

    assert.equal(topOffset, this.$hueMarker.offset().top, "pressing on the 'ctrl+down' in bottom position does not move handler");

    this.$element.trigger(this.ctrlUp);

    assert.equal(this.instance.option("value"), "rgba(255, 4, 0, 1)", "value was changed correctly when 'ctrl+up' was pressed");
});

QUnit.test("setting paletteHandler to top position by keybord navigation change color to rgb(255,0,0)", function(assert) {
    this.instance.option("value", "rgba(255,0,4,1)");

    this.$element.trigger(this.ctrlUp);

    assert.equal(this.instance.option("value"), "rgba(255, 0, 0, 1)", "value was changed correctly when handler was placed to the top position");
});

QUnit.test("setting paletteHandler to top position by keybord navigation change color correctly", function(assert) {
    this.instance.option("value", "rgba(255,145,145,1)");

    var topOffset = this.$paletteMarker.offset().top;
    this.keyboard.keyDown("up");
    assert.equal(topOffset, this.$paletteMarker.offset().top, "pressing on the 'up' in top position does not move handler");

    this.keyboard.keyDown("down");
    assert.equal(this.instance.option("value"), "rgba(252, 144, 144, 1)", "value was changed correctly when 'down' was pressed");
});

QUnit.test("setting paletteHandler to top position by keybord navigation using keyStep change color correctly", function(assert) {
    this.instance.option("value", "rgba(252,144,144,1)");

    this.$element.trigger(this.shiftUp);
    this.$element.trigger(this.shiftDown);

    assert.equal(this.instance.option("value"), "rgba(247, 141, 141, 1)", "value was changed correctly when 'down' was pressed");
});

QUnit.test("setting paletteHandler to bottom position by keybord navigation change color correctly", function(assert) {
    this.instance.option("value", "rgba(3,1,1,1)");

    this.keyboard.keyDown("down");
    var topOffset = this.$paletteMarker.offset().top;
    this.keyboard.keyDown("down");
    assert.equal(topOffset, this.$paletteMarker.offset().top, "pressing on the 'down' in bottom position does not move handler");

    this.keyboard.keyDown("up");
    assert.equal(this.instance.option("value"), "rgba(3, 1, 1, 1)", "value was changed correctly when 'up' was pressed");
});

QUnit.test("setting paletteHandler to bottom position by keybord navigation using keyStep change color correctly", function(assert) {
    this.instance.option("value", "rgba(5,1,1,1)");

    this.$element.trigger(this.shiftDown);
    this.$element.trigger(this.shiftUp);

    assert.equal(this.instance.option("value"), "rgba(8, 2, 2, 1)", "value was changed correctly when 'up' was pressed");
});

QUnit.test("setting paletteHandler to left position by keybord navigation change color correctly", function(assert) {
    this.instance.option("value", "rgba(140,140,140,1)");

    var leftOffset = this.$paletteMarker.offset().left;
    this.keyboard.keyDown("left");

    assert.equal(leftOffset, this.$paletteMarker.offset().left, "pressing on the 'left' in left position does not move handler");

    this.keyboard.keyDown("right");
    assert.equal(this.instance.option("value"), "rgba(140, 139, 139, 1)", "value was changed correctly when 'right' was pressed");
});

QUnit.test("setting paletteHandler to left position by keybord navigation using keyStep change color correctly", function(assert) {
    this.instance.option("value", "rgba(145,140,140,1)");

    this.$element.trigger(this.shiftLeft);
    this.$element.trigger(this.shiftRight);

    assert.equal(this.instance.option("value"), "rgba(145, 141, 141, 1)", "value was changed correctly when 'right' was pressed");
});

QUnit.test("setting paletteHandler to right position by keybord navigation change color correctly", function(assert) {
    this.instance.option("value", "rgba(130,0,0,1)");

    var leftOffset = this.$paletteMarker.offset().left;
    this.keyboard.keyDown("right");

    assert.equal(leftOffset, this.$paletteMarker.offset().left, "pressing on the 'right' in left position does not move handler");

    this.keyboard.keyDown("left");
    assert.equal(this.instance.option("value"), "rgba(130, 1, 1, 1)", "value was changed correctly when 'left' was pressed");
});

QUnit.test("setting paletteHandler to right position by keybord navigation using keyStep change color correctly", function(assert) {
    this.instance.option("value", "rgba(130,1,1,1)");

    this.$element.trigger(this.shiftRight);
    this.$element.trigger(this.shiftLeft);

    assert.equal(this.instance.option("value"), "rgba(130, 4, 4, 1)", "value was changed correctly when 'left' was pressed");
});

QUnit.test("setting alphaChannelHandler to right position by keybord navigation change alpha correctly", function(assert) {
    this.instance.option("value", "rgba(255, 0, 0, 0.01)");

    this.$element.trigger(this.ctrlRight);
    var leftOffset = this.$alphaMarker.offset().left;
    this.$element.trigger(this.ctrlRight);

    assert.equal(leftOffset, this.$alphaMarker.offset().left, "pressing on the 'ctrl+right' in right position does not move handler");

    this.$element.trigger(this.ctrlLeft);

    assert.equal(this.instance.option("value"), "rgba(255, 0, 0, 0.01)", "alpha was changed correctly when 'ctrl+left' was pressed");
});

QUnit.test("setting alphaChannelHandler to left position by keybord navigation change alpha correctly", function(assert) {
    this.instance.option("value", "rgba(255, 0, 0, 0.99)");

    this.$element.trigger(this.ctrlLeft);
    var leftOffset = this.$alphaMarker.offset().left;
    this.$element.trigger(this.ctrlLeft);

    assert.equal(leftOffset, this.$alphaMarker.offset().left, "pressing on the 'ctrl+left' in left position does not move handler");

    this.$element.trigger(this.ctrlRight);

    assert.equal(this.instance.option("value"), "rgba(255, 0, 0, 0.99)", "alpha was changed correctly when 'ctrl+right' was pressed");
});

QUnit.module("aria accessibility");

QUnit.test("aria labels for editors", function(assert) {
    var $element = $("#color-view").dxColorView({
            editAlphaChannel: true
        }),
        $r = $element.find(".dx-colorview-label-red .dx-numberbox"),
        $g = $element.find(".dx-colorview-label-green .dx-numberbox"),
        $b = $element.find(".dx-colorview-label-blue .dx-numberbox"),
        $alpha = $element.find(".dx-colorview-alpha-channel-label .dx-numberbox"),
        $code = $element.find(".dx-colorview-label-hex .dx-textbox");

    assert.equal($r.attr("aria-label"), "Red", "red label is correct");
    assert.equal($g.attr("aria-label"), "Green", "green label is correct");
    assert.equal($b.attr("aria-label"), "Blue", "blue label is correct");
    assert.equal($alpha.attr("aria-label"), "Transparency", "alpha label is correct");
    assert.equal($code.attr("aria-label"), "Color code", "hex label is correct");
});
