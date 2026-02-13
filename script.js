const chat = document.getElementById("chat");
const sendBtn = document.getElementById("sendBtn");
const input = document.getElementById("userInput");
const suggestionBox = document.getElementById("suggestions");

let userName=null;

function smoothScroll(){
chat.scrollTo({top:chat.scrollHeight,behavior:"smooth"});
}

function addMessage(text,type){

const wrap=document.createElement("div");
wrap.className="message";

const avatar=document.createElement("div");
avatar.className="avatar";
avatar.innerText=type==="ai"?"🤖":"👤";

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
smoothScroll();

return bubble;
}

function typingIndicator(){

const wrap=document.createElement("div");
wrap.className="message";

const avatar=document.createElement("div");
avatar.className="avatar";
avatar.innerText="🤖";

const bubble=document.createElement("div");
bubble.className="bubble ai typing";
bubble.innerHTML="<span>.</span><span>.</span><span>.</span>";

wrap.appendChild(avatar);
wrap.appendChild(bubble);

chat.appendChild(wrap);
smoothScroll();

return wrap;
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

function showChips(){

suggestionBox.innerHTML="";

["cheap MRI","fast blood test","best CT scan","book appointment"].forEach(text=>{

const chip=document.createElement("div");
chip.className="chip";
chip.innerText=text;

chip.onclick=()=>{
input.value=text;
send();
};

suggestionBox.appendChild(chip);

});
}

async function send(){

const text=input.value.trim();
if(!text) return;

addMessage(text,"user");

input.value="";

if(!userName){

userName=text;
await typeAI(`Namaste ${userName} 🙏, bataye aapko kaunsi medical service chahiye?`);
showChips();
return;
}

const normalized=semanticNormalize(text);

const typing = typingIndicator();

try{

const res=await fetch("https://hospital-service-ai.onrender.com/agent",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({message:normalized})
});

typing.remove();

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

typing.remove();
await typeAI("Backend connection failed.");

}

}

sendBtn.onclick=send;

input.addEventListener("keypress",(e)=>{
if(e.key==="Enter") send();
});

window.onload=()=>{
typeAI("Namaste 🙏 !! Me apki kya seva kar sakta hoon? Pehle apna naam bataye.");
};