const valuesElement = {
    email: document.getElementById('email'),
    password: document.getElementById('password'),
    signin: document.getElementById('signin'),
    token: localStorage.getItem('token')
}



valuesElement.signin.addEventListener('submit', async (event) => {
    event.preventDefault();
    console.log("This is signin.js");
    

    try {
        console.log("This is try of signin.js ");
        const Dbcheck=await fetch('http://localhost:3000/signin',{
            method:'POST',
            headers:{
                'Content-type':'application/json'
            },
            body:JSON.stringify({ email: valuesElement.email.value, password: valuesElement.password.value})
        })
        const DbCheckData=await Dbcheck.json();
        
        if (valuesElement.token || DbCheckData.ok) {
            console.log("This is if of signin.js of checking token exist or not");


            const response = await fetch('http://localhost:3000/signin', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${valuesElement.token}`

                },
                body: JSON.stringify({ email: valuesElement.email.value, password: valuesElement.password.value })
            })
            console.log("After fetch api inside try and inside if");

            console.log(response);
            if (response.ok) {
                console.log("Inside response.ok in signin.js");
                

                if (response.headers.get('Content-Type') && response.headers.get('Content-Type').includes('application/json')) {
                console.log("Inside response type check");

                    
              
                
                const data = await response.json();
                console.log("Below is data.msg console after awaiting response.json()");
                

                console.log(data.msg);

            


           

                valuesElement.email.value = '';
                valuesElement.password.value = '';
                console.log("Below is signin.js window.location....");

                if (data.redirect) {
                    
                    window.location.href = '/main.html'
                }
                
            }else{
                console.log('Not an json type of response');
                window.location.href = '/signin.html'
                
            }
            


            } else{
                console.log('Response is not ok');
                
                window.location.href = '/signin.html'

            }

        }else{
            console.log('Authorization required and token is missing');

            window.location.href = '/signin.html'
        }


    } catch (error) {
        console.log('This is catch of signin.js');
        
        console.log('Error: ', error);


    }

})