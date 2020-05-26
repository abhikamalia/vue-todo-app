<template>
    <div>
        <nav class="navbar navbar-light navbar-default fixed-top row" style="background-image: linear-gradient(to right,rgba(128,255,255,1), rgba(102,102,255,1));box-shadow: 1px 1px 10px 0px;">
            <!-- Navbar content -->
            
            <router-link to="/" class=" ml-5 btn btn-outline-secondary rounded" style="font-family:Candara;font-size:30px;">Kaizen</router-link>
            
            <div style="border-radius:50%" class="float-right"></div>
            
            <button v-if="user !== '' " @click="logout" class=" ml-5 btn  rounded float-right mb-4" style="font-family:Candara;font-size:20px;">{{ user }} [ logout ]</button>
        </nav>
       
    </div>
    
</template>

<script>
import router from '../router'

import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios , axios)
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { userChangeBus } from '../main'


export default {
    name: 'NavBar',
    data(){
        return {
            user: ''
        }
    },
    created(){
        userChangeBus.$on('login' , (user) => {
            this.user = user
        })
    },
    async beforeCreate(){
        try{
            
            const res = await axios.get('http://localhost:3000/' )
            console.log(res.data)
            if(res.data == 'no_user'){
                router.push('/login')
            }
            else{
                this.user = res.data.user
                console.log(this.user)
            }
            
            
            console.log(res.data)
                
        }catch(e){
                console.error(e)
        }
    },
    methods: {
        async logout(){
            const res = await axios.get('http://localhost:3000/logout' )
            this.user = res.data
            console.log(this.user)
            if(this.user == ''){
                userChangeBus.$emit('logout' , this.user)
                router.push('/login')
            }
        }
    }
}
</script>