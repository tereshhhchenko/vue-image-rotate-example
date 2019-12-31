<template>
  <form action="">
    <label for="">
      Upload image without rotation
      <input type="file" accept="image/x-png,image/jpeg" @change="renderAsIs" />
    </label>
    <img :src="asIs" alt="" />
    <hr />
    <label for="">
      Upload image with rotation
      <input
        type="file"
        accept="image/x-png,image/jpeg"
        @change="onFileSelected"
      />
    </label>
    <img :src="rotated" alt="" />
    <div class="loader" v-if="showLoader"></div>
  </form>
</template>
<script>
import { readAndRotate } from './rotateImage'

export default {
  data() {
    return {
      asIs: '',
      rotated: '',
      showLoader: false
    }
  },
  methods: {
    onFileSelected(e) {
      this.showLoader = true
      readAndRotate(e.target.files[0], this.onRotate)
    },

    onRotate(rotatedBlob) {
      this.showLoader = false
      this.rotated = URL.createObjectURL(rotatedBlob)
    },

    renderAsIs(e) {
      const file = e.target.files[0]
      if (file) {
        if (typeof window.FileReader !== 'function') {
          console.log('Can\t rotate image')
          return
        }
        // TODO: disable button, show loader
        const reader = new FileReader()
        reader.onload = () => {
          this.asIs = reader.result
        }
        reader.readAsDataURL(file)
      }
    }
  }
}
</script>

<style>
img {
  width: 50%;
}

.loader {
  width: 60px;
  height: 60px;
  border-radius: 100%;
  position: relative;
  margin: 30px;
}

.loader:before,
.loader:after {
  content: '';
  position: absolute;
  top: -10px;
  left: -10px;
  width: 100%;
  height: 100%;
  border-radius: 100%;
  border: 10px solid transparent;
  border-top-color: #3498db;
}

.loader:before {
  z-index: 100;
  animation: spin 1s infinite;
}

.loader:after {
  border: 10px solid #ccc;
}

@keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  100% {
    -webkit-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
