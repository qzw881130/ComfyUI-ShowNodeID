import { app } from "../../scripts/app.js";

const EXT_NAME = "qzw.show-node-id";
const PREFIX_RE = /^#\d+\s+/;

function stripPrefix(title) {
  if (typeof title !== "string") return "";
  return title.replace(PREFIX_RE, "");
}

function applyNodeIdTitle(node) {
  if (!node || typeof node.id === "undefined" || node.id === null) return;

  const currentTitle = typeof node.title === "string"
    ? node.title
    : (typeof node.getTitle === "function" ? node.getTitle() : node.comfyClass || node.type || "Node");

  const baseTitle = stripPrefix(currentTitle) || node.comfyClass || node.type || "Node";
  const nextTitle = `#${node.id} ${baseTitle}`;

  if (node.title !== nextTitle) {
    node.title = nextTitle;
    node.setDirtyCanvas?.(true, true);
  }
}

function refreshAllNodes() {
  const nodes = app?.graph?._nodes;
  if (!Array.isArray(nodes)) return;
  for (const node of nodes) applyNodeIdTitle(node);
}

app.registerExtension({
  name: EXT_NAME,

  async nodeCreated(node) {
    applyNodeIdTitle(node);
  },

  loadedGraphNode(node) {
    applyNodeIdTitle(node);
  },

  async afterConfigureGraph() {
    refreshAllNodes();
  },

  async setup() {
    refreshAllNodes();
  },
});
