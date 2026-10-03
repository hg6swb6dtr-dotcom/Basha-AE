// Photoshop connection test: open documents peru lu chupistundi.
(function () {
  var names = [];
  for (var i = 0; i < app.documents.length; i++) {
    names.push(app.documents[i].name);
  }
  return "Photoshop " + app.version + " connected. Open docs: " +
    (names.length ? names.join(", ") : "emi levu");
})();
