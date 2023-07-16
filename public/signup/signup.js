async function signup(e){
    try{
        e.preventDefault();
        let signupDetails={
            username:e.target.username.value,
            email:e.target.emailid.value,
            phonenumber:e.target.phno.value,
            password:e.target.password.value
        }
        console.log(signupDetails)
        const response = await axios.post("http://54.85.152.105:3000/user/signup",signupDetails)
            if(response.status === 201){
                alert(response.data.message);
                window.location.href="../login/login.html"
            } 
    } catch(err){
        alert(err.data.message);
        document.body.innerHTML+= `<div style="color:red;">${err.data.message}</div>`;
    }
}