const { createApp } = Vue;

const app = createApp({
  data() {
    return {
      account: "",
      password: "",
    };
  },

  methods: {
    signIn() {
      const url = "https://vue3-course-api.hexschool.io/v2/admin/signin";
      const path = "royen";

      const obj = {
        username: this.account,
        password: this.password,
      };

      axios
        .post(url, obj)
        .then((res) => {
          const { token } = res.data;
          const { expired } = res.data;
          document.cookie = `hexToken=${token}; expires=${expired}`;
          this.account = "";
          this.password = "";
          location.href = "../HTML/products.html";
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
  },
});

app.mount("#app");
