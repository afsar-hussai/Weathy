const valuesElement={
    email:document.getElementById('email'),
    password:document.getElementById('password'),
    signup:document.getElementById('signup')
}



valuesElement.signup.addEventListener('submit',async (event)=>{
    event.preventDefault();
    try {
        const response=await fetch('http://localhost:3000/signup',{
            method:'POST',
            headers:{
                "Content-Type": "application/json",

            },
            body:JSON.stringify({email:valuesElement.email.value,password:valuesElement.password.value})
        })

        if (response.ok) {
            const data=await response.json();

            console.log(data.msg);
            localStorage.setItem('token',data.token)
            
            console.log('Data sent successfully');
            
            valuesElement.email.value='';
            valuesElement.password.value='';
            window.location.href='/main.html'

            
            
        }else{
            // alert('signup Failed')
            console.log("signup failed");
            window.location.href='/signup.html'
            
        }
    
        
    } catch (error) {
        console.log('Error: ',error);
        window.location.href='/signin.html'
        
        
    }
   
})