// ByteWorks Hub: anonymous Firebase device authentication + explicitly approved device IDs.
// All devices share one Firestore workshop record. This version detects conflicting writes
// rather than silently overwriting remote changes. Do not use for simultaneous heavy editing.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import { getFirestore, doc, getDoc, onSnapshot, runTransaction } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';

const config={
  apiKey:'AIzaSyCGn8Qk8pgd26S6TV2JWe8a8JjYnlJInNY',
  authDomain:'byteworks-5b5fb.firebaseapp.com',
  projectId:'byteworks-5b5fb',
  storageBucket:'byteworks-5b5fb.firebasestorage.app',
  messagingSenderId:'6947987078',
  appId:'1:6947987078:web:44cadb84e5a3786c873b07',
  measurementId:'G-KZTRE9BDZ9'
};
const app=initializeApp(config);
const auth=getAuth(app);
const firestore=getFirestore(app);
const workshop=doc(firestore,'workspaces','main');
let deviceId='', approved=false, ready=false, revision=null, remoteUnsub=null;
let inflight=false, nextState=null, started=false;
const emit=(payload)=>window.dispatchEvent(new CustomEvent('bw-cloud-update',{detail:payload}));
const fail=(error)=>{console.error('ByteWorks Cloud:',error); ready=false;window.BW_CLOUD_READY=false;emit({mode:'error',ready:false,uid:deviceId,error:error?.message||String(error)})};
const emitState=(record)=>{revision=record.revision||0;emit({mode:'ready',ready:true,state:record.data,uid:deviceId});};

async function startApproved(){
 if(started)return;started=true;approved=true;
 try{
  // A new workspace is created only if no remote record exists.
  // Existing browser data is NOT automatically sent to the cloud.
  const first=await getDoc(workshop);
  if(!first.exists()){
   const empty={jobs:[],customers:[],appointments:[],payments:[],receipts:[],activities:[],settings:{businessName:'ByteWorks',location:'Mount Eliza, Victoria',receiptFooter:'Thank you for choosing us.',reminders:true},seq:1};
   await runTransaction(firestore,async t=>{const snapshot=await t.get(workshop);if(!snapshot.exists())t.set(workshop,{revision:0,data:empty,updatedAt:new Date().toISOString(),updatedBy:deviceId})});
  }
  remoteUnsub=onSnapshot(workshop,(snap)=>{
   if(!snap.exists()||snap.metadata.hasPendingWrites)return;
   const record=snap.data();
   if(!ready){ready=true;emitState(record);return}
   if(inflight||nextState)return; // local pending writes are checked inside transaction
   if(record.revision!==revision)emitState(record);
  },fail);
 }catch(error){fail(error)}
}

function storeConflict(state){
 try{localStorage.setItem('byteworks_hub_conflict_backup',JSON.stringify({at:new Date().toISOString(),data:state}))}catch{}
 alert('Another device edited ByteWorks Hub while you were working. Your unsynced changes have been saved locally under byteworks_hub_conflict_backup. The latest cloud data will be loaded. Export a backup before reconciling any missing changes.');
}
async function flush(){
 if(inflight||!nextState||!ready||!approved)return;
 inflight=true;
 const state=nextState;nextState=null;
 try{
  const expected=revision;
  const newRev=await runTransaction(firestore,async t=>{
   const snap=await t.get(workshop);
   const current=snap.exists()?snap.data().revision:0;
   if(current!==expected)throw new Error('BYTEWORKS_CONFLICT');
   const next=current+1;
   t.set(workshop,{revision:next,data:state,updatedAt:new Date().toISOString(),updatedBy:deviceId});
   return next;
  });
  revision=newRev;
 }catch(error){
  if(error.message==='BYTEWORKS_CONFLICT'){
   storeConflict(nextState||state);nextState=null;
   try{const fresh=await getDoc(workshop);if(fresh.exists())emitState(fresh.data())}catch(e){fail(e)}
  }else{
   // Do not claim successful cloud save after a network or permissions error.
   nextState=nextState||state;
   console.error('Cloud save failed',error);
   alert('Cloud save failed: '+error.message+' Your local browser may still contain the changes. Export a JSON backup and check your connection.');
  }
 }finally{inflight=false;if(nextState&&ready)flush()}
}
window.addEventListener('bw-local-change',event=>{if(!ready||!approved)return;nextState=event.detail.state;flush()});

onAuthStateChanged(auth,async user=>{
 if(!user){try{await signInAnonymously(auth)}catch(error){fail(error)}return}
 deviceId=user.uid;
 emit({mode:'loading',ready:false,uid:deviceId});
 const approvalDoc=doc(firestore,'approvedDevices',deviceId);
 try{
  const snapshot=await getDoc(approvalDoc);
  if(snapshot.exists()&&snapshot.data().enabled===true){await startApproved()}
  else emit({mode:'pending',ready:false,uid:deviceId});
 }catch(error){fail(error)}
});
