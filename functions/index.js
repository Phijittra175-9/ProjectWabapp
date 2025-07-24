const { functions, admin, auth, db, rtdb, cloudRegion } = require("./bootstrap")
const utils = require("./utils")

exports.listTables = functions.region(cloudRegion).https.onCall(async (data, context) => {  
  const result = []
  const tables = await db.collection("tables").get()
  tables.forEach(doc => {
    result.push(doc.data())
  })
  return utils.createSuccess(result)
});

exports.addTable = functions.region(cloudRegion).https.onCall(async (data, context) => {  
  try{
    await db.collection("tables").doc(data.name).set(data) 
    return utils.createSuccess(data)
  } catch (err) {
    return utils.createReject(err.message)
  }
});

exports.reserveTable = functions.region(cloudRegion).https.onCall(async (data, context) => {
  try{
    await db.collection("tables").doc(data.name).update({status: "reserved"})
    return utils.createSuccess(data)    
  }catch(err){
    return utils.createReject(err.message)
  }
});

exports.listQueues = functions.region(cloudRegion).https.onCall(async (data, context) => {
  const result = []
  const snapshot = await db.collection("queues").orderBy("timestamp").get()
  snapshot.forEach(doc => result.push({ id: doc.id, ...doc.data() }))
  return utils.createSuccess(result)

});

exports.enqueue = functions.region(cloudRegion).https.onCall(async (data, context) => {
  try {
    const item = {
      name: data.name,
      timestamp: Date.now()
    }
    const ref = await db.collection("queues").add(item)
    return utils.createSuccess({ id: ref.id, ...item })
  } catch (err) {
    return utils.createReject(err.message)
  }
});

exports.dequeue = functions.region(cloudRegion).https.onCall(async (data, context) => {
  try {
    const snapshot = await db.collection("queues").orderBy("timestamp").limit(1).get()
    if (snapshot.empty) return utils.createReject("ไม่มีคิว")

    const doc = snapshot.docs[0]
    await doc.ref.delete()

    return utils.createSuccess({ id: doc.id, ...doc.data() })
  } catch (err) {
    return utils.createReject(err.message)
  }
});
