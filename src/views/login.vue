<template>
  <div role="alert" class="p-5 check">
        <label style="color: red;font-size:15px;" class="text-center">{{ message }}</label>
        <div class="input-group mb-4 mt-4">
            
            <input v-model="email"  type="text" class="form-control" placeholder="Email ..."   >
            <input v-model="password"  type="text" class="form-control" placeholder="Password ..."   >
             <div>
                <button class="btn btn-outline-primary" type="button"  @click="Login"> Login</button>
            </div>
            <br>
           
        </div>
        <p>Not a user yet ?  <router-link to="/register" class="btn btn-outline-success">  Register</router-link></p>
         
    </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import router from '../router'
import { userChangeBus } from '../main'
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'

Vue.use(VueAxios , axios)
export default {
  name: 'login',
  data(){
    return {
      email: '',
      password: '',
      message: ''
     
    }
  },
  async beforeCreate() {
      try{
        const res = await axios.get('http://localhost:3000/' ) || await axios.get('http://localhost:3000/login' )
        console.log(res.data.message)
        if(res.data.message == 'no_user'){
          router.push('/login')
        }
        else{
         router.push('/')
        }
        console.log(res.data)
            
      }
      catch(e){
            console.error(e)
      }
  },
  methods: {
      async Login(){
        console.log(this.email , this.password)
        const { data } = await this.$http.post('http://localhost:3000/login' , {email: this.email , password: this.password })
        console.log(data.user)
        if(data.message == 'logged_in'){
          console.log(data.user)
          userChangeBus.$emit('login' , data)
          router.push('/')
        }
        else{
          this.message = data.message
        }
        
        this.email = ''
        this.password = ''
        
      }
  }
//   async mounted(){
//         try{
//             const res = await axios.get('http://localhost:3000/' )
//             this.something = res.data
//             console.log(res.data)
            
//         }catch(e){
//             console.error(e)
//         }
//     },
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.check{
  margin-top: 70px;
}
</style>
