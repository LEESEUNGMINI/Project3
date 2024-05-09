const arrow1=document.querySelector(".arrow1")
const arrow2=document.querySelector(".arrow2")
const arrow3=document.querySelector(".arrow3")
const edit=document.querySelector(".edit")
const exEdit=document.querySelector(".ex_edit")

arrow1.addEventListener("click",function(){
  if (edit.style.display === "none") {
    edit.style.display = "block"
    this.style.transform = "rotate(360deg)"
  } else {
    edit.style.display = "none"; 
    this.style.transform = "rotate(180deg)"
  }
})
arrow3.addEventListener("click",function(){
  if (edit.style.display === "none") {
    exEdit.style.display = "block"
    this.style.transform = "rotate(360deg)"
  } else {
    exEdit.style.display = "none"; 
    this.style.transform = "rotate(180deg)"
  }
})


