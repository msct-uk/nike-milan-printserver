<template>
  <div class="w-screen h-screen p-2">
    <div class="w-full text-5xl text-center">Print Server Page</div>
    <div class="w-full grid grid-cols-5 gap-2 mt-2">
      <div v-for="(reprint, index) in reprints" :key="index">
        <div
          class="w-full h-full p-4 pb-2 bg-slate-200 flex flex-col justify-between"
        >
          <img :src="`/data/printed/${reprint.file}`" />
          <div class="w-full flex items-center justify-center mt-2">
            <button
              @click="reprintFile(index)"
              :disabled="currentReprint != null"
              :class="`${currentReprint != null && currentReprint != index ? 'bg-slate-300' : 'bg-green-500'} text-white rounded-sm w-2/3 px-3`"
            >
              {{ currentReprint == index ? "PRINTING" : "Reprint" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "ReprintAdmin",
  props: [],
  data() {
    return {
      reprints: [],
      currentReprint: null,
    };
  },
  watch: {
    currentAnim(n, o) {},
  },

  mounted() {
    this.getReprints();
  },
  methods: {
    getReprints: async function () {
      const rep = await axios.get("/api/reprint/list");
      console.log(rep.data.list);
      this.reprints = rep.data.list;
      setTimeout(() => {
        this.getReprints();
      }, 5000);
    },
    reprintFile: function (a) {
      this.currentReprint = a;
      axios.get(`/api/reprint/trigger/${this.reprints[a].file}`);
      setTimeout(() => {
        this.currentReprint = null;
      }, 5000);
    },
  },
};
</script>
