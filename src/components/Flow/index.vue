<template>
  <div/>
</template>

<script>
import registerNode from "./registerNode";
import customEdge from "./customEdge";

export default {
  name: 'Flow',
  data() {
    return {
      page: null
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      registerNode();
      customEdge.init();
    }
  }
};
</script>