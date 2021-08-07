const Docthor = require("@docthor/core") 

const tagChartFlow = require('@docthor/plug-charts/lib/tag-chart-flow')

Docthor({
  "title": "Untitled",
  "version": "1.0.0",
  "src_folder": "markdown",
  "publish_folder": "docs",
  "draft_folder": "_draft"
}) 
.plugin(tagChartFlow())
.run()
