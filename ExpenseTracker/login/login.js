async function login(e){
    try{
        e.preventDefault();
    console.log(e.target.name);
    const loginDetails={
        email:e.target.email.value,
        password:e.target.password.value
    }
    console.log(loginDetails)
    const response=await axios.post( "http://localhost:3000/user/login",loginDetails)
    if(response.status===200){
        alert(response.data.message)
        localStorage.setItem('token',response.data.token)
        window.location.href="../expense/expense.html"
    }
    else{
        throw new Error(response.data.message)
    }
    }
    catch(err){
        document.body.innerHTML +=`<div style="color:red;">${err.message}</div>`
    }
}
function forgotpassword() {
    window.location.href = "../ForgotPassword/password.html"
}