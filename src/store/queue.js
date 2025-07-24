import { defineStore } from "pinia";
import { call, db } from "@/firebase"

export const useQueueStore = defineStore({
  id: "queue",
  state: () => {
    return {
      loading: false,
      queues : [
        
      ]
    }
  },
  actions: {
    async fetchQueues(){
      this.loading = true
      let res = await call("listQueues", {});
      if(res.success){
        this.queues = res.data
      }
      this.loading = false
    },    
    async enqueue(data){
      this.loading = true
      let res = await call("enqueue", data);
      if(res.success){
        this.queues.push(res.data)  // เอาข้อมูลที่ backend ส่งกลับมา push เข้า state
      }
    this.loading = false
},
    async dequeue(){
      this.loading = true
      let res = await call("dequeue", {});
     if(res.success){
       await this.fetchQueues()  // โหลดข้อมูลคิวใหม่จาก backend เพื่อ sync state
      }
    this.loading = false
},
  }
});
