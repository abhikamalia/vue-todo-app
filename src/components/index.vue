<template>
  <div role="alert" class="p-5 check">
        
        <div class="input-group mb-4 mt-4">
            <input v-model="newItem" :class="{green:newItem.length > 1}" type="text" class="form-control form-input-group" placeholder="Add a Task ..." aria-label="Recipient's username" aria-describedby="button-addon2" >
             <select v-model="category" class="form-control" id="sel1">
                <option default>work</option>
                <option>personal</option>
                <option>interest</option>
                <option>books</option>
              </select>
            <div>
                <input class="form-control" v-model="date" type="date"  />
            </div>
            <div class="input-group-append">
                <button class="btn btn-outline-primary" type="button" id="button-addon2" @click="addToList"> + Add</button>
            </div>
        </div> 
        <div class="block rounded">
          
            <div class="row">
               
                <ul class="list-group list-block">
                     <label class="label float-left" style="font-weight:solid;"><b>{{ today }}</b></label><br>
                     <div class="input-group-prepend" v-if="list.length == 0">
                            <button class="btn btn-outline-secondary" type="button"  id="button-addon3"  disabled> {{ empty_message }}</button>
                            
                        </div>
                    <div class="input-group-text" v-for="item in list" :key="item.id">
                        <div class="input-group-prepend">
                             
                            <div class="input-group-text">
                                <input type="checkbox" :checked="item.checkBoxCheck" v-if="!item.checkBoxCheck"  @click="checkboxCheck(item.id)" aria-label="Checkbox for following text input">
                                <input type="checkbox" :checked="item.checkBoxCheck" v-else-if="item.checkBoxCheck"  @click="checkboxCheck(item.id)" aria-label="Checkbox for following text input" disabled>
                            </div>
                        </div>
                       
                        <input type="text" class="form-control" v-if="!item.checkBoxCheck"  :value="item.item" aria-label="Text input with checkbox" aria-describedby="button-addon3" >
                        <input type="text" class="form-control" v-else-if="item.checkBoxCheck" :value="item.item" aria-label="Text input with checkbox" aria-describedby="button-addon3" disabled>
                         
                         <div class="input-group-append ml-5">
                           
                            <!-- Button trigger modal -->
                            <button type="button" class="btn btn-outline-primary mr-3" data-toggle="modal"  @click="EditTask(item.id , item.item)"  data-target="#exampleModalCenter">
                              Edit
                            </button>

                            <div >
                            <button class="btn btn-outline-danger mr-3" type="button" id="button-addon3" @click="DeleteFromList(item.id)"> Delete </button>
                           <button class="btn btn-outline-secondary" type="button" style="width:80px;" id="button-addon3"  disabled> {{ item.category }}</button>
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
  name: 'index',
  data() {
        return{
            list:[],
            newItem: '',
            date: '',
            user: '',
            category: '',
            current_date: this.getDate(),
            today: '',
            checkboxValue: false,
            empty_message: "No tasks to do today yet...Have a nice day..:)",
            
          
            
        }
  },
  async beforeCreate(){
    try{
        const res = await axios.get('http://localhost:3000/' )
        console.log(res.data.message)
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
  created(){

    userChangeBus.$on('logout' , (user) => {
      this.user = user
    })
  },
  async mounted(){
        try{
            const res = await axios.get('http://localhost:3000/' )
            this.list = res.data.rows
            this.today = res.data.today;
            console.log(res.data)
            console.log(this.list.length)
            
            
        }catch(e){
            console.error(e)
        }
  },
  methods: {
        async addToList(){
            console.log(this.date , this.newItem)
            const { data } = await this.$http.post('http://localhost:3000/add' , {name: this.newItem , date: this.date , user: this.user ,  category: this.category});
            console.log(data)
            const res = await axios.get('http://localhost:3000/' )
            this.list = res.data.rows

            // this.list.push(this.newItem)
            this.newItem = ''
        },
        async DeleteFromList(id){
            const url = 'http://localhost:3000/delete/' + id
            const res = await axios.get(url)
            console.log(res.data)
            const res2 = await axios.get('http://localhost:3000/' )
            this.list = res2.data.rows
            // this.list = res.data
            
        },
        
        getDate: function(){
            var myDate = new Date();
            var month = ('0' + (myDate.getMonth() + 1)).slice(-2);
            var date = ('0' + myDate.getDate()).slice(-2);
            var year = myDate.getFullYear();
            
            // var current_time = myDate.getHours(),
            // console.log(date + '-' + month + '-' + year)
            return date + '-' + month + '-' + year;
        },
        async checkboxCheck(itemId){
          if(!this.checkboxValue){
              this.checkboxValue = true
              console.log(this.checkboxValue , itemId)
              const { data } = await this.$http.post('http://localhost:3000/check/update' , {checkboxValue: this.checkboxValue , itemId: itemId});
              console.log(data)
              const res = await axios.get('http://localhost:3000/')
              this.list = res.data.rows
              this.checkboxValue = false

          }
          
          // else if(this.checkboxValue){
          //     this.checkboxValue = false
          //     console.log(this.checkboxValue , itemId)
          //     const { data } = await this.$http.post('http://localhost:3000/check/update' , {checkboxValue: this.checkboxValue , itemId: itemId});
          //     console.log(data)
          //     const res = await axios.get('http://localhost:3000/')
          //     this.list = res.data.rows
          // }
            
        },
        async EditTask(itemId , item){
            const url = 'http://localhost:3000/updatetask/'
            let newTask = prompt('Edit task' , item);

            if (newTask !== null || newTask !== "") {
              const { data } = await this.$http.post(url , {itemId: itemId , editedTask: newTask});
              console.log(data);
              const res = await axios.get('http://localhost:3000/')
              this.list = res.data.rows
            } else {
              console.log('error');
            } 
          }
    }
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.list-block{
  width: auto;
}
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