// 01_hello_test.jsx
// Modati test script: 5 second ki oka simple text animation create chestundi.
// Run cheyadam: After Effects -> File -> Scripts -> Run Script File... -> ee file select cheyandi.

(function () {
    app.beginUndoGroup("Hello Test");

    if (!app.project) {
        app.newProject();
    }

    // 1920x1080, 5 seconds, 30 fps composition
    var comp = app.project.items.addComp("Hello_Test", 1920, 1080, 1, 5, 30);

    // Dark blue background
    comp.layers.addSolid([0.05, 0.08, 0.2], "Background", 1920, 1080, 1);

    // Text layer
    var textLayer = comp.layers.addText("Hello Basha!");
    var textProp = textLayer.property("Source Text");
    var textDoc = textProp.value;
    textDoc.fontSize = 150;
    textDoc.fillColor = [1, 0.8, 0.2];
    textDoc.justification = ParagraphJustification.CENTER_JUSTIFY;
    textProp.setValue(textDoc);
    textLayer.property("Position").setValue([960, 540]);

    // Animation: fade in + zoom in (0s -> 1s)
    var opacity = textLayer.property("Opacity");
    opacity.setValueAtTime(0, 0);
    opacity.setValueAtTime(1, 100);

    var scale = textLayer.property("Scale");
    scale.setValueAtTime(0, [50, 50]);
    scale.setValueAtTime(1, [100, 100]);

    // Composition ni open cheyyi
    comp.openInViewer();

    app.endUndoGroup();
    alert("Done! 'Hello_Test' composition ready. Spacebar nokki preview chudandi.");
})();
