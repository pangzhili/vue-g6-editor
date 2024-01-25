<template>
  <div id="mountNode" :style="{width:width}">
    <div class="editor">
      <context-menu/>
      <!--toolbar-->
      <toolbar/>
      <div style="height: 42px;"></div>
      <div class="bottom-container">
        <!--itempannel-->
        <item-panel v-show="showFullScreen === 1 || showFullScreen === 2"/>
        <!--detailpannel-->
        <detail-panel v-show="showFullScreen === 1"/>
        <!--miniMap-->
        <minimap v-show="showFullScreen === 1"/>
        <!--page-->
        <page :height="height" :width="width" :data="data"/>
      </div>
    </div>
    <Flow/>
  </div>
</template>

<script>
import Toolbar from "../Toolbar";
import ItemPanel from "../ItemPanel";
import DetailPanel from "../DetailPanel";
import Minimap from "../Minimap";
import Page from "../Page";
import Flow from "../Flow"
import ContextMenu from "../ContextMenu";
import Editor from "../Base/Editor";
import command from "../../command";
import eventBus from "@/utils/eventBus";

export default {
  name: "G6Editor",
  components: {
    Toolbar,
    ItemPanel,
    DetailPanel,
    Minimap,
    Page,
    ContextMenu,
    Flow
  },
  props: {
    height: {
      type: Number,
      default: document.documentElement.clientHeight
    },
    width: {
      type: Number,
      default: document.documentElement.clientWidth
    },
    data: {
      type: Object,
      default: () => {
      }
    }
  },
  created() {
    this.init();
  },
  mounted() {
    eventBus.$on('fullScreen', flag => {
      this.showFullScreen = flag;
    });
  },
  data() {
    return {
      editor: {},
      command: null,
      showFullScreen: 1
    };
  },
  methods: {
    init() {
      this.editor = new Editor();
      this.command = new command(this.editor);
    }
  }
};
</script>

<style scoped>
.editor {
  position: relative;
  width: 100%;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}

.bottom-container {
  position: relative;
}
</style>