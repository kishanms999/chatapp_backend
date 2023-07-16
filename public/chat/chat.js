const chattable=document.getElementById('chattable');

const message=document.getElementById('message');

const sendbtn=document.getElementById('sendbtn');

const memberlist=document.getElementById('memberslist');

const groupname=document.getElementById('groupname');

const deletegroupbtn=document.getElementById('deletegroupbtn');

const adduserbtn=document.getElementById('adduserbtn');

const addusername=document.getElementById('useradd');

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

sendbtn.addEventListener('click',sendmessage);

async function sendmessage(e){
    try{
        e.preventDefault();
           if(message.value==='' )
           {
               msg.innerHTML="Please Enter message";
               setTimeout(()=>{
                   msg.innerHTML="";
               },3000)
           }
           else{
               const messagedata={
                  message:message.value
               }
               const token=localStorage.getItem('token');
               const groupId=JSON.parse(localStorage.getItem('groupId'));
               const response= await axios.post(`http://54.85.152.105:3000/chat/add-message/${groupId}`,messagedata,{headers:{"Authorization":token}})

               console.log(response.data,">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
               
                    showmessage(response.data.message.username,response.data.message.message)
                    message.value='';
           }
       }
       catch(err){
           console.log(err);
           msg.innerHTML="";
         msg.innerHTML=msg.innerHTML+`<div>${err.data.message}</div>`;
         setTimeout(()=>{
           msg.innerHTML="";
       },3000)
       }
    }    

    async function showmessage(username,message){
        try{
            const token=localStorage.getItem('token');
            const decodedtoken=parseJwt(token);
            let className;
            if(username===decodedtoken.name)
            {
              className='currentuser'
            }
            else{
                className-'otheruser'
            }
            chattable.className="tbody";
            chattable.innerHTML+=`<tr class=${className}><td>${username}-${message}</td></tr>`;
        }catch(err){
            console.log(err);
        }
    }


    window.addEventListener('DOMContentLoaded',getchats);
    window.addEventListener('DOMContentLoaded',getgroupmembers);

    async function getchats(){
        try{
                groupname.innerHTML=JSON.parse(localStorage.getItem('groupName'));

                let groupId=JSON.parse(localStorage.getItem('groupId'));
                let lastmsgId=JSON.parse(localStorage.getItem(`lastmsgId${groupId}`)); 
                console.log(lastmsgId)
                const response= await axios.get(`http://54.85.152.105:3000/chat/get-message?lastmsgId=${lastmsgId}&groupId=${groupId}`);

                console.log(response)
                lastmsgId+=parseInt(response.data.message.length);
                console.log(lastmsgId)

                  
                let existingArray=JSON.parse(localStorage.getItem(`messages${groupId}`))||[];


                   if(existingArray.length>=10){
                    existingArray=[];
                   }

                   let responseArray=response.data.message;

                   let mergedArray=existingArray.concat(responseArray);

                   localStorage.setItem(`lastmsgId${groupId}`,JSON.stringify(lastmsgId));

                   localStorage.setItem(`messages${groupId}`,JSON.stringify(mergedArray));

                   chattable.innerHTML='';

                   for(let i=0;i<mergedArray.length;i++){
                        showmessage(mergedArray[i].username,mergedArray[i].message)
                   }
                   chattable.scrollTop=chattable.scrollHeight;
                  
           }
           catch(err){
               console.log(err);
               msg.innerHTML="";
             msg.innerHTML=msg.innerHTML+`<div>${err.data.message}</div>`;
             setTimeout(()=>{
               msg.innerHTML="";
           },3000)
           }
        }

        async function getgroupmembers(){
            try{

                const groupId=JSON.parse(localStorage.getItem('groupId'));
                const response= await axios.get(`http://54.85.152.105:3000/group/get-members?groupId=${groupId}`);
                console.log(response);
                for(let i=0;i<response.data.message.length;i++){
                    showmember(response.data.message[i])
                }

            }catch(err){
                console.log(err);
                msg.innerHTML="";
              msg.innerHTML=msg.innerHTML+`<div>${err.response.data.message}</div>`;
              setTimeout(()=>{
                msg.innerHTML="";
            },3000)
            }
        }

        deletegroupbtn.addEventListener('click',deleteGroup)
   
        async function deleteGroup(){
         try{
             const groupId=JSON.parse(localStorage.getItem('groupId'));
             const token=localStorage.getItem('token');
             const response= await axios.delete(`http://54.85.152.105:3000/group/delete-group?groupId=${groupId}`,{headers:{"Authorization":token}});
             alert(response.data.message);
             localStorage.removeItem(`messages${groupId}`);
             localStorage.removeItem(`lastmsgId${groupId}`);
             localStorage.removeItem('groupName');
             localStorage.removeItem('groupId');
             window.location.href='../Group/group.html';
 
             
         }catch(err){
             console.log(err);
             msg.innerHTML="";
           msg.innerHTML=msg.innerHTML+`<div>${err.response.data.message}</div>`;
           setTimeout(()=>{
             msg.innerHTML="";
         },3000)
         }
        }

        adduserbtn.addEventListener('click',adduser)

        async function adduser(){
            try{
                if(addusername.value==='' ){
                    msg.innerHTML="Please Enter message";
                    setTimeout(()=>{
                        msg.innerHTML="";
                        },3000)
                }
                else{
                    const usernameobj={
                        username:addusername.value
                    }
                    const groupId=JSON.parse(localStorage.getItem('groupId'));
                    const token=localStorage.getItem('token');
                    const response= await axios.post(`http://54.85.152.105:3000/group/add-user?groupId=${groupId}`,usernameobj,{headers:{"Authorization":token}})
                    console.log(response.data.message);
                    getgroupmembers()
                }
            }
            catch(err){
                console.log(err);
            }
        }

        async function showmember(response){
            try{  
                memberlist.innerHTML+=`<li>${response.username} <button onclick="deleteuser('${response.id}')">Delete User</button> <button onclick="makeadmin('${response.id}')">Make Admin</button></li>`;
            }catch(err){
                throw new Error(err);
            }
        }

        async function deleteuser(id){
            try{
                const groupId=JSON.parse(localStorage.getItem('groupId'));
                const token=localStorage.getItem('token');
                const response= await axios.delete(`http://54.85.152.105:3000/group/delete-user?groupId=${groupId}&delUid=${id}`,{headers:{"Authorization":token}})
                console.log(response.data.message);
                getgroupmembers();
            }
            catch(err){
                console.log(err);
            }
        }

        async function makeadmin(id){
            try{
                const groupId=JSON.parse(localStorage.getItem('groupId'));
                const token=localStorage.getItem('token');
                console.log(token);
                const response= await axios.get(`http://54.85.152.105:3000/group/make-admin?groupId=${groupId}&memUid=${id}`,{headers:{"Authorization":token}})
                console.log(response.data.message);
            }
            catch(err){
                console.log(err);
            }
        }

// setInterval(() => {
//     getchats();
//     getgroupmembers();
// },1000)