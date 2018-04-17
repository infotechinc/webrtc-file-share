const template = `
<h1 class="title is-bold big">{{ title }}</h1>
`;

Vue.component("app-header", {
  template: template,
  props: ["title"]
});
