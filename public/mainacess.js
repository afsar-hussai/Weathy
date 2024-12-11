(async ()=>{
    const token=localStorage.getItem('token');

    if (!token) {
        console.log("Token is not present so can't authorize user");
        window.location.href='/signin.html'
        return 
        
        
    }

    try {
        const response=await fetch('http://localhost:3000/main.html',{
            method:'GET',
            headers:{
                'Authorization':`Bearer ${token}`
            }
        })

        if (!response.ok) {
            console.log("Response is not OK so can't authorze");
            window.location.href='/signin.html'
            return;

            
            
        }
        else{
            console.log("successfully Authorized");
            
            
        }
        
    } catch (error) {
        console.log("Error occured: ",error);
        window.location.href='/signin.html'
        
        
    }

})()