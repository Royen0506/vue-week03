const { createApp } = Vue;

const app = createApp({
  data() {
    return {
      apiUrl: "https://vue3-course-api.hexschool.io",
      path: "royen",
      products: [],
      isNew: true,
      bsProductModal: null,
      bsDelProductModal: null,
      tempProduct: {
        imagesUrl: "",
      },
    };
  },
  mounted() {
    const myToken = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );

    this.bsProductModal = new bootstrap.Modal(this.$refs.productModal);
    this.bsDelProductModal = new bootstrap.Modal(this.$refs.delProductModal);

    axios.defaults.headers.common["Authorization"] = myToken;
    this.checkAdminInfo();
  },
  methods: {
    checkAdminInfo() {
      axios
        .post(`${this.apiUrl}/v2/api/user/check`)
        .then((res) => {
          this.getProductData();
        })
        .catch((err) => {
          alert(err.data.message);
          location.href = "../HTML/index.html";
        });
    },
    getProductData() {
      axios
        .get(`${this.apiUrl}/v2/api/${this.path}/admin/products/all`)
        .then((res) => {
          this.products = res.data.products;
        });
    },
    productModal(product, isNew) {
      if (isNew === "new") {
        this.isNew = true;
      } else {
        this.isNew = false;
      }
      this.tempProduct = { ...product };
      this.bsProductModal.show();
    },
    delProductModal(product) {
      this.tempProduct = { ...product };
      this.bsDelProductModal.show();
    },
    clearTempProduct() {
      this.tempProduct = { imagesUrl: [] };
    },
    deleteProduct() {
      axios
        .delete(
          `${this.apiUrl}/v2/api/${this.path}/admin/product/${this.tempProduct.id}`
        )
        .then((res) => {
          this.bsDelProductModal.hide();
          this.getProductData();
        });
    },
    addImage() {
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push("");
    },
    updateProduct(id) {
      let url = "";
      let http = "";
      if (this.isNew === true) {
        url = `${this.apiUrl}/v2/api/${this.path}/admin/product`;
        http = "post";
      } else {
        url = `${this.apiUrl}/v2/api/${this.path}/admin/product/${id}`;
        http = "put";
      }

      axios[http](url, { data: this.tempProduct })
        .then((res) => {
          this.bsProductModal.hide();
          this.getProductData();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
  },
});

app.mount("#app");
