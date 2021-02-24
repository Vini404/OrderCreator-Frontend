interface FeedbackProps{
    hidden:Boolean,
    color:String,
    content:String
}

export const Feedback:React.FC<FeedbackProps>=({hidden,color,content})=>{
    
    if(hidden===false){
        return(
            <>
            </>
        )
    }else{
        return(
            <h1 style={{color:String(color)}}>{content}</h1>
        )
    }


}