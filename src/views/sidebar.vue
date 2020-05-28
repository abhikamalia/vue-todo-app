<template>
    <div class="sidebar">

        <div class="mt-5">
          <div v-if="user === '' ">
              <router-link to="/register"  class="active">Register</router-link>
              <router-link to="/login"  class="active">Login</router-link>
          </div>
          <div v-else>
              <router-link to="/alltasks"  class="active">All Tasks</router-link>
              <router-link to="/completedtasks"  class="active">Completed Tasks</router-link>
              <router-link to="/work" class="active">Work</router-link>
              <router-link to="/personal" class="active">Personal</router-link>
              <router-link to="/interest" class="active">Interest</router-link>
              <router-link to="/books" class="active">Books</router-link>
          </div>
            
            
           
        </div>
    </div>

</template>

<script>
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import router from '../router'
import { userChangeBus }  from '../main'

import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios , axios)
export default {
    name: 'SideBar',
    data(){
        return {
            user: '',
        }
    },
    created(){
      userChangeBus.$on('login' , (data) => {
          this.user = data.user
      })
      userChangeBus.$on('logout' , (user) => {
        this.user = user
      })
    },
    async beforeCreate(){
        try{
            const res = await axios.get('http://localhost:3000/')
            console.log(res.data)
            if(res.data.message == 'no_user'){
              router.push('/login')
            }
            else{
              this.user = res.data.user
            }
            console.log(res.data)
                
        }catch(e){
                console.error(e)
        }
    },
}
</script>
<style scoped>
    .sidebar {
  margin: 0;
  padding: 0;
  width: 200px;
  background-color: #E6FBFF;
  position: fixed;
  height: 100%;
  overflow: auto;
  margin-top:70px;
}

.sidebar a {
  display: block;
  color: black;
  padding: 16px;
  text-decoration: none;
}
 



div.content {
  margin-left: 200px;
  padding: 1px 16px;
  height: 1000px;
}

@media screen and (max-width: 700px) {
  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
  }
  .sidebar a {float: left;}
  div.content {margin-left: 0;}
}

@media screen and (max-width: 400px) {
  .sidebar a {
    text-align: center;
    float: none;
   
  }
}
a{
     font-size: 20px;
}
</style>