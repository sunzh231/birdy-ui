<template>
  <div id="admin-login">
    <form class="">
      <div class="form-group">
        <span class="form-title">用户登陆</span>
      </div>
      <div class="form-group">
        <div class="form-control">
          <input type="text"/>
        </div>
        <div class="form-tip"></div>
      </div>
      <div class="form-group">
        <div class="form-control">
          <input type="password"/>
        </div>
        <div class="form-tip"></div>
      </div>
      <div class="form-group">
        <div class="remember-me">
          <input type="checkbox"/>记住密码
        </div>
        <div class="forgot-password">
          <a v-link="">忘记密码？</a>
        </div>
      </div>
      <div class="form-group">
        <button class="fill-btn">登陆</button>
        <a v-link="#">还没有账号，马上去注册<a>
      </div>
    </form>
  </div>
</template>

<style scoped lang="scss">
#admin-login {
  form {
    width: 400px;
    height: 350px;
    margin: 0 auto;
    border: #0000FF solid 1px;
    border-radius: 10px;

    .form-group {
      width: 360px;
      margin: 20px auto;
      clear: both;

      a {
        color: #000000;
      }

      .form-title {
        font-size: 24px;
      }

      .form-control {

        input {
          width: 100%;
          height: 40px;
          border: #FF00FF solid 1px;
          border-radius: 5px;
        }
      }

      .form-tip {

      }

      .remember-me {
        float: left;
      }

      .forgot-password {
        float: right;
      }

      .fill-btn {
        border: #FF0000 solid 1px;
        border-radius: 20px;
        width: 100%;
        height: 40px;
        margin: 20px 0;
        font-size: 21px;
      }
    }

  }
}
</style>
