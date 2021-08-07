const Docthor = require("@docthor/core") 

const docthor = Docthor({
  "title": "Untitled",
  "version": "1.0.0",
  "src_folder": "markdown",
  "publish_folder": "docs",
  "draft_folder": "_draft"
}) 

docthor.run()