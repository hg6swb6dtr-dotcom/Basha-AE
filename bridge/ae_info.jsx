// ae_info.jsx
// After Effects lo current project state ni JSON ga istundi (Claude "chudadaniki").
// Output: bridge/out/info.json + script return value (ae_run.sh print chestundi).

(function () {
    function q(s) {
        s = String(s);
        s = s.replace(/\\/g, "\\\\").replace(/"/g, "\\\"");
        s = s.replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t");
        return "\"" + s + "\"";
    }

    function toJson(v) {
        if (v === null || v === undefined) return "null";
        if (typeof v === "number" || typeof v === "boolean") return String(v);
        if (typeof v === "string") return q(v);
        var parts = [];
        if (v instanceof Array) {
            for (var i = 0; i < v.length; i++) parts.push(toJson(v[i]));
            return "[" + parts.join(",") + "]";
        }
        for (var k in v) {
            if (v.hasOwnProperty(k)) parts.push(q(k) + ":" + toJson(v[k]));
        }
        return "{" + parts.join(",") + "}";
    }

    function layerType(layer) {
        if (layer instanceof TextLayer) return "text";
        if (layer instanceof ShapeLayer) return "shape";
        if (layer instanceof CameraLayer) return "camera";
        if (layer instanceof LightLayer) return "light";
        if (layer.nullLayer) return "null";
        if (layer.source instanceof CompItem) return "precomp";
        if (layer.source && layer.source.mainSource instanceof SolidSource) return "solid";
        return "footage";
    }

    function compInfo(comp) {
        var layers = [];
        for (var i = 1; i <= comp.numLayers; i++) {
            var l = comp.layer(i);
            layers.push({
                index: l.index,
                name: l.name,
                type: layerType(l),
                enabled: l.enabled,
                inPoint: l.inPoint,
                outPoint: l.outPoint
            });
        }
        return {
            id: comp.id,
            name: comp.name,
            width: comp.width,
            height: comp.height,
            duration: comp.duration,
            frameRate: comp.frameRate,
            layers: layers
        };
    }

    var proj = app.project;
    var info = {
        aeVersion: app.version,
        projectFile: proj && proj.file ? proj.file.fsName : null,
        activeComp: null,
        comps: [],
        footage: []
    };

    if (proj) {
        if (proj.activeItem instanceof CompItem) info.activeComp = proj.activeItem.name;
        for (var i = 1; i <= proj.numItems; i++) {
            var item = proj.item(i);
            if (item instanceof CompItem) {
                info.comps.push(compInfo(item));
            } else if (item instanceof FootageItem && !(item.mainSource instanceof SolidSource)) {
                info.footage.push({
                    name: item.name,
                    file: item.file ? item.file.fsName : null
                });
            }
        }
    }

    var json = toJson(info);

    var outDir = new Folder(new File($.fileName).parent.fsName + "/out");
    if (!outDir.exists) outDir.create();
    var outFile = new File(outDir.fsName + "/info.json");
    outFile.encoding = "UTF-8";
    if (outFile.open("w")) {
        outFile.write(json);
        outFile.close();
    }

    return json;
})();
