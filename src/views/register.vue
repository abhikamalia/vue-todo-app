<template>
  
  <div role="alert" class="p-5 check">
       <label style="color: red;font-size:15px;" class="text-center">{{ msg }}</label>
        <div class="input-group mb-4 mt-4">
            
            <input v-model="email"  type="text" class="form-control" placeholder="Email ..."   >
            <input v-model="password"  type="text" class="form-control" placeholder="Password ..."   >
            <input v-model="confirmpassword"  type="text" class="form-control" placeholder="Confirm Password ..."   >
             <div>
                <button class="btn btn-outline-primary" type="button"  @click="Submit"> Register</button>
            </div>
            <br>
           
        </div>
        <p>already a user ?  <router-link to="/login" class="btn btn-outline-success">  Login</router-link></p>
         
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
    name: 'register',
    data(){
        return{
            email: '',
            password: '',
            confirmpassword: '',
            msg: ''

        }
    },
    async beforeCreate() {
      try{
        const res = await axios.get('http://localhost:3000/' ) || await axios.get('http://localhost:3000/register' )
        console.log(res.data)
        if(res.data.message == 'no_user'){
          router.push('/register')
        }
        else{
         router.push('/')
        }
        console.log(res.data)
            
      }catch(e){
            console.error(e)
      }
    },
    methods: {
        async Submit(){
            console.log(this.email , this.password , this.confirmpassword)
            const { data } = await this.$http.post('http://localhost:3000/register' , {email: this.email , password: this.password , confirmpassword: this.confirmpassword})
            console.log(data)
            if(data.message === 'logged_in'){

              userChangeBus.$emit('login' , data)
              router.push('/')
            }
            this.msg = data.message

          //  if(data === '' || data === undefined){
          //      router.push('/login')
          //  }
          //  else{
          //      router.push('/')
          //  }
            this.email = ''
            this.password = ''
            this.confirmpassword = ''
        },
    },
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
  margin-top:70px;
}
</style>
