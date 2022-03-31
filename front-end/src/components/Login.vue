<template>
  <div class="hero">
    <div class="heroBox">
      <form>
        <fieldset class="form-group">
          <legend>Register for an account</legend>
          <input placeholder="first name" v-model="firstName" class="form-control">
          <input placeholder="last name" v-model="lastName" class="form-control">
        </fieldset>
        <fieldset class="form-group">
          <input placeholder="username" v-model="username" class="form-control">
          <input type="password" placeholder="password" v-model="password" class="form-control">
        </fieldset>
        <fieldset class="form-group">
          <button type="submit" @click.prevent="register" class="btn btn-primary">Register</button>
        </fieldset>
      </form>
      <p v-if="error" class="error">{{error}}</p>
      <form class="space-above">
        <fieldset class="form-group">
          <legend>Login</legend>
          <input placeholder="username" v-model="usernameLogin" class="form-control">
          <input type="password" placeholder="password" v-model="passwordLogin" class="form-control">
        </fieldset>
        <fieldset class="form-group">
          <button type="submit" @click.prevent="login" class="btn btn-primary">Login</button>
        </fieldset>
      </form>
      <p v-if="errorLogin" class="error">{{errorLogin}}</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Login',
    data() {
      return {
        firstName: '',
        lastName: '',
        username: '',
        password: '',
        usernameLogin: '',
        passwordLogin: '',
        error: '',
        errorLogin: '',
      }
    },
    methods: {
      async register() {
        this.error = '';
        this.errorLogin = '';
        if (!this.firstName || !this.lastName || !this.username || !this.password)
          return;
        try {
          let response = await fetch('/api/users', {
            method: 'post',
            body: JSON.stringify({
              firstName: this.firstName,
              lastName: this.lastName,
              username: this.username,
              password: this.password,
            }),
            headers: {
              'Content-Type': 'application/json'
            }
          });
          let responseObj = JSON.parse(await response.text());
          if (response.status !== 200) {
            this.error = responseObj.message;
          } else {
            this.$root.$data.user = responseObj.user;
          }
        } catch (error) {
          this.error = "Error: " + error;
          this.$root.$data.user = null;
        }
      },
      async login() {
        this.error = '';
        this.errorLogin = '';
        if (!this.usernameLogin || !this.passwordLogin)
          return;
        try {
          let response = await fetch('/api/users/login', {
            method: 'post',
            body: JSON.stringify({
              username: this.usernameLogin,
              password: this.passwordLogin,
            }),
            headers: {
              'Content-Type': 'application/json'
            }
          });
          let responseObj = JSON.parse(await response.text());
          if (response.status !== 200) {
            this.errorLogin = responseObj.message;
          } else {
            this.$root.$data.user = responseObj.user;
          }
        } catch (error) {
          this.errorLogin = "Error: " + error;
          this.$root.$data.user = null;
        }
      },
    }
  }
</script>

<style scoped>
  .space-above {
    margin-top: 50px;
  }

  .hero {
    padding: 50px;
    display: flex;
    justify-content: center;
  }

  .heroBox {
    text-align: center;
  }

  .hero form {
    font-size: 14px;
  }

  .hero form legend {
    font-size: 20px;
  }

  input {
    margin-right: 10px;
  }

  .error {
    margin-top: 10px;
    display: inline;
    padding: 5px 20px;
    border-radius: 30px;
    font-size: 10px;
    background-color: #d9534f;
    color: #fff;
  }
</style>
