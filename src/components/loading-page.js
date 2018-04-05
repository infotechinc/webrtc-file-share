const template = `
<div class="container has-text-centered">

<p class="is-size-5 has-text-weight-semibold"><br><br><br>Waiting for your friend to connect!<br><br><br></p>

<!-- Spinner icon -->
<span class="icon is-large has-text-primary">
  <i class="fas fa-spinner fa-3x fa-pulse"></i>
</span>

</div>`;

Vue.component("loading-page", {
  template: template
});
