const labels=document.querySelectorAll('.form-control label');
const button=document.querySelector('.ripple');

labels.forEach(label=>{
    label.innerHTML=label.textContent.split('')
    .map((letter,index)=>{
        return `<span style='transition-delay:${index*40}ms'>${letter}</span>`
    })
    .join('');
})

button.addEventListener('click',function(e){

    //position anywhere when clicked
    const x=e.clientX;
    const y=e.clientY;
    // console.log(x,y);
      //position of top and left of button
    const buttonTop=e.target.offsetTop;
    const buttonLeft=e.target.offsetLeft;
    // console.log(buttonTop,buttonLeft);

    //getting position of clicked
    const leftPosition=x-buttonLeft;
    const topPosition=y-buttonTop;
    // console.log(topPosition,leftPosition);

    const circle=document.createElement('span');

    circle.classList.add('circle');

    circle.style.top=topPosition+'px';
    circle.style.left=leftPosition+'px';

    this.appendChild(circle);

    setTimeout(()=>circle.remove(),500);
    
    
    

})
