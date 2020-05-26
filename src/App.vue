<template>
  <div id="app" class="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <navbar></navbar>
    <div class="row">
      <div class="col-sm-2">
          <sidebar></sidebar>
      </div>
      <div class="col-sm-9">
       <router-view />
      </div>

    </div>
    
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  </div>
</template>
<script>
    import navbar from '@/views/navbar'
    import sidebar from '@/views/sidebar'
    export default {
        name: 'App',
        components: {
          // HelloWorld
          navbar,
          sidebar
        }
    }
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
 
}

 
.app{
  height: 500px ;
  width: 100%;
  background-image:linear-gradient(to bottom ,rgba(128, 255, 255 , 1), rgba(255 , 255 , 255 ,1));
}
</style>