<template>
  <div role="alert" class="p-5 check">
        
        
        <div class="block rounded">
        <button class="btn btn-outline-secondary float-right" type="button" @click="show_all">{{ show_all_name }}</button>
            <div class="row">
                
                <ul class="list-group list-group-flush">
                   
                   <label class="label float-left" style="font-weight:solid;"><b>{{ today }}</b></label><br>
                   <div class="input-group-prepend" v-if="list.length == 0">
                            <button class="btn btn-outline-secondary" type="button"  id="button-addon3"  disabled> {{ empty_message }}</button>
                            
                        </div>
                    <div class="input-group-text" v-for="item in list" :key="item.id">
                        <div class="input-group-prepend">
                            <div class="input-group-text">
                                <input type="checkbox" :checked="item.checkBoxCheck" v-if="!item.checkBoxCheck"  @click="checkboxCheck(item.id)" aria-label="Checkbox for following text input">
                                <input type="checkbox" :checked="item.checkBoxCheck" v-else-if="item.checkBoxCheck"   aria-label="Checkbox for following text input" disabled>
                            </div>
                        </div>
                         <input type="text" class="form-control" v-if="!item.checkBoxCheck" :value="item.item" aria-label="Text input with checkbox" aria-describedby="button-addon3" >
                        <input type="text" class="form-control" v-else-if="item.checkBoxCheck" :value="item.item" aria-label="Text input with checkbox" aria-describedby="button-addon3" disabled>
                         <div class="input-group-append ml-5">
                            <button class="btn btn-outline-danger mr-3"  type="button" id="button-addon3" @click="DeleteFromList(item.id)"> Delete </button>
                            <div >
                                <button class="btn btn-outline-secondary" type="button" style="width:80px;" id="button-addon3"  disabled> {{ item.category }}</button>
                            </div> 
                            <div >
                                <button class="btn btn-outline-secondary ml-3" v-if="show_all_button" type="button"  id="button-addon3"  disabled> {{ item.date }}</button>
                            </div>
                                 
                        </div>
                    </div>
                    
                </ul>
                
            </div>
        </div>

        
        <!-- <div>
            <div class="alert alert-primary" v-for="item in list" :key="item.id" role="alert">
                <div>
                    <span  class="float-left"> {{ item.date }} </span><span>{{ item.item }} </span>
                </div>
            </div>
        </div>  -->
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
  name: 'interest',
  data() {
        return{
            list:[],
            
            date: '',
            user: '',
            current_date: this.getDate(),
            today: '',
            show_all_button: false,
            show_all_name: 'Show all',
            checkboxValue: false,
            empty_message: "No tasks on your interest to do today yet...Have a nice day..:)",
        }
  },
  async beforeMount(){
    try{
        const res = await axios.get('http://localhost:3000/category/interest' )
        console.log(res.data)
        if(res.data == 'no_user'){
          router.push('/login')
        }
        else{
          this.user = res.data.user
          this.today = res.data.today.date2

        }
        
        
        console.log(res.data)
            
      }catch(e){
            console.error(e)
      }
  },
  created(){

    userChangeBus.$on('logout' , (user) => {
      this.user = user
    })
  },
  async mounted(){
        try{
            const res = await axios.get('http://localhost:3000/category/interest' )
            this.list = res.data.rows
            console.log(res.data)
            
        }catch(e){
            console.error(e)
        }
  },
  methods: {
        // async addToList(){
        //     console.log(this.date , this.newItem)
        //     const { data } = await this.$http.post('http://localhost:3000/add' , {name: this.newItem , date: this.date , user: this.user});
        //     console.log(data)
        //     const res = await axios.get('http://localhost:3000/' )
        //     this.list = res.data.rows
        //     // this.list.push(this.newItem)
        //     this.newItem = ''
        // },
        async DeleteFromList(id){
            const url = 'http://localhost:3000/delete/' + id
            const res = await axios.get(url)
            // this.list = res.data
            console.log(res.data)
            if(!this.show_all_button){
                  const res = await axios.get('http://localhost:3000/')
                  this.list = res.data.rows
              }
              else if(this.show_all_button){
                  const res = await axios.get('http://localhost:3000/all/interest')
                  this.list = res.data.rows
              }
        },
        getDate: function(){
            var myDate = new Date();
            var month = ('0' + (myDate.getMonth() + 1)).slice(-2);
            var date = ('0' + myDate.getDate()).slice(-2);
            var year = myDate.getFullYear();
            
            // var current_time = myDate.getHours(),
            console.log(date + '/' + month + '/' + year)
            return date + '/' + month + '/' + year;
        },
        async show_all(){
            if(!this.show_all_button){
                
                const result = await axios.get('http://localhost:3000/all/interest')
                this.list = result.data.rows
                this.show_all_button = true;
                this.show_all_name = "Show today's"
                console.log(result.data)
            }
            else if(this.show_all_button){
               
                const result = await axios.get('http://localhost:3000/category/interest')
                this.list = result.data.rows    
                this.show_all_button = false
                this.show_all_name = 'Show all'
                console.log(result.data)
            }
        },
        async checkboxCheck(itemId){
           
          if(!this.checkboxValue){
              this.checkboxValue = true
              console.log(this.checkboxValue , itemId)
              const { data } = await this.$http.post('http://localhost:3000/check/update' , {checkboxValue: this.checkboxValue , itemId: itemId});
              console.log(data)
              if(!this.show_all_button){
                  const res = await axios.get('http://localhost:3000/')
                  this.list = res.data.rows
                  this.checkboxValue = false
              }
              else if(this.show_all_button){
                  const res = await axios.get('http://localhost:3000/all/interest')
                  this.list = res.data.rows
                  this.checkboxValue = false
              }
              

            }
        }
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.check{
    margin-top:70px;
}
.green {
  border: 2px solid green;
}
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
.block{
    
    height: auto;
    width: auto;

    
    padding: 30px;
    background-color: white;
    box-shadow: 0px 0px 10px 0px;
}
</style>