import "./styles.css"
import search from "../../assets/search.png"
import { Link } from "react-router-dom"
import { useEffect, useState,FormEvent } from "react"
import api from "../../services/api"
import { Feedback } from "../../component/feedback/Feedback"

export const ModifyOrder:React.FC  = () => {

    interface ProductsData{
        name:String,
        UnitPrice:number,
        unitAllowBuy:number
    }
    
    //Variavel para liberar os inputs,somente quando o pedido estiver sido encontrado
    const [inputDisable,setInputDisable] = useState(true)
    
    //Variaveis para armazenas os dados do pedido, tanto da api, quanto o valor atualizado pelo usuario
    const [product,setProduct] = useState("")
    const [amount,setAmount] =  useState(0)
    const [unitPrice,setUnitPrice] = useState(0)

    //Variaveis para comparação 
    const [allProducts,setAllProducts] = useState([])
    const [priceBase,setPriceBase] = useState(0)
    const [unitAllowBuy,setUnitAllowBuy] = useState(0)

    //Variaveis para armazenar a regra de negocio referente a rentabilidade
    const [color,setColor] = useState("")
    const [content,setContent] = useState("")
    const [hidden,setHidden] = useState(false)

    const [data,setData] = useState([])
    const [id,setId] = useState("")


    useEffect(()=>{
        async function SearchAllProducts(){
            const response = await api.get("/product")
            const data = response.data
            setData(data)
            const allProducts = data.filter((e:any)=>{
                return e.name
            })


            setAllProducts(allProducts)
        }
        SearchAllProducts()
    },[])
    
    async function SearchOrderAndSetInputValues(){
        if(id===""){
            alert("Por favor, informe o ID")
        }
        const options = {
            headers:{
                id:id
            }
        }
        const response = await api.get("/order",options)
      
       if(response.data==="ID invalido"){
           alert("O ID digitado é invalido ")
           return 
       }
       
        const item = response.data.item
        console.log(item.product,item.amount,item.unitPrice)
        setProduct(item.product)
        setAmount(item.amount)
        setUnitPrice(item.unitPrice)
        setInputDisable(false)
    }

    function VerifyPrice(PriceSelected:any,PriceBase:any){
        
        if(PriceSelected>PriceBase){
            setContent("Rentabilidade Ótima")
            setColor("green")
            setHidden(true)
        }
        if(PriceSelected<=PriceBase && PriceSelected>PriceBase*0.9){
            setContent("Rentabilidade boa")
            setColor("orange")
            setHidden(true)
        }
        if(PriceSelected<PriceBase*0.9){
            console.log("aqui")
            setContent("Rentabilidade ruim")
            setColor("red")
            setHidden(true)
        }
    }

    function VerifyMultiples(numberToVerify:number,multipleNumber:number){
       console.log(numberToVerify,multipleNumber)
        if(numberToVerify<=0){
            alert(`Coloque um numero multiplo de ${multipleNumber}`)
        }
        if(multipleNumber===0){
            return true
        }
        if(numberToVerify%multipleNumber===0){
            return true
        }else{
            alert(`Sera aceito apenas numeros multiplos de ${multipleNumber}`)
        }
    }

    async function UpdateOrder(e:FormEvent){
        e.preventDefault()

        if(amount<=0){
            alert("O quantidade deve ser maior que zero")
            return  
        }
        const Validated = VerifyMultiples(amount,unitAllowBuy)

        if(!Validated){
            return
        }
        const data = {
            id:id,
            item:{
                product:product,
                amount:amount,
                unitPrice:unitPrice
            }
        }

        await api.put("/order",data)
        .then(()=>{
            alert("Pedido atualizado com sucesso")
        })
        .catch((err)=>{
            alert("Erro ao atualizar pedido")
        })
    }

   
    //Usado para buscar as referencias para comparação referente a rentabilidade e busca de todos os produtos
    useEffect(()=>{
    async function SetUnitAllowBuyAndPriceBase(){ 
// eslint-disable-next-line 
        data.map((e:ProductsData)=>{
            if(e.name===product){
                setUnitAllowBuy(e.unitAllowBuy)
                setPriceBase(e.UnitPrice)
            }
        })
        }
        SetUnitAllowBuyAndPriceBase()
    
    },[product])



    useEffect(()=>{
        function CheckToNeedVerifyPrice(){
            if(product===""){
                return 
            }
            VerifyPrice(unitPrice,priceBase)
        }
        CheckToNeedVerifyPrice()
        // eslint-disable-next-line 
    },[unitPrice])


    return(
        <div className="order-container">
        <header>
            Alterar pedido
        </header>
<form onSubmit={(e)=>UpdateOrder(e)}>
    <div className="form-container">
   <div className="search">     
    <label>ID do pedido:</label>
    <input onChange={(e)=>setId(e.target.value)}></input>
    <img onClick={()=>SearchOrderAndSetInputValues()} src={search} alt="search"></img>
    </div>
   <h1 id="title-order">Pedido</h1>

   <label>Produto:</label>
    <select onChange={e=>setProduct(e.target.value)} disabled={inputDisable}>

        {
            
            allProducts.map((e:any)=>{
                if(product==="" ||  allProducts===[]){
                    return 
                }
                if(e===product){
                    return(
                        <option key={e.name} selected>{e.name}</option>
                    )
                }
                    else{
                        return(
                            <option key={e.name}>{e.name}</option>
                        )
                    }
            })
        }
    </select>

    <label >Quantidade:</label>
    <input 
    onChange={(e)=>{
        if(isNaN(Number(e.target.value))){
            alert("O elemento digitado deve ser um numero")
            return 
        }
        else{
            setAmount(Number((e.target.value)))
        }
    }} 
    value={amount} 
    disabled={inputDisable}>

    </input>
    <div className="price-container">
    <label>Preço unitario:</label>
    <Feedback hidden={hidden} color={color} content={content}/>
    </div>
    <input onChange={(e)=>{
        
         const value = e.target.value
         const newValue  = value.substring(1).substring(1).replace(",","").replace(".","")
         const numberValue = Number(newValue)
    
         if(isNaN(numberValue)){
             alert("O caracter digitado não é um numero")
             return 
         }

         setUnitPrice(numberValue)
    }} 
    value={`R$${unitPrice}`}
    disabled={inputDisable}>

    </input>

    
<div id="buttons-container">
   <Link to="/">
   <button>Criar um novo pedido</button>
   </Link> 
    <button type="submit">Concluir </button>
    </div>
   
    </div>
</form>
</div>
    )
}