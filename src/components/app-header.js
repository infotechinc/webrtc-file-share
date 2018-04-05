const template = `
<section class="hero is-primary is-bold">
<div class="hero-body">
  <div class="container">
    <h1 class="title is-size-1">
      {{ title }}
    </h1>
  </div>
</div>
</section>
`;

Vue.component("app-header", {
  template: template,
  props: ["title"]
});
