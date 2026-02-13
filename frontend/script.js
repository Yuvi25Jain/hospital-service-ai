const chat = document.getElementById("chat");
const sendBtn = document.getElementById("sendBtn");
const input = document.getElementById("userInput");

let userName=null;

function addMessage(text,type){

const wrap=document.createElement("div");
wrap.className="message";

const avatar=document.createElement("div");
avatar.className="avatar "+(type==="ai"?"ai-avatar":"user-avatar");
avatar.innerText=type==="ai"?"AI":"U";

const bubble=document.createElement("div");
bubble.className="bubble "+type;
bubble.innerHTML=text;

if(type==="ai"){
wrap.appendChild(avatar);
wrap.appendChild(bubble);
}else{
wrap.appendChild(bubble);
wrap.appendChild(avatar);
}

chat.appendChild(wrap);
chat.scrollTop=chat.scrollHeight;

return bubble;
}

async function typeAI(text){

const bubble=addMessage("", "ai");

for(let i=0;i<text.length;i++){
bubble.innerHTML+=text[i];
await new Promise(r=>setTimeout(r,10));
}

}

function semanticNormalize(msg){

msg=msg.toLowerCase();

if(msg.includes("kam") || msg.includes("cheap")) msg+=" low price";
if(msg.includes("jaldi") || msg.includes("fast")) msg+=" fast report";

return msg;
}

function detectBooking(msg){

return msg.includes("book") ||
msg.includes("appointment") ||
msg.includes("call");
}

function renderBooking(){

const card=document.createElement("div");
card.className="card";

card.innerHTML=`
<b>Booking Options</b><br>
Phone: +91 9876543210<br>
Book Online: https://hospital-booking-demo.com
`;

chat.appendChild(card);
}

async function send(){

const text=input.value.trim();
if(!text) return;

addMessage(text,"user");

input.value="";

if(!userName){

userName=text;
await typeAI(`Nice to meet you ${userName}. Which service would you want?`);
return;
}

const normalized=semanticNormalize(text);

try{

const res=await fetch("http://localhost:5000/agent",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({message:normalized})
});

const data=await res.json();

await typeAI(data.reply);

if(data.suggestions){
data.suggestions.forEach(h=>{

const card=document.createElement("div");
card.className="card";

card.innerHTML=`<b>${h.hospital}</b><br>
Price ₹${h.price}<br>
Report ${h.report_time_hours} hrs<br>
Rating ${h.rating}`;

chat.appendChild(card);

});
}

if(detectBooking(text)){
renderBooking();
}

}catch(e){
await typeAI("Backend connection failed.");
}

}

sendBtn.onclick=send;

input.addEventListener("keypress",(e)=>{
if(e.key==="Enter") send();
});

window.onload=()=>{
typeAI("Hello! I'm your clinical assistant. What is your name?");
};
