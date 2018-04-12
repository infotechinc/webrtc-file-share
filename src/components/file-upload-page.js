const template = `
<div class="columns">
  <div class="column">
    <div class="content has-text-centered">

      <h2><br>Connection complete!<br><br></h2>
      <p>Your friend has connected! Now choose the file you would like to transfer.<br><br></p>

      <div class="file is-centered">
        <!-- File Input Button -->
        <label class="file-label">
        <input class="file-input" type="file" name="resume" @change = "onFileChange"><br><br><br>
        <span class="file-cta">
          <span class="file-icon">
            <i class="fas fa-upload"></i>
          </span>
          <span class="file-label">
            Choose a file...
          </span>
        </span>
      </label>
    </div>

  </div>

  <div class="columns">
    <div class="column is-half has-text-centered">
     <h1><strong>Sent Files</strong></h1>
      <!-- Dynamic progress bar -->
      <div v-for="sentFile in sentFiles">
        <div>
          <!-- Show checkbox if file is fully sent -->
          <p><span v-if="sentFile.complete" class="icon has-text-primary">
            <i class="fas fa-check-square"></i>
          </span>
          {{ sentFile.name }}</p>
          <progress v-if="!sentFile.complete" class="progress is-primary" v-bind:value="sentFile.bytesSent" v-bind:max="sentFile.size"></progress>
        </div>
      </div>
    </div>
    <div class="column is-half has-text-centered">
      <h1><strong>Received Files</strong></h1>
        <div v-for="receivedFile in receivedFiles">
          <a v-bind:download=receivedFile.name v-bind:href=receivedFile.file>{{ receivedFile.name }}</a>
        </div>
    </div>
  </div>
  </div>


  <div class="column is-one-third">
  <div style="position:relative">
    <div id="remoteVideos"></div>
    <video id="localVideo"></video>
    </div>
  </div>

  </div>
`;

Vue.component("file-upload-page", {
  template: template,
  props: ["sentFiles", "receivedFiles"],
  methods: {
    onFileChange: function(event) {
      if (event.target.files.length == 0) return;
      console.log(event);
      this.$emit("onFileChange", {
        file: event.target.files[0]
      });
    }
  }
});
